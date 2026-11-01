"""
Module d'analyse des données personnelles utilisant Presidio AnalyzerEngine.
Configure les moteurs NLP pour le français et l'anglais et ajoute des recognizers personnalisés.
"""

import os
import re
from typing import Dict, Any
import logging

from presidio_analyzer import AnalyzerEngine, PatternRecognizer, Pattern
from presidio_analyzer.nlp_engine import SpacyNlpEngine, NlpEngineProvider
from presidio_analyzer import RecognizerResult
from presidio_analyzer.entity_recognizer import EntityRecognizer
from presidio_analyzer.predefined_recognizers import CreditCardRecognizer

from core.config_store import effective_config

logger = logging.getLogger("app.analyzer")

SPACY_MODELS = {
    "fr": "fr_core_news_md",
    "en": "en_core_web_md",
}
SUPPORTED_LANGUAGES = list(SPACY_MODELS.keys())



def missing_spacy_models() -> list[str]:
    """Renvoie les modèles SpaCy requis qui ne sont pas installés."""
    import spacy.util
    return [m for m in SPACY_MODELS.values() if not spacy.util.is_package(m)]


def build_analyzer() -> tuple[AnalyzerEngine, Dict[str, Any]]:
    """
    Construit et configure Presidio AnalyzerEngine avec des modèles NLP français et anglais.

    Returns:
        tuple: (analyzer, config) - analyseur configuré et configuration chargée
    """
    # Configuration locale complétée par la configuration d'équipe
    config, team = effective_config()
    if team["status"] != "none":
        logger.info("Configuration d'équipe (%s) : %d entité(s), état %s",
                    team["source"], len(team["entities"]), team["status"])

    # Configuration des modèles SpaCy pour le français et l'anglais
    nlp_configuration = {
        "nlp_engine_name": "spacy",
        "models": [
            {"lang_code": lang, "model_name": model}
            for lang, model in SPACY_MODELS.items()
        ]
    }

    missing = missing_spacy_models()
    if missing:
        commands = " && ".join(f"python -m spacy download {m}" for m in missing)
        raise RuntimeError(
            f"Modèles SpaCy manquants : {', '.join(missing)}. Installez-les avec : {commands}"
        )

    try:
        nlp_engine = NlpEngineProvider(nlp_configuration=nlp_configuration).create_engine()
        logger.info("Moteur NLP SpaCy initialisé pour : %s", ", ".join(SUPPORTED_LANGUAGES))
    except Exception as e:
        logger.error(f"Erreur lors de l'initialisation du moteur NLP : {e}")
        commands = " && ".join(f"python -m spacy download {m}" for m in SPACY_MODELS.values())
        raise RuntimeError(
            "Impossible d'initialiser les modèles SpaCy. "
            f"Vérifiez qu'ils sont installés : {commands}"
        ) from e

    # Créer AnalyzerEngine
    analyzer = AnalyzerEngine(nlp_engine=nlp_engine, supported_languages=SUPPORTED_LANGUAGES)
    # Le NER passe uniquement par SpacyLabelRecognizer (filtré), pas par le recognizer intégré
    analyzer.registry.remove_recognizer("SpacyRecognizer")

    # Presidio n'enregistre la détection des cartes bancaires que pour l'anglais
    analyzer.registry.add_recognizer(CreditCardRecognizer(supported_language="fr"))

    # Ajouter des recognizers personnalisés (motifs regex) pour chaque langue
    _add_custom_recognizers(analyzer, config)

    # Ajouter le recognizer SpaCy pour les étiquettes NER de chaque langue
    _add_spacy_recognizers(analyzer, config)

    logger.info(f"Analyseur prêt. Entités prises en charge : {list(config['entities'].keys())}")

    return analyzer, config


def _add_custom_recognizers(analyzer: AnalyzerEngine, config: Dict[str, Any]) -> None:
    """
    Ajoute des recognizers personnalisés basés sur des motifs pour les entités configurées.

    Options YAML par entité :
        patterns: liste de {name, regex, score}
        context: mots de contexte qui renforcent le score (optionnel)
        validator: nom d'un validateur de core.validators (optionnel)

    Args:
        analyzer: AnalyzerEngine auquel ajouter les recognizers
        config: Dictionnaire de configuration chargé depuis YAML
    """
    from core.validators import VALIDATORS

    for entity_name, entity_config in config['entities'].items():
        patterns = entity_config.get('patterns')

        if not patterns:
            continue  # Ignorer les entités sans motif regex

        # Préparer la liste de motifs pour PatternRecognizer
        pattern_list = []
        for pattern in patterns:
            pattern_list.append(Pattern(
                name=pattern['name'],
                regex=pattern['regex'],
                score=pattern['score']
            ))

        context = entity_config.get('context')
        validator_name = entity_config.get('validator')
        validator = VALIDATORS.get(validator_name) if validator_name else None
        if validator_name and validator is None:
            logger.warning(f"Validateur inconnu « {validator_name} » pour {entity_name}, ignoré")

        strict = entity_config.get('strict_validation', True)

        for language in SUPPORTED_LANGUAGES:
            recognizer = ValidatedPatternRecognizer(
                supported_entity=entity_name,
                patterns=pattern_list,
                supported_language=language,
                context=context,
                validator=validator,
                strict=strict
            )
            analyzer.registry.add_recognizer(recognizer)

        logger.info(f"Recognizer personnalisé ajouté pour : {entity_name} ({len(pattern_list)} motifs)")


class ValidatedPatternRecognizer(PatternRecognizer):
    """
    PatternRecognizer avec validation par somme de contrôle optionnelle.

    strict=False : une clé invalide garde le score du motif au lieu de 0
    (une saisie erronée reste une donnée personnelle à masquer).
    """

    def __init__(self, *args, validator=None, strict=True, **kwargs):
        super().__init__(*args, **kwargs)
        self._validator = validator
        self._strict = strict

    def validate_result(self, pattern_text: str):
        if self._validator is None:
            return None
        if self._validator(pattern_text):
            return True
        return False if self._strict else None


SPACY_LABEL_MAPPINGS = {
    "fr": {
        "PER": "PERSON",
        "LOC": "LOCATION",
        "ORG": "ORGANIZATION",
    },
    "en": {
        "PERSON": "PERSON",
        "GPE": "LOCATION",
        "LOC": "LOCATION",
        "FAC": "LOCATION",
        "ORG": "ORGANIZATION",
    },
}


JOB_TITLE_PREFIX = re.compile(
    r"(?:\b(?:poste|fonction|métier|emploi|titre)\s+(?:de|d['’])|\ben\s+tant\s+que|\bjob\s+title:?|\bas\s+an?)\s*$",
    re.IGNORECASE,
)


# Suite d'un nom en capitales que spaCy coupe souvent (« Jean-Pierre DE | LA FONTAINE »)
UPPERCASE_NAME_TAIL = re.compile(r"(?:[ \t]+(?:[DL]['’])?[A-ZÀ-Ý][A-ZÀ-Ý\-]+)+")

# Début de ligne, éventuellement après une puce ou un séparateur (« - », « --- », « • »)
LINE_START = re.compile(r"(?:^|\n)[ \t]*(?:[-–—•*]+[ \t]*)*$")

# Caractères absents des noms de personnes, lieux et organisations (« Mozilla/5.0 », « FB:9A »)
NON_NAME_CHARS = re.compile(r"[/:@_=]")


def _ner_span(text: str, ent, entity: str):
    """
    Bornes (début, fin) d'une entité NER après nettoyage, ou None si c'est un faux positif.

    - spaCy déborde parfois sur la ligne suivante (« CI002847561\\n- IBAN ») :
      l'entité est coupée au premier saut de ligne ;
    - les mots en minuscules en tête de lieu ou d'organisation sont retirés
      (« ville de Genève » → « Genève », « rue de » → rien) ;
    - un nom commun seul, en début de ligne ou en capitales, n'est pas un nom propre
      (« Identifiants : », « Commande exécutée », « RAPPORT D'INCIDENT », « NE PAS »).
    """
    tokens = []
    for tok in ent:
        if "\n" in tok.text:
            break
        tokens.append(tok)
    if entity in ("LOCATION", "ORGANIZATION"):
        while tokens and not tokens[0].text[:1].isupper():
            tokens = tokens[1:]
    while tokens and tokens[-1].is_space:
        tokens = tokens[:-1]
    if not tokens:
        return None

    start, end = tokens[0].idx, tokens[-1].idx + len(tokens[-1].text)
    span = text[start:end]
    if NON_NAME_CHARS.search(span):
        return None
    if not any(tok.pos_ in ("PROPN", "X") for tok in tokens):
        if span.isupper() or LINE_START.search(text, 0, start):
            return None
    return start, end


def _add_spacy_recognizers(analyzer: AnalyzerEngine, config: Dict[str, Any]) -> None:
    """
    Ajoute, pour chaque langue prise en charge, un recognizer associant les étiquettes NER
    de SpaCy aux entités Presidio (PERSON, LOCATION, ORGANIZATION).

    Faux positifs écartés : les mots de contexte des identifiants (« SIRET » lu comme
    organisation) et les intitulés de poste lus comme lieux (« poste de … »).
    """
    keywords = {
        word.casefold()
        for entity_config in config['entities'].values()
        for word in entity_config.get('context') or []
    } | {
        entity_config.get('mask', '').strip('[]').casefold()
        for entity_config in config['entities'].values()
    }

    class SpacyLabelRecognizer(EntityRecognizer):
        """Recognizer associant les étiquettes SpaCy d'une langue aux entités Presidio."""

        def __init__(self, language: str, mapping: Dict[str, str]):
            self.mapping = mapping
            super().__init__(
                supported_entities=sorted(set(mapping.values())),
                supported_language=language,
                name=f"SpacyLabelRecognizer_{language}"
            )

        def load(self) -> None:
            """Charger le modèle — non requis pour ce recognizer."""
            pass

        def analyze(self, text: str, entities: list, nlp_artifacts=None):
            results = []

            if not nlp_artifacts or not hasattr(nlp_artifacts, 'entities'):
                return results

            for ent in nlp_artifacts.entities:
                # Presidio peut avoir déjà converti l'étiquette (PER → PERSON)
                presidio_entity = self.mapping.get(ent.label_) or (
                    ent.label_ if ent.label_ in self.supported_entities else None
                )

                if not presidio_entity or presidio_entity not in entities:
                    continue
                span = _ner_span(text, ent, presidio_entity)
                if span is None:
                    continue
                start, end = span
                if text[start:end].casefold() in keywords:
                    continue
                if presidio_entity in ("LOCATION", "ORGANIZATION"):
                    if JOB_TITLE_PREFIX.search(text[max(0, start - 30):start]):
                        continue
                    if text[start:end].islower() and " " not in text[start:end]:
                        continue
                if presidio_entity == "PERSON":
                    tail = UPPERCASE_NAME_TAIL.match(text, end)
                    if tail:
                        end = tail.end()
                results.append(RecognizerResult(
                    entity_type=presidio_entity,
                    start=start,
                    end=end,
                    score=0.85
                ))

            return results

    for language, mapping in SPACY_LABEL_MAPPINGS.items():
        analyzer.registry.add_recognizer(SpacyLabelRecognizer(language, mapping))
        logger.info("Recognizer des étiquettes SpaCy ajouté pour la langue : %s", language)

def get_supported_entities(config: Dict[str, Any]) -> list[str]:
    """
    Renvoie la liste des noms d'entités activées dans la configuration.

    Args:
        config: Dictionnaire de configuration

    Returns:
        list: Liste des noms d'entités activées
    """
    enabled_entities = []
    for entity_name, entity_config in config['entities'].items():
        if entity_config.get('enabled', True):
            enabled_entities.append(entity_name)
    return enabled_entities
