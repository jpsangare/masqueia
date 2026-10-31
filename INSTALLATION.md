# Installation de MasqueIA

Guide complet pour installer l’extension Chrome et le backend.

## Prérequis

- **Python 3.8+** (vérifiez avec : `python --version` ou `python3 --version`)
- **Chrome/Edge/Brave** - navigateur basé sur Chromium
- **2 Go de RAM** - pour le modèle SpaCy
- **Connexion Internet** - pour télécharger les dépendances

---

## Installation automatique (recommandée)

### Windows

> 🪟 **Version pour les débutants (sans Git ni terminal) :** [WINDOWS.md](WINDOWS.md)

1. **Téléchargez le projet** (avec Git ou via le bouton vert `Code` → `Download ZIP`, puis extrayez l’archive) :
   ```cmd
   git clone https://github.com/jpsangare/masqueia
   cd masqueia
   ```

2. **Double-cliquez sur `Uruchom-Windows.bat`** — au premier lancement, tout est installé (y compris Python s’il est absent), puis le backend démarre et le tableau de bord s’ouvre

3. **C’est prêt !** Le backend est disponible sur `http://localhost:7000`. Pour le démarrer à l’ouverture de session, double-cliquez sur `Autostart-Windows.bat`.

### macOS

1. **Téléchargez le projet :**
   ```bash
   git clone https://github.com/jpsangare/masqueia
   cd masqueia
   ```

2. **Lancez l’installateur :**
   ```bash
   ./install-mac.sh
   ```

3. **C’est prêt !** Le backend démarre automatiquement sur `http://localhost:7000`.

### Linux

1. **Installez Python 3 et venv** (si nécessaire) :
   ```bash
   # Ubuntu/Debian
   sudo apt install python3 python3-pip python3-venv

   # Fedora/RHEL
   sudo dnf install python3 python3-pip

   # Arch
   sudo pacman -S python python-pip
   ```

2. **Téléchargez le projet :**
   ```bash
   git clone https://github.com/jpsangare/masqueia
   cd masqueia
   ```

3. **Lancez l’installateur :**
   ```bash
   ./install-linux.sh
   ```

4. **C’est prêt !** Le backend démarre automatiquement sur `http://localhost:7000`.

---

## Installation de l’extension Chrome

### Étape 1 : Installer l’extension

#### Option A : Load Unpacked (développement)

1. Ouvrez Chrome et saisissez `chrome://extensions/` dans la barre d’adresse.
2. Activez le **« Mode développeur »** (interrupteur en haut à droite).
3. Cliquez sur **« Charger l’extension non empaquetée »**.
4. Sélectionnez le dossier : `/path/to/masqueia/chrome-extension`
5. L’extension est chargée !

#### Option B : À partir du fichier CRX (production)

1. Téléchargez le fichier `.crx` depuis [GitHub Releases](https://github.com/jpsangare/masqueia/releases).
2. Faites glisser le fichier dans `chrome://extensions/`.
3. Cliquez sur « Ajouter l’extension ».

### Étape 2 : Configurer l’URL du backend

1. Cliquez sur l’**icône de l’extension** dans la barre d’outils Chrome.
2. Cliquez sur **« 🔧 Paramètres de l’extension »**.
3. Saisissez l’URL : `http://localhost:7000`
4. Cliquez sur **« 🔍 Tester la connexion »**.
5. Si le message « ✅ Connexion réussie ! » s’affiche, cliquez sur **« 💾 Enregistrer »**.

---

## Utilisation

### 1. Anonymisation automatique au collage (la méthode la plus simple !)

**Le texte est anonymisé automatiquement lorsque vous le collez :**

```
1. Copiez le texte contenant des données personnelles.
2. Collez-le où vous le souhaitez (Ctrl+V / Cmd+V).
3. Le texte est anonymisé automatiquement !
```

**Fonctionne partout :**
- ChatGPT, Claude, Bard
- Gmail, Outlook
- Formulaires
- Champs de texte

### 2. Raccourci clavier

```
1. Sélectionnez le texte sur la page.
2. Appuyez sur Ctrl+Shift+A (Cmd+Shift+A sur Mac).
3. Le texte est anonymisé.
```

### 3. Menu contextuel

```
1. Sélectionnez le texte.
2. Cliquez avec le bouton droit de la souris.
3. Choisissez « Anonymiser le texte sélectionné ».
```

---

## Exemple d’utilisation

**Texte avant anonymisation :**
```
Dzień dobry, jestem Jan Kowalski, mój PESEL to 44051401359,
email: jan.kowalski@example.com, tel: +48 123 456 789.
Mieszkam w Warszawie przy ul. Pięknej 15.
```

**Texte après anonymisation :**
```
Bonjour, je m’appelle [PERSONNE], mon PESEL est [PESEL],
e-mail : [EMAIL], téléphone : [TELEPHONE].
J’habite à [LIEU], au [LIEU].
```

---

## Types de données détectés

### Données polonaises (identifiants spécifiques)
- **PESEL** - Numéro PESEL
- **NIP** - Numéro d’identification fiscale
- **REGON** - Numéro REGON
- **Carte d’identité** - Numéro de la carte d’identité
- **Passeport** - Numéro de passeport

### Données internationales
- **Nom et prénom** - Données personnelles
- **E-mail** - Adresse e-mail
- **Téléphone** - Numéro de téléphone
- **Carte bancaire** - Numéro de carte
- **IBAN** - Numéro de compte bancaire
- **Adresse IP** - Adresse IP
- **URL** - Adresses de sites Web
- **Date/heure** - Dates et heures
- **Lieu** - Villes, adresses

---

## Troubleshooting

### Le backend ne démarre pas

**Problème :** erreur « Port 7000 is already in use »

**Solution :**
```bash
# Windows
netstat -ano | findstr :7000
taskkill /PID <numer_PID> /F

# macOS/Linux
lsof -i :7000
kill -9 <PID>
```

### État de l’extension : « Offline »

1. **Vérifiez que le backend est en cours d’exécution :**
   ```bash
   curl http://localhost:7000/api/health
   ```
   La réponse attendue est : `{"status":"healthy"}`

2. **Vérifiez l’URL dans les paramètres de l’extension :**
   - Ouvrez les options de l’extension.
   - Vérifiez que l’URL est `http://localhost:7000`.
   - Cliquez sur « Tester la connexion ».

3. **Redémarrez le backend :**
   - Arrêtez le backend (Ctrl+C).
   - Relancez-le : `python app.py`

### Python n’est pas installé

**Windows :**
1. Téléchargez Python depuis https://www.python.org/downloads/.
2. IMPORTANT : cochez « Add Python to PATH » !
3. Lancez l’installateur.

**macOS :**
```bash
# Utilisez Homebrew
brew install python3
```

**Linux :**
```bash
# Ubuntu/Debian
sudo apt install python3 python3-pip python3-venv

# Fedora
sudo dnf install python3 python3-pip
```

### Le modèle SpaCy ne se télécharge pas

**Problème :** erreur lors de l’exécution de `python -m spacy download fr_core_news_md` ou `python -m spacy download en_core_web_md`

**Solution :**
```bash
# Activez le venv
source .venv/bin/activate  # macOS/Linux
.venv\Scripts\activate.bat  # Windows

# Réessayez
pip install https://github.com/explosion/spacy-models/releases/download/fr_core_news_md-3.7.0/fr_core_news_md-3.7.0-py3-none-any.whl
```

### L’extension ne détecte pas les données

1. **Vérifiez que les entités sont activées :**
   - Cliquez sur l’icône de l’extension → « ⚙️ Paramètres ».
   - Vérifiez que PERSON, EMAIL_ADDRESS, etc. sont sélectionnés.
   - Cliquez sur « Enregistrer ».

2. **Rechargez l’extension :**
   - `chrome://extensions/`
   - Cliquez sur ⟳ à côté de l’extension.

---

## Mise à jour

### Mise à jour du backend

```bash
cd masqueia
git pull origin main

cd backend
source .venv/bin/activate  # macOS/Linux
.venv\Scripts\activate.bat  # Windows

pip install -r requirements.txt --upgrade
```

### Mise à jour de l’extension

1. Ouvrez `chrome://extensions/`.
2. Cliquez sur ⟳ (recharger) à côté de l’extension.
3. Vous pouvez aussi télécharger la nouvelle version depuis GitHub Releases.

---

## Démarrer le backend à l’ouverture du système

### Windows (Task Scheduler)

1. Ouvrez **Task Scheduler**.
2. Sélectionnez Create Basic Task → « Presidio Backend ».
3. Déclencheur : « When I log on ».
4. Action : « Start a program ».
5. Programme : `C:\path\to\masqueia\Uruchom-Windows.bat`

### macOS (launchd)

Créez le fichier `~/Library/LaunchAgents/com.presidio.backend.plist` :

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.presidio.backend</string>
    <key>ProgramArguments</key>
    <array>
        <string>/path/to/masqueia/install-mac.sh</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>
```

Chargez-le :
```bash
launchctl load ~/Library/LaunchAgents/com.presidio.backend.plist
```

### Linux (systemd)

Créez le fichier `~/.config/systemd/user/presidio-backend.service` :

```ini
[Unit]
Description=MasqueIA Backend
After=network.target

[Service]
Type=simple
ExecStart=/path/to/masqueia/install-linux.sh
Restart=on-failure

[Install]
WantedBy=default.target
```

Activez-le :
```bash
systemctl --user enable presidio-backend
systemctl --user start presidio-backend
```

---

## FAQ

### Les données sont-elles envoyées sur Internet ?

**Non !** Tout fonctionne localement sur votre ordinateur. Aucune donnée ne quitte votre machine.

### Puis-je utiliser un autre port ?

Oui ! Lancez le backend :
```bash
python app.py --port 8080
```

Puis modifiez l’URL dans les options de l’extension en `http://localhost:8080`.

### L’extension fonctionne-t-elle avec d’autres navigateurs ?

Oui ! Elle fonctionne avec tous les navigateurs basés sur Chromium :
- Google Chrome
- Microsoft Edge
- Brave
- Opera
- Vivaldi

---

## Aide et assistance

- **Issues GitHub :** https://github.com/jpsangare/masqueia/issues
- **Documentation Chrome :** chrome-extension/README.md
- **Documentation du backend :** backend/README.md

---

## Licence

Licence MIT - consultez le fichier [LICENSE](LICENSE)
