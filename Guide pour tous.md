# 🚀 Premiers pas - Guide pour tous

**Guide simple pour installer MasqueIA**
*Pour les personnes sans connaissances techniques : tout est expliqué étape par étape !*

> 🪟 **Vous utilisez Windows ?** C’est encore plus simple : [WINDOWS.md](WINDOWS.md) — téléchargez l’archive ZIP et double-cliquez sur un fichier. C’est tout.

---

## 🤔 De quoi s’agit-il ?

Il s’agit d’une extension pour le navigateur Chrome qui **masque automatiquement vos données personnelles** lorsque vous collez du texte dans :
- ChatGPT
- Claude
- Gmail
- des formulaires Web ;
- tout autre site !

**Exemple :**
- **Vous collez :** "Nazywam się Jan Kowalski, email: jan@example.com, tel: 123-456-789"
- **Vous obtenez :** "Je m’appelle [PERSONNE], e-mail : [EMAIL], téléphone : [TELEPHONE]"

**Tout fonctionne LOCALEMENT sur votre ordinateur** : aucune donnée n’est envoyée sur Internet ! 🔒

---

## ✅ Ce dont vous avez besoin

- ✅ Un ordinateur sous Windows, macOS ou Linux.
- ✅ Le navigateur Chrome (ou Edge, Brave, Opera).
- ✅ 10 minutes.
- ✅ Une connexion Internet (uniquement pour le téléchargement).

---

## 📥 ÉTAPE 1 : Télécharger le programme

### Méthode 1 : si Git est installé

**Windows :**
1. Ouvrez l’« Invite de commandes » (CMD).
2. Saisissez :
```
git clone https://github.com/jpsangare/masqueia
cd masqueia
```

**Mac ou Linux :**
1. Ouvrez le Terminal.
2. Saisissez :
```bash
git clone https://github.com/jpsangare/masqueia
cd masqueia
```

### Méthode 2 : télécharger l’archive ZIP (si Git n’est pas installé)

1. Accédez à https://github.com/jpsangare/masqueia.
2. Cliquez sur le bouton vert **« Code »**.
3. Sélectionnez **« Download ZIP »**.
4. Extrayez l’archive téléchargée dans un dossier, par exemple `C:\presidio\` (Windows) ou `~/presidio/` (Mac/Linux).
5. Ouvrez ce dossier dans l’Invite de commandes (Windows) ou le Terminal (Mac/Linux).

---

## 🔧 ÉTAPE 2 : Installer le backend (moteur d’anonymisation)

Le backend est le programme qui détecte et masque les données personnelles.

### Windows

1. **Dans le dossier du programme, double-cliquez sur `Uruchom-Windows.bat`** — c’est tout !
   - Le script vérifie si Python est installé (et l’installe automatiquement si nécessaire).
   - Il télécharge les bibliothèques et les modèles linguistiques français et anglais (5 à 10 minutes, environ 500 Mo, uniquement la première fois).
   - Il démarre le backend et ouvre automatiquement le tableau de bord dans le navigateur. ✅
2. **Facultatif :** double-cliquez sur `Autostart-Windows.bat` pour lancer automatiquement le backend au démarrage de l’ordinateur.

> Guide détaillé avec dépannage : [WINDOWS.md](WINDOWS.md)

### Mac

1. **Vérifiez que Python est installé :**
   - Ouvrez le Terminal (Applications → Utilitaires → Terminal).
   - Saisissez : `python3 --version`
   - Si une version s’affiche → **C’est bon !**
   - Sinon :
     ```bash
     brew install python3
     ```
     (si Homebrew n’est pas installé, consultez https://brew.sh)

2. **Lancez l’installateur :**
   ```bash
   chmod +x install-mac.sh
   ./install-mac.sh
   ```
   - Patientez 5 à 10 minutes.
   - Lorsque le backend est lancé sur `http://localhost:7000`, il **FONCTIONNE !** ✅

### Linux (Ubuntu/Debian)

1. **Installez Python :**
   ```bash
   sudo apt install python3 python3-pip python3-venv
   ```

2. **Lancez l’installateur :**
   ```bash
   chmod +x install-linux.sh
   ./install-linux.sh
   ```
   - Patientez 5 à 10 minutes.
   - Lorsque le backend est lancé sur `http://localhost:7000`, il **FONCTIONNE !** ✅

---

## 🌐 ÉTAPE 3 : Installer l’extension dans Chrome

1. **Ouvrez Chrome.**

2. **Accédez à la page des extensions :**
   - Saisissez `chrome://extensions/` dans la barre d’adresse.
   - Ou ouvrez Menu (⋮) → Plus d’outils → Extensions.

3. **Activez le mode développeur :**
   - Repérez le bouton **« Mode développeur »** en haut à droite.
   - Cliquez pour l’activer (il doit devenir bleu).

4. **Chargez l’extension :**
   - Cliquez sur **« Charger l’extension non empaquetée »**.
   - Sélectionnez le dossier `masqueia/chrome-extension/`.
   - Cliquez sur « Sélectionner un dossier ».

5. **C’est prêt !** ✅
   - La fiche « MasqueIA » doit apparaître.
   - Si une demande d’autorisation s’affiche, cliquez sur « Autoriser ».

---

## 🎉 ÉTAPE 4 : Vérifier que tout fonctionne

### Test 1 : Vérifier la connexion

1. Cliquez sur l’icône des extensions dans la barre Chrome (puzzle 🧩).
2. Repérez « MasqueIA ».
3. Cliquez dessus.
4. Le statut **« Status: Online »** (en vert) doit s’afficher. ✅
5. Si le statut « Offline » (en rouge) s’affiche :
   - Vérifiez que le terminal ou l’invite de commandes avec le backend est toujours ouvert.
   - Sinon, relancez `Uruchom-Windows.bat` (Windows) ou `./install-mac.sh` (Mac).

### Test 2 : Essayer avec ChatGPT

1. Ouvrez https://chatgpt.com (ou https://claude.ai).

2. Copiez ce texte (Ctrl+C / Cmd+C) :
   ```
   Dzień dobry, nazywam się Anna Kowalska, mój email to anna.kowalska@example.com, telefon: +48 123 456 789, PESEL: 92010212345
   ```

3. Collez-le dans ChatGPT (Ctrl+V / Cmd+V).

4. **Résultat attendu :**
   ```
   Bonjour, je m’appelle [PERSONNE], mon e-mail est [EMAIL], téléphone : [TELEPHONE], PESEL : [PESEL]
   ```

5. Si les données sont masquées → **ÇA FONCTIONNE !** 🎉

6. Si les données **ne sont PAS** masquées :
   - Vérifiez que l’extension est « ON » (cliquez sur son icône).
   - Vérifiez que le backend fonctionne (le terminal ou l’invite de commandes doit être ouvert).
   - Rechargez l’extension : `chrome://extensions/` → repérez l’extension → cliquez sur ⟳.

---

## 📊 Tableau de bord (Dashboard)

Vous pouvez consulter l’activité de l’extension :

1. Ouvrez cette adresse dans le navigateur : http://localhost:7000/dashboard

2. Vous y trouverez :
   - ✅ L’état du service (en ligne/hors ligne).
   - 📊 Les statistiques (nombre de requêtes et de données détectées).
   - 🧪 Le testeur, pour essayer l’anonymisation sans l’extension.
   - 📋 Les journaux, qui indiquent les textes collés et les résultats.

---

## ❓ Problèmes courants

### Problème 1 : « Python n’est pas installé »

**Solution :**
- **Windows :** téléchargez Python depuis https://www.python.org/downloads/.
  - IMPORTANT : cochez « Add Python to PATH » pendant l’installation !
- **Mac :** installez-le avec `brew install python3`.
- **Linux :** installez-le avec `sudo apt install python3`.

### Problème 2 : « Le backend affiche une erreur »

**Solution :**
1. Fermez le terminal ou l’invite de commandes.
2. Relancez l’installateur :
   - Windows : `Uruchom-Windows.bat`
   - Mac : `./install-mac.sh`
   - Linux : `./install-linux.sh`

### Problème 3 : « L’extension affiche “Offline” »

**Solution :**
1. Vérifiez que le terminal avec le backend est ouvert.
2. Sinon, relancez le backend :
   ```bash
   cd masqueia/backend
   python app.py
   ```
3. Rechargez l’extension dans Chrome : `chrome://extensions/` → ⟳.

### Problème 4 : « Les données ne sont pas masquées »

**Vérifiez les points suivants :**
1. Le backend fonctionne-t-il ? (terminal ouvert, sans erreur)
2. L’extension est-elle sur ON ? (cliquez sur son icône)
3. Utilisez-vous le COLLAGE (Ctrl+V) ? C’est la méthode la plus fiable !
4. Actualisez la page ChatGPT/Claude.

---

## 🎚️ Activer/désactiver l’extension

**Vous souhaitez parfois désactiver l’anonymisation ?**

1. Cliquez sur l’icône de l’extension dans Chrome.
2. Le bouton ON/OFF apparaît.
3. Cliquez dessus pour activer ou désactiver l’extension.
4. **ON** = l’anonymisation est active. ✅
5. **OFF** = l’anonymisation est désactivée. ⛔

---

## 🔒 Sécurité

**Mes données sont-elles en sécurité ?**

✅ **OUI !**
- Tout fonctionne **localement** sur votre ordinateur.
- **Aucune donnée n’est envoyée sur Internet.**
- Le backend fonctionne uniquement sur votre ordinateur (localhost).
- Microsoft Presidio est un moteur professionnel de Microsoft.

**Que voit l’extension ?**
- Uniquement le texte que vous COLLEZ.
- Elle ne lit ni les mots de passe, ni les cookies, ni l’historique.

---

## 📖 Ressources complémentaires

**Vous souhaitez en savoir plus ?**

- 📄 [README.md](README.md) - Documentation complète (en anglais)
- 🤖 [AI-SITES-GUIDE.md](AI-SITES-GUIDE.md) - Guide détaillé pour ChatGPT, Claude et Perplexity
- 🧪 [TESTING.md](TESTING.md) - Comment tester l’extension
- 💾 [INSTALLATION.md](INSTALLATION.md) - Installation avancée

---

## 💬 Besoin d’aide ?

**Où trouver de l’aide ?**

1. **Consultez le tableau de bord :** http://localhost:7000/dashboard
   - Consultez les journaux pour voir ce qui se passe.

2. **Issues GitHub :** https://github.com/jpsangare/masqueia/issues
   - Décrivez le problème.
   - Ajoutez une capture d’écran.
   - Indiquez votre système (Windows/Mac/Linux).

3. **E-mail de l’auteur :** (s’il est indiqué dans le projet)

---

## 🎯 Instructions abrégées (pour les utilisateurs expérimentés)

**Windows:**
```cmd
git clone https://github.com/jpsangare/masqueia
cd masqueia
Uruchom-Windows.bat
```

**Mac:**
```bash
git clone https://github.com/jpsangare/masqueia
cd masqueia
./install-mac.sh
```

**Linux:**
```bash
git clone https://github.com/jpsangare/masqueia
cd masqueia
./install-linux.sh
```

**Extension Chrome :**
1. `chrome://extensions/`
2. Activez le « Mode développeur ».
3. « Charger l’extension non empaquetée » → sélectionnez `chrome-extension/`.
4. C’est prêt !

---

## ✨ Conseils

**💡 Comment l’utiliser au mieux ?**

1. **Utilisez TOUJOURS le COLLAGE (Ctrl+V).**
   - C’est la méthode la plus fiable !
   - Elle fonctionne partout : ChatGPT, Claude, Gmail, etc.

2. **Vérifiez l’état de l’extension.**
   - Cliquez sur l’icône pour voir si le statut est ON ou OFF.
   - Vert = active ; rouge = désactivée.

3. **Consultez les journaux du tableau de bord.**
   - http://localhost:7000/dashboard → Logs
   - Découvrez ce qui a été détecté et masqué.

4. **Ne fermez pas le terminal !**
   - Le terminal ou l’invite de commandes avec le backend doit rester ouvert.
   - Vous pouvez le réduire.

---

## 🎊 C’est prêt !

**Félicitations !** Votre extension d’anonymisation des données est opérationnelle ! 🎉

**Vous pouvez maintenant en toute sécurité :**
- Coller du texte dans ChatGPT.
- Envoyer des messages avec Gmail.
- Remplir des formulaires.
- Et bien plus encore !

**N’oubliez pas :**
- Le backend doit être actif (terminal ou invite de commandes ouvert).
- L’extension doit être sur ON.
- Utilisez le COLLAGE (Ctrl+V).

---

<p align="center">
  <strong>Bonne utilisation ! 🚀</strong><br/>
  <sub>En cas de problème, consultez le tableau de bord ou les Issues GitHub.</sub>
</p>

<p align="center">
  <a href="README.md">Documentation technique</a> •
  <a href="AI-SITES-GUIDE.md">Guide des sites d’IA</a> •
  <a href="https://github.com/jpsangare/masqueia/issues">Signaler un problème</a>
</p>
