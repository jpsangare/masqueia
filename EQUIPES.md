# MasqueIA en équipe

Deux besoins pour déployer MasqueIA dans une équipe : installer vite chaque poste, et faire appliquer à tous les mêmes règles d’anonymisation. Rien ne passe par un serveur ou un cloud : chaque poste garde son moteur local et ses données chiffrées.

## 1. Installer un poste en un clic (Windows)

Double-cliquez sur `Installer-MasqueIA.bat`. Sans droits administrateur, il :

1. installe Python 3.12 si besoin (winget, pour l’utilisateur courant) ;
2. installe les bibliothèques et les modèles français et anglais ;
3. applique la configuration d’équipe si elle est indiquée (voir plus bas) ;
4. démarre le moteur et le relance à chaque ouverture de session ;
5. ouvre la page des extensions (Chrome, Edge ou Brave) avec le chemin de l’extension déjà copié : il reste à activer le mode développeur, cliquer sur « Charger l’extension non empaquetée » et coller le chemin.

Relancer l’installateur est sans risque : il saute ce qui est déjà fait. C’est aussi la façon de mettre à jour un poste après un `git pull`.

Pour retirer le démarrage automatique : `backend\.venv\Scripts\python.exe backend\install_autostart.py --uninstall`.

## 2. Partager une configuration commune

La configuration d’équipe est **un fichier unique**, posé à un endroit que tous les postes peuvent lire (partage réseau, dossier synchronisé OneDrive/SharePoint…). Deux formats :

- **Excel** : le classeur produit par *Paramètres → Formules d’anonymisation → Exporter* (modifiez-le, puis déposez-le sur le partage) ;
- **YAML** : même format que `backend/config/entities.yaml` (clés `threshold` et `entities`).

Règles appliquées sur chaque poste :

- les entités du fichier d’équipe **remplacent** les entités locales du même nom, et son seuil s’impose ; les autres entités locales restent actives ;
- dans le panneau, ces entités portent un 🔒 et ne peuvent pas être modifiées localement ;
- le fichier est relu à chaque démarrage du moteur et à chaque rechargement ; **s’il est inaccessible** (portable hors réseau), la dernière copie lue est utilisée et le panneau l’indique ;
- un fichier invalide (regex incorrecte, validateur inconnu…) est refusé avec un message qui indique la ligne en cause.

### Indiquer le fichier

Au choix :

- **à l’installation** : `Installer-MasqueIA.bat "\serveur\partage\masqueia-equipe.xlsx"` ;
- **dans le panneau** : *Paramètres → Configuration d’équipe*, collez le chemin puis *Appliquer* ;
- **par l’IT** (poste géré) : variable d’environnement utilisateur `MASQUEIA_TEAM_CONFIG` contenant le chemin. Elle l’emporte sur le choix fait dans le panneau, qui est alors verrouillé.

### Mettre à jour les règles

Modifiez le fichier partagé. Chaque poste le prend en compte au prochain démarrage du moteur, ou tout de suite via *Appliquer* dans le panneau.

Protégez le partage en écriture : quiconque peut modifier ce fichier décide de ce qui est masqué sur tous les postes.

## Limites actuelles

- L’installateur en un clic est pour Windows ; macOS et Linux utilisent `install-mac.sh` et `install-linux.sh`.
- L’extension se charge en mode développeur. Pour un déploiement géré sans intervention, l’IT peut empaqueter l’extension et l’imposer par stratégie (`ExtensionInstallForcelist`), ou la publier sur le Chrome Web Store en accès restreint.
