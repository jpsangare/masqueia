# 🔀 Synthèse de relais — MasqueIA

> Document de passation pour une autre IA ou un nouveau développeur.
> Dernière mise à jour : 2026-10-29.

## 1. Ce qu'est le projet

Extension Chrome + backend Python local qui **anonymisent les données personnelles** lors d'un collage de texte (ChatGPT, Claude, Gmail…). Tout tourne en local : `http://localhost:7000`, aucune donnée ne sort de la machine.

- **Dépôt distant :** `https://github.com/jpsangare/masqueia` (remote `origin` déjà basculé de `gacabartosz` vers `jpsangare`).
- **Langues NLP :** français + anglais (le polonais a été remplacé — voir §4).
- **Langue de l'UI :** français par défaut, anglais disponible.

## 2. ⚠️ État Git — IMPORTANT

**Aucun commit n'a été fait.** Tout le travail récent est dans le working tree, mélangé à des modifications préexistantes de l'utilisateur. Avant toute passe de modifications, faire `git status` / `git diff` et ne **jamais** faire de `reset --hard` ou `checkout` destructeur.

## 3. Architecture

```
chrome-extension/    Extension (MV3) : content-script intercepte le collage,
                     background.js (service worker), popup.html = panneau latéral
                     (sidePanel), options.html, locales.js (fr par défaut)
backend/
  app.py             Flask, CORS localhost+extensions, dual-stack IPv4/IPv6
  api/anonymize.py   POST /api/anonymize, /api/logs, /api/logs/clear, /api/reload
  api/config.py      GET/POST /api/config (source du chemin : core.analyzer.CONFIG_PATH)
  api/patterns.py    POST /api/test-pattern (test de regex à blanc)
  api/health.py      /api/health (+ analyzer_ready, analyzer_error)
  core/analyzer.py   Presidio + spaCy ; SPACY_MODELS = fr_core_news_md + en_core_web_md ;
                     ValidatedPatternRecognizer ; SPACY_LABEL_MAPPINGS
  core/language_detector.py  langdetect (seed=0) ; None → analyse dans les 2 langues
  core/validators.py Luhn, NIR, REGON, NIP
  config/entities.yaml  SEUL fichier à éditer pour ajouter un type de données
web-ui/app.html      Tableau de bord (test, réglages, journaux, panneau "Ajouter")
tests/               Suite pytest (voir §6)
Lancer-Tests.bat / lancer-tests.sh   Lancement des tests hors VS Code
fonctionnement.html  Page vitrine FR expliquant le produit
```

## 4. Décisions clés prises pendant la session

1. **Traduction polonais → français** de toute l'UI/doc/commentaires. Restes volontaires : motifs polonais (PESEL, NIP, REGON…), exemples de test polonais, nom de fichier `Uruchom-Windows.bat` (`JAK-ZACZĄĆ.md` et `PLAN-ROZWOJU.md` sont devenus `Guide pour tous.md` et `Plan de développement.md`).
2. **Extension en panneau latéral droit** : `sidePanel` dans le manifest, `openPanelOnActionClick`, plus de `default_popup`.
3. **Modèles spaCy fr/en** au lieu de `pl_core_news_md` ; marqueur d'installation renommé `install-ok-fr-en.txt` pour forcer le re-téléchargement.
4. **Détection de langue** avant analyse (`langdetect`) : n'exécute que le modèle de la langue détectée ; texte court accepté seulement si confiance ≥ 0,99 ; langue non supportée → les deux modèles. A supprimé 3 faux positifs sur 4.
5. **Entités françaises** : `FR_SECU` (NIR), `FR_SIREN`, `FR_SIRET`, `FR_PLATE`, dates FR sous `DATE_TIME`.
6. **Validateurs par somme de contrôle** (Luhn/NIR/REGON/NIP) : un numéro à la forme correcte mais clé invalide n'est pas détecté. Résout la collision SIREN/REGON (9 chiffres). **PESEL sans validateur volontairement** (l'exemple canonique `92010212345` échoue à sa propre clé).
7. **Seuil `threshold: 0.35`** du YAML désormais réellement appliqué (il était ignoré avant).
8. **Fusion multilingue** : en cas de chevauchement, entité à motif regex > NER, puis meilleur score (`_merge_results`).
9. **Ajout d'entité par UI** : panneau dans Paramètres + `POST /api/config` (validé) + `POST /api/reload` (à chaud, sans redémarrage). La clé : les recognizers sont reconstruits via `build_analyzer()`.

## 5. Pièges connus

- **Encodage console Windows** : toujours `$env:PYTHONIOENCODING='utf-8'` pour les scripts Python avec accents, sinon `UnicodeEncodeError` (cp1252).
- **Fins de ligne** : les `.bat` sont en CRLF ; `git diff --check` signale de faux positifs. Les `.sh` doivent rester LF.
- **`renderSettings` (app.html)** : catégories codées en dur ; les entités personnalisées passent par `renderCustomEntities()` + `entityMeta` (description/mask depuis GET /config).
- **Le renforcement par mots de contexte** Presidio exige les artefacts NLP du pipeline complet — un `recognizer.analyze()` direct ne booste pas le score.
- **`/api/config` en liste** ne modifie que les entités existantes ; le **format dict** permet d'en ajouter.
- **Corpus `known_issue`** : le test échoue *exprès* si un cas marqué se met à passer → retirer l'annotation.
- **`anonymization_logs`** conserve le texte original en mémoire (100 entrées) — point de vigilance vie privée non traité.
- Backend sans authentification sur 7000 (loopback seul, décision assumée).

## 6. Tests

```bat
Lancer-Tests.bat            :: Windows (installe les deps si besoin, CI=1 pour ne pas pauser)
./lancer-tests.sh           :: Mac/Linux
python -m pytest -k api     :: ciblé
```

- **115+ tests**, précision/rappel du corpus (`tests/data/corpus.json`) : 1,00.
- Marqueur `models` : sauté si les modèles spaCy sont absents (avec raison explicite).
- `temp_config` (conftest) : redirige `api.config.CONFIG_PATH` **et** `core.analyzer.CONFIG_PATH` vers une copie — ne jamais écrire dans le vrai YAML depuis un test.
- 1 cas suivi en `known_issue` : « Réunion » capitalisé pris pour un lieu (limite spaCy fr).
- NIR Corse (`2A`/`2B`) non capturé (motif chiffres uniquement).

## 7. Modèles & dépendances

- `fr_core_news_md` et `en_core_web_md` installés sur cette machine (pip/spaCy) pour faire tourner les tests.
- `langdetect==1.0.9` ajouté à `backend/requirements.txt`.
- `pytest.ini` à la racine (`testpaths = tests`, marqueur `models`).

## 8. Prochaines étapes discutées (par priorité)

1. **Motifs FR complémentaires** : IBAN FR (déjà couvert par le recognizer IBAN générique), téléphones FR étendus, adresses postales FR.
2. **Réversibilité** : jetons numérotés stables (`[PERSONNE_1]`…) + désanonymisation de la réponse de l'IA — gros gain d'usage, non commencé.
3. **Assistant regex via LM Studio** (local, API OpenAI-compatible :1234) : bouton « suggérer un motif » dans le panneau d'ajout ; LLM en seconde passe d'analyse = option à étudier (latence 1–10 s vs ~50 ms).
4. **Renommer** `Uruchom-Windows.bat` → `Lancer-Windows.bat` (+ références dans les docs).
5. **Journaux** : masquer le texte original par défaut / option pour désactiver.
6. **Libellés FR** pour SECU/SIREN/SIRET/PLAQUE dans `web-ui/app.html` (l'UI générique les affiche déjà).
7. Commit + push vers le nouveau remote `jpsangare`.

## 9. Vérifications rapides pour reprendre

```powershell
git status                                  # état du working tree (tout est non commité)
python -m pytest -q                         # suite verte attendue
curl http://localhost:7000/api/health       # analyzer_ready: true si backend lancé
```
