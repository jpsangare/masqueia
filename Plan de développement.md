# 📋 Plan de développement, d’amélioration et de maintenance

**MasqueIA** — état en juillet 2026, version 1.4.0.
Ce document fait référence pour l’orientation du projet. Mettez-le à jour à chaque version.

---

## 1. État actuel (v1.4.0)

- **Backend :** Flask + Microsoft Presidio 2.2.354 + spaCy `fr_core_news_md` + `en_core_web_md`, port **7000** (configurable via `PRESIDIO_PORT`), loopback uniquement (IPv4+IPv6), sans authentification (décision délibérée : service exclusivement local).
- **Extension Chrome :** Manifest V3, trois mécanismes : anonymisation au collage (Ctrl+V, la méthode la plus fiable), raccourci Ctrl+Shift+A, interception du bouton « Envoyer ».
- **Windows pour débutants :** `Uruchom-Windows.bat` (installation et démarrage en un clic, installation automatique de Python via winget), `Autostart-Windows.bat`, guide `WINDOWS.md`.
- **Entités :** 28 types, priorité aux données polonaises (PESEL, NIP, REGON, carte d’identité, passeport) et aux données internationales.

### Limites connues
- Les journaux du tableau de bord conservent **le texte original contenant des PII en mémoire** (fonctionnalité de consultation, mais cela doit être clairement indiqué ; voir 3.2).
- La détection de `PERSON`/`LOCATION` dépend de la qualité du modèle spaCy `md` ; des omissions et des faux positifs peuvent se produire.
- L’interception du bouton « Envoyer » repose sur une heuristique de texte du bouton, fragile lorsque l’interface de ChatGPT/Claude change.
- Aucune suite de tests automatisés ni CI dans ce dépôt.

---

## 2. Organisation du projet (à traiter en premier, environ une soirée)

Prioritaire, car l’état actuel présente un risque de perte de travail :

1. **Résoudre le désordre des répertoires sur le disque.** Le répertoire `~/projects/personal/presidio-local-anonymizer` correspond en réalité au dépôt **second-mind** (le remote pointe vers `second-mind.git`), auquel a été superposé un backend expérimental « v2.0.0 ». Le dépôt du projet se trouve dans `~/projects/personal/presidio-anon-fresh`. Plan :
   - extraire le code utile de v2.0.0 (commit `4787c48` : désanonymisation, traitement par lots, plugins, multilingue) vers une branche distincte de CE dépôt (`git format-patch` / copie de fichiers) ;
   - restaurer second-mind à son état propre (`git revert`/`reset` de la superposition Presidio) ;
   - renommer les répertoires : `presidio-anon-fresh` → `presidio-local-anonymizer`, et l’actuel `presidio-local-anonymizer` → `second-mind`.
2. **Clés privées :** les fichiers `*.pem` et `*.crx` se trouvent sans protection dans l’ancien répertoire. Ne jamais les committer (`.gitignore` les exclut déjà) ; déplacer `.pem` dans un emplacement sécurisé hors du dépôt (nécessaire pour mettre à jour l’extension en dehors du Web Store).
3. **Créer un commit et pousser v1.4.0** (migration du port, corrections et démarrage Windows en un clic) ; les modifications sont actuellement uniquement locales.
4. **Tag `v1.4.0` + GitHub Release** avec l’archive ZIP de l’extension : les débutants pourront télécharger la Release au lieu de cloner le dépôt.

---

## 3. Améliorations à court terme (v1.4.x → v1.5, horizon de 1 à 2 mois)

### 3.1 Qualité et fiabilité
- **Tests pytest** pour l’API (`/api/health`, `/api/anonymize`, `/api/logs`) et tests de détection d’entités sur un corpus d’exemples polonais (PESEL avec ou sans séparateurs, NIP avec tirets, téléphones dans différents formats). Des tests prêts à adapter pour v2 se trouvent dans l’ancien répertoire.
- **CI GitHub Actions :** lint (ruff) + pytest à chaque push ; job de création de l’archive ZIP de l’extension lors d’un tag.
- **Smoke test de l’extension :** enrichir `test-extension.html` avec un scénario automatisé (coller → vérifier le résultat).

### 3.2 Confidentialité
- Bouton dans le tableau de bord : « enregistrer uniquement les statistiques (sans le contenu) » — ACTIVÉ par défaut ; journaux complets avec le contenu en opt-in.
- Examiner les journaux du backend (seuls les types d’entités sont actuellement enregistrés, pas leurs valeurs — conserver cette règle).

### 3.3 Détection (valeur centrale du produit)
- Validation des sommes de contrôle : PESEL (chiffre de contrôle + date), NIP, REGON, IBAN — permet d’augmenter la précision d’environ 90 % à près de 100 % et d’éliminer les faux positifs sur des suites de chiffres aléatoires.
- Renforcement contextuel de Presidio (`context words` : « pesel », « nip », « tel. ») pour obtenir des scores plus élevés.
- Benchmark : mini-corpus de 100 phrases polonaises avec PII annotées + script de calcul de la précision et du rappel ; sans cela, chaque modification de motif revient à avancer à l’aveugle.

### 3.4 Distribution
- **Chrome Web Store** — publication (matériel prêt selon CHROME-WEB-STORE.md) ; cela supprime l’étape la plus difficile pour les débutants (« Mode développeur » + « Charger l’extension non empaquetée »).
- Envisager **Edge Add-ons** (même package MV3, forte portée en entreprise).

---

## 4. Orientations à moyen terme (v2.0, horizon de 3 à 6 mois)

Les fondations existent déjà dans le commit v2.0.0 abandonné (voir le point 2.1) ; porter chaque élément progressivement, avec des tests :

1. **Pseudonymisation cohérente + désanonymisation :** `Jan Kowalski` → `[PERSONNE_1]` (une même personne reçoit toujours le même marqueur) et table inverse conservée localement, afin de pouvoir « désanonymiser » la réponse de l’IA en un clic. Fonctionnalité phare par rapport au simple masquage.
2. **Batch API** — anonymisation de fichiers/de plusieurs textes (base pour de futurs usages hors navigateur : CLI, intégrations).
3. **Multilingue** — moteur anglais en plus du polonais (pris en charge nativement par Presidio ; nécessite un deuxième modèle spaCy).
4. **Plugins d’entités** — motifs personnalisés ajoutés par l’utilisateur depuis le tableau de bord (YAML), sans modifier le code.
5. **Firefox** — le manifeste MV3 est compatible à environ 95 % ; les principales différences concernent `browser.*` et `chrome.*`.
6. **Installateur Windows hors ligne/portable** — package intégrant Python (python embeddable + wheels), sans aucun téléchargement pendant l’installation ; éventuellement une application de la zone de notification au lieu de la fenêtre noire.

**Principe (priorité aux revenus, sans précipitation) :** avant de développer les points 2 à 6, confirmer l’usage réel — commencer par la pseudonymisation et le Web Store, car ce sont les fonctionnalités visibles par les utilisateurs.

---

## 5. Maintenance (processus continu)

### Rythme trimestriel (30 à 60 min)
- [ ] `pip list --outdated` dans le venv → mettre à jour **presidio-analyzer/anonymizer** et **spaCy** (attention : une nouvelle version de spaCy peut nécessiter une nouvelle version des modèles `fr_core_news_md` / `en_core_web_md` — toujours tester la détection après la mise à jour).
- [ ] Consulter le changelog de Chrome pour repérer les changements de MV3 (API dépréciées, par exemple le devenir de `document.execCommand`).
- [ ] Tester manuellement trois sites : ChatGPT, Claude, Gmail (leur interface change fréquemment, ce qui peut casser l’heuristique du bouton « Envoyer »).
- [ ] Examiner les issues GitHub.

### Liste de contrôle de publication (chaque version)
1. Incrémenter la version dans : `chrome-extension/manifest.json`, `backend/api/health.py`, badge et pied de page dans `README.md`.
2. Vérifier que les tests passent (pytest + smoke test manuel sur ChatGPT).
3. Créer l’archive ZIP de l’extension : contenu de `chrome-extension/` (sans `.pem` !), nommée `presidio-extension-vX.Y.Z.zip`.
4. Créer le tag `vX.Y.Z` + GitHub Release avec l’archive ZIP et les notes de version.
5. (Après publication dans le Web Store) téléverser le nouveau package dans la console développeur.

### Règles impératives
- **Ne jamais** committer des fichiers `*.pem`, `*.crx` ni des journaux contenant des PII.
- Port par défaut **7000** — modifications uniquement via `PRESIDIO_PORT` et dans les options de l’extension.
- Le backend écoute **uniquement sur loopback** — ne jamais utiliser `0.0.0.0` sans ajouter d’authentification.
- Toute modification des motifs d’entités doit être suivie d’un benchmark précision/rappel (point 3.3).

---

## 6. Indicateurs de réussite

| Indicateur | Actuel | Objectif v1.5 | Objectif v2.0 |
|---|---|---|---|
| Temps d’installation pour un débutant (Windows) | ~10 min (1 clic) | ~5 min (Web Store + 1 clic) | ~3 min (portable) |
| Précision sur le corpus polonais | non mesurée | ≥0.95 | ≥0.97 |
| Rappel sur le corpus polonais | non mesuré | ≥0.90 | ≥0.93 |
| Tests automatisés | 0 | API + corpus dans CI | + tests de l’extension |
| Canaux de distribution | GitHub ZIP | + Chrome Web Store | + Edge, Firefox |
