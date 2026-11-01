"""
Configuration des entités : fichier local (config/entities.yaml) et configuration d'équipe.

La configuration d'équipe est un fichier partagé (.xlsx exporté depuis MasqueIA, ou .yaml
au format d'entities.yaml), par exemple sur un partage réseau. Ses entités remplacent les
entités locales du même nom et son seuil s'impose. Une copie de la dernière lecture réussie
est conservée pour continuer à fonctionner hors du réseau.

Source : variable MASQUEIA_TEAM_CONFIG (déploiement par l'IT), sinon le chemin choisi
dans l'extension (data/team.json).
"""

import json
import logging
import os
import re
from datetime import datetime
from pathlib import Path

import yaml

from core.config_excel import ExcelConfigError, from_xlsx
from core.validators import VALIDATORS

logger = logging.getLogger("app.config_store")

BACKEND_DIR = Path(__file__).resolve().parent.parent
CONFIG_PATH = BACKEND_DIR / "config" / "entities.yaml"
DATA_DIR = BACKEND_DIR / "data"
TEAM_ENV = "MASQUEIA_TEAM_CONFIG"
TEAM_FORMATS = (".xlsx", ".yaml", ".yml")


class TeamConfigError(ValueError):
    """Configuration d'équipe illisible ou invalide (message destiné à l'utilisateur)."""


def load_local() -> dict:
    with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
        return yaml.safe_load(f)


def save_local(config: dict) -> None:
    with open(CONFIG_PATH, 'w', encoding='utf-8') as f:
        yaml.dump(config, f, allow_unicode=True, default_flow_style=False)


def invalid_entities(entities: dict):
    """(erreur, message) pour la première entité invalide, sinon None."""
    for entity_name, entity_cfg in entities.items():
        if not re.fullmatch(r'[A-Z][A-Z0-9_]*', entity_name):
            return 'Invalid entity name', (f"Nom d'entité invalide : {entity_name} "
                                           "(majuscules, chiffres et _ uniquement)")
        if not isinstance(entity_cfg, dict):
            return 'Invalid entity', f"Entité invalide : {entity_name}"
        validator = entity_cfg.get('validator')
        if validator and validator not in VALIDATORS:
            return 'Invalid validator', (f"Validateur inconnu pour {entity_name} : {validator} "
                                         f"(valeurs possibles : {', '.join(VALIDATORS)})")
        for pattern in entity_cfg.get('patterns', []):
            try:
                re.compile(pattern['regex'])
            except (re.error, KeyError, TypeError) as e:
                return 'Invalid regex', f"Motif invalide pour {entity_name} : {e}"
    return None


# --- Configuration d'équipe -------------------------------------------------

def _settings_file() -> Path:
    return DATA_DIR / "team.json"


def _cache_file() -> Path:
    return DATA_DIR / "team-cache.json"


def team_source() -> tuple[str | None, bool]:
    """(chemin, imposé par la variable d'environnement)."""
    env = os.environ.get(TEAM_ENV, "").strip()
    if env:
        return env, True
    try:
        source = json.loads(_settings_file().read_text(encoding="utf-8")).get("source")
    except (OSError, ValueError):
        return None, False
    return source or None, False


def read_team_file(source: str) -> tuple[float | None, dict]:
    """Lit et valide un fichier d'équipe : (seuil ou None, entités)."""
    path = Path(source)
    if path.suffix.lower() not in TEAM_FORMATS:
        raise TeamConfigError(f"Format non pris en charge : {path.suffix or 'sans extension'} "
                              f"(attendu : {', '.join(TEAM_FORMATS)})")
    try:
        content = path.read_bytes()
    except OSError as e:
        raise TeamConfigError(f"Fichier inaccessible : {source} ({e.strerror or e})") from e

    if path.suffix.lower() == ".xlsx":
        try:
            threshold, entities = from_xlsx(content)
        except ExcelConfigError as e:
            raise TeamConfigError(str(e)) from e
    else:
        try:
            data = yaml.safe_load(content.decode("utf-8")) or {}
        except (yaml.YAMLError, UnicodeDecodeError) as e:
            raise TeamConfigError(f"YAML illisible : {e}") from e
        if not isinstance(data, dict) or not isinstance(data.get("entities"), dict):
            raise TeamConfigError("Le fichier YAML doit contenir une clé « entities »")
        threshold, entities = data.get("threshold"), data["entities"]

    if not entities:
        raise TeamConfigError("Aucune entité dans la configuration d'équipe")
    invalid = invalid_entities(entities)
    if invalid:
        raise TeamConfigError(invalid[1])
    if threshold is not None and not (isinstance(threshold, (int, float)) and 0 <= threshold <= 1):
        raise TeamConfigError(f"Seuil invalide : {threshold} (entre 0 et 1)")
    return threshold, entities


def set_team_source(source: str | None) -> None:
    """Enregistre le chemin choisi (None pour retirer) après l'avoir validé."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if source:
        _write_cache(source, *read_team_file(source))
        _settings_file().write_text(json.dumps({"source": source}, ensure_ascii=False), encoding="utf-8")
    else:
        _settings_file().unlink(missing_ok=True)
        _cache_file().unlink(missing_ok=True)


def _write_cache(source: str, threshold, entities: dict) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    _cache_file().write_text(json.dumps({
        "source": source,
        "loaded_at": datetime.now().isoformat(timespec="seconds"),
        "threshold": threshold,
        "entities": entities,
    }, ensure_ascii=False), encoding="utf-8")


def load_team() -> dict:
    """
    État de la configuration d'équipe :
    {source, from_env, status: none|ok|cache|error, message, loaded_at, threshold, entities}
    """
    source, from_env = team_source()
    state = {"source": source, "from_env": from_env, "status": "none", "message": "",
             "loaded_at": None, "threshold": None, "entities": {}}
    if not source:
        return state
    try:
        threshold, entities = read_team_file(source)
    except TeamConfigError as e:
        try:
            cache = json.loads(_cache_file().read_text(encoding="utf-8"))
        except (OSError, ValueError):
            cache = None
        if cache and cache.get("source") == source:
            logger.warning("Configuration d'équipe illisible (%s) : copie du %s utilisée", e, cache["loaded_at"])
            state.update(status="cache", message=str(e), loaded_at=cache["loaded_at"],
                         threshold=cache.get("threshold"), entities=cache.get("entities") or {})
        else:
            logger.error("Configuration d'équipe illisible et sans copie locale : %s", e)
            state.update(status="error", message=str(e))
        return state
    _write_cache(source, threshold, entities)
    state.update(status="ok", loaded_at=datetime.now().isoformat(timespec="seconds"),
                 threshold=threshold, entities=entities)
    return state


def effective_config() -> tuple[dict, dict]:
    """(configuration en vigueur, état de l'équipe) : l'équipe l'emporte sur le local."""
    config = load_local()
    team = load_team()
    config.setdefault("entities", {}).update(team["entities"])
    if team["threshold"] is not None:
        config["threshold"] = team["threshold"]
    return config, team
