# 🪟 Windows — installation pour tous (sans connaissances techniques)

Ce guide s’adresse aux personnes qui **ne sont pas développeuses**. Vous n’avez besoin ni de Git, ni d’un terminal, ni de connaissances techniques. L’installation se fait en **3 étapes et prend environ 10 minutes** (uniquement la première fois ; les lancements suivants ne prennent que quelques secondes).

---

## Que trouverez-vous à la fin ?

Lorsque vous collez dans ChatGPT, Claude ou Gmail un texte contenant des données personnelles (PESEL, e-mail, téléphone, numéro de carte…), l’extension les **masque automatiquement** avant leur envoi sur Internet. Tout se passe sur votre ordinateur : aucune donnée ne sort de votre appareil.

---

## Étape 1 : Télécharger le programme (2 minutes)

1. Accédez à **https://github.com/jpsangare/masqueia**.
2. Cliquez sur le bouton vert **« Code »**, puis sur **« Download ZIP »**.
3. Ouvrez le dossier **Téléchargements**, faites un clic droit sur l’archive téléchargée, puis choisissez **« Extraire tout… »** → **« Extraire »**.
4. Le dossier `masqueia-main` s’ouvre. Laissez-le ouvert.

> 💡 **Conseil :** déplacez ce dossier, par exemple dans `Documents`, pour éviter de le supprimer par inadvertance. Le programme s’exécute depuis ce dossier.

## Étape 2 : Lancer le programme (5 à 10 minutes la première fois)

1. Dans le dossier, repérez le fichier **`Uruchom-Windows`** (type : fichier de commandes Windows) et **double-cliquez dessus**.
2. Si Windows affiche la fenêtre bleue « Windows a protégé votre ordinateur », cliquez sur **« Informations complémentaires »** → **« Exécuter quand même »** (le programme est sûr : son code est public sur GitHub).
3. La fenêtre noire s’occupe de tout :
   - elle vérifie si Python est installé (sinon, elle l’installe automatiquement ; il peut arriver qu’elle vous demande de cliquer une nouvelle fois sur le fichier) ;
   - elle télécharge les bibliothèques nécessaires et les modèles linguistiques français et anglais ;
   - elle lance le programme et **ouvre automatiquement le tableau de bord dans le navigateur**.
4. Lorsque le tableau de bord s’affiche dans le navigateur, tout fonctionne ! ✅

> ⚠️ **Ne fermez pas la fenêtre noire** pendant que vous utilisez l’anonymisation. Vous pouvez la réduire.
>
> Lors des **lancements suivants**, le même fichier démarre le programme en quelques secondes (aucune installation supplémentaire n’est nécessaire).

## Étape 3 : Installer l’extension dans Chrome (2 minutes)

1. Ouvrez Chrome et saisissez `chrome://extensions/` dans la barre d’adresse.
2. Activez le bouton **« Mode développeur »** (en haut à droite).
3. Cliquez sur **« Charger l’extension non empaquetée »**.
4. Sélectionnez le dossier **`chrome-extension`** (dans le dossier du programme téléchargé à l’étape 1).
5. C’est prêt ! L’icône de l’extension apparaît à côté de la barre d’adresse.

---

## Vérifier que tout fonctionne (30 secondes)

1. Copiez ce texte :
   ```
   Jan Kowalski, PESEL: 92010212345, email: jan@example.com, tel: +48 123 456 789
   ```
2. Accédez à https://chatgpt.com et collez-le (Ctrl+V) dans la fenêtre de conversation.
3. Le résultat attendu est : `Jan Kowalski, PESEL: [PESEL], email: [EMAIL], tel: [TELEPHONE]` ✅

---

## Démarrage automatique (facultatif)

Vous souhaitez que le programme démarre automatiquement à l’ouverture de votre session (en arrière-plan, sans fenêtre noire) ?

- Double-cliquez sur **`Autostart-Windows`** → démarrage automatique ACTIVÉ.
- Cliquez de nouveau dessus → démarrage automatique DÉSACTIVÉ.

---

## Problèmes courants

| Problème | Solution |
|---|---|
| L’extension affiche « Offline » | Le programme n’est pas lancé : cliquez sur `Uruchom-Windows`. |
| « Windows a protégé votre ordinateur » | « Informations complémentaires » → « Exécuter quand même ». |
| La fenêtre apparaît puis disparaît | Cliquez une nouvelle fois sur le fichier. Si le problème persiste, redémarrez l’ordinateur et réessayez. |
| L’installation de Python a échoué | Accédez à https://www.python.org/downloads/, téléchargez Python et **cochez « Add Python to PATH »** lors de l’installation, puis relancez `Uruchom-Windows`. |
| Le texte n’est pas masqué | Cliquez sur l’icône de l’extension et vérifiez que le bouton est ACTIVÉ ; actualisez la page (F5). |
| Je veux voir ce qui a été masqué | Ouvrez http://localhost:7000/dashboard → onglet « Logs ». |

Pour obtenir davantage d’aide : [Guide pour tous.md](Guide%20pour%20tous.md) • [INSTALLATION.md](INSTALLATION.md)
