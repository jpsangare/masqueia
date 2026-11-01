# Publication sur le Chrome Web Store

Tout ce qu’il faut pour envoyer MasqueIA au Chrome Web Store, avec les textes prêts à coller dans la console développeur.

## 1. Préparer le paquet

```bash
python scripts/build_store_package.py
```

Le script produit `dist/masqueia-store-<version>.zip` : la copie de `chrome-extension/` **sans le champ `key`**, que le Store refuse. Le dossier `chrome-extension/` n’est pas modifié : la version chargée en mode développeur garde son ID, et les données déjà chiffrées restent lisibles.

À chaque nouvelle version, augmentez `version` dans `chrome-extension/manifest.json` avant de relancer le script.

## 2. Premier envoi

1. Créez un compte sur la [console développeur du Chrome Web Store](https://chrome.google.com/webstore/devconsole) (frais uniques d’environ 5 $).
2. *Nouvel élément* → envoyez le `.zip`.
3. **Reportez l’ID attribué** (32 lettres, visible dans l’URL de l’élément) dans `STORE_EXTENSION_ID` de `backend/app.py`, puis redémarrez le moteur. Sans cela, le moteur refuse la version du Store (« Origine non autorisée »). Les deux versions, développeur et Store, sont alors acceptées.
4. Remplissez les onglets avec les textes ci-dessous, puis *Envoyer pour examen*.

### Visibilité

- **Non répertorié** : installable par toute personne qui a le lien ; idéal pour une équipe ou des clients.
- **Privé** : réservé à votre domaine Google Workspace.
- **Public** : visible dans les recherches du Store.

Avec la version du Store, l’IT peut imposer l’extension sur les postes gérés (stratégie `ExtensionInstallForcelist` avec l’ID du Store) : plus de mode développeur, mises à jour automatiques.

## 3. Fiche (onglet « Fiche Play Store »)

**Nom :** MasqueIA

**Résumé (132 caractères max.) :**
> Masque vos données personnelles avant de les envoyer à une IA, puis les rétablit dans la réponse. Traitement 100 % local.

**Description :**
> MasqueIA remplace automatiquement les données personnelles (noms, e-mails, téléphones, IBAN, numéros de sécurité sociale, cartes bancaires, adresses…) par des jetons au moment où vous collez un texte dans un assistant d’IA ou un autre site. L’IA ne voit jamais les vraies valeurs. Dans sa réponse, un bouton « Désanonymiser » rétablit les valeurs d’origine, sur votre écran uniquement.
>
> ⚠️ MasqueIA nécessite son moteur d’anonymisation, installé sur votre ordinateur (gratuit, open source) : https://github.com/jpsangare/masqueia — sous Windows, un double-clic sur Installer-MasqueIA.bat suffit.
>
> Confidentialité :
> • Tout le traitement a lieu sur votre ordinateur : l’extension ne parle qu’au moteur local (localhost).
> • Aucune donnée n’est envoyée à un serveur MasqueIA ni à un tiers ; aucun compte n’est nécessaire.
> • Les correspondances entre jetons et valeurs sont chiffrées, avec une clé gardée dans le coffre du système.
>
> Fonctions :
> • Anonymisation au collage, sur n’importe quel site
> • Désanonymisation des réponses en un clic
> • Espaces de travail aux jetons stables, pour les projets et les RAG des IA en ligne
> • Anonymisation de fichiers (PDF, Word, Excel, PowerPoint, images)
> • Règles personnalisables, import/export Excel, configuration d’équipe partagée
> • Interface en français et en anglais

**Catégorie :** Productivité (ou Outils)
**Langue :** français

**Images à fournir :** icône 128×128 (`chrome-extension/icons/icon-128.png`), au moins une capture 1280×800 ou 640×400, et une petite image promotionnelle 440×280 (facultative pour un élément non répertorié). Sur les captures, évitez de mettre en avant les logos de ChatGPT, Claude ou Gemini (risque de refus pour usage de marque) : utilisez de préférence une page de démonstration neutre.

## 4. Onglet « Confidentialité »

**Objectif unique :**
> Protéger les données personnelles de l’utilisateur en les masquant dans le texte qu’il colle sur un site, puis en les rétablissant à l’affichage, grâce à un moteur d’anonymisation installé sur son ordinateur.

**Justification des autorisations :**

| Autorisation | Justification |
|---|---|
| `<all_urls>` (scripts de contenu) | L’utilisateur peut coller des données personnelles sur n’importe quel site (assistants d’IA, messageries, outils en ligne). Le script intercepte uniquement l’événement de collage pour masquer le texte, et ajoute un bouton « Désanonymiser » aux réponses qui contiennent des jetons. Il ne lit pas le reste de la page et ne transmet rien d’autre. |
| `host_permissions` sur `http://localhost:7000` et `http://127.0.0.1:7000` | Seule destination réseau de l’extension : le moteur d’anonymisation installé par l’utilisateur sur son propre ordinateur. |
| `storage` | Mémoriser les préférences : activation, langue, espace de travail actif. |
| `clipboardRead` | Bouton « Coller » du panneau latéral : il colle la réponse de l’IA copiée par l’utilisateur pour la désanonymiser. |
| `contextMenus` | Proposer « Anonymiser la sélection » dans le menu contextuel. |
| `activeTab` | Remplacer la sélection dans l’onglet courant quand l’utilisateur choisit « Anonymiser la sélection ». |
| `sidePanel` | Afficher les réglages, l’historique et la désanonymisation dans le panneau latéral. |

**Code distant :** Non, je n’utilise pas de code distant. Tout le code est dans le paquet ; le moteur local ne renvoie que des données (JSON).

**Utilisation des données :** cochez *Informations personnelles identifiables* et *Contenu du site Web* (le texte collé par l’utilisateur), puis cochez les trois certifications :
- je ne vends ni ne transfère les données des utilisateurs à des tiers, hors des cas d’utilisation approuvés ;
- je n’utilise ni ne transfère les données des utilisateurs à des fins sans rapport avec l’objectif unique de l’élément ;
- je n’utilise ni ne transfère les données des utilisateurs pour déterminer la solvabilité ou à des fins de prêt.

**URL des règles de confidentialité :** https://github.com/jpsangare/masqueia/blob/main/PRIVACY_POLICY.md

## 5. Instructions pour l’examinateur (onglet « Accès de test »)

> MasqueIA needs its local engine, which runs on the user’s computer. No account or login is required.
>
> 1. On Windows, download https://github.com/jpsangare/masqueia (Code → Download ZIP), extract it and double-click Installer-MasqueIA.bat. It installs Python if needed, the engine and its French/English language models (5–10 minutes), then starts the engine on http://localhost:7000.
>    (macOS/Linux: run ./install-mac.sh or ./install-linux.sh.)
> 2. Install the extension from the Store, then open any site with a text field (for example https://chatgpt.com or a plain textarea page).
> 3. Paste: “Contact Jean Dupont, jean.dupont@example.com, +33 6 12 34 56 78”. The pasted text becomes tokens such as [PERSON_1_…] and [EMAIL_ADDRESS_1_…].
> 4. When a response containing these tokens is displayed, click “Désanonymiser” to see the original values again.
> 5. The side panel (extension icon) shows the engine status, settings and history.
>
> If the engine is not running, the extension shows “engine unavailable” and leaves the pasted text untouched.

Joindre une courte vidéo (installation du moteur, collage, désanonymisation) accélère l’examen.

## 6. Points d’attention lors de l’examen

- `<all_urls>` déclenche un examen approfondi : comptez de quelques jours à quelques semaines. Pour l’accélérer, on peut limiter les scripts de contenu aux sites d’IA connus et demander les autres sites à la volée (`optional_host_permissions`).
- Un refus pour « fonctionnalité minimale » arrive quand l’examinateur ne parvient pas à faire tourner le moteur : les instructions ci-dessus et la vidéo l’évitent.
