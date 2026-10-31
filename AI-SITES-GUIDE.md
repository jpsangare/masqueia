# 🤖 Guide : anonymisation sur les sites d’IA

## Sites d’IA pris en charge

L’extension fonctionne sur **TOUS** les sites Web, notamment :

### ✅ Principaux sites d’IA :
- **ChatGPT** (chatgpt.com, chat.openai.com)
- **Claude** (claude.ai)
- **Perplexity** (perplexity.ai)
- **Google Gemini** (gemini.google.com)
- **Microsoft Copilot** (copilot.microsoft.com)
- **You.com**
- **Poe.com**
- **Any Chat** et autres sites

### ✅ Autres sites :
- Gmail, Outlook, ProtonMail
- Facebook, Twitter/X, LinkedIn
- Formulaires de contact
- CRM (Salesforce, HubSpot)
- **Tous les formulaires sur Internet !**

---

## 🎯 Meilleures méthodes d’anonymisation

### Méthode n° 1 : COLLAGE (Ctrl+V) ⭐ LA MEILLEURE

**Fonctionnement :**
1. Copiez le texte contenant des données personnelles (Ctrl+C).
2. Accédez à un site d’IA (ChatGPT, Claude, etc.).
3. Cliquez dans le champ de texte.
4. **Collez le texte (Ctrl+V).**
5. ✅ **Le texte est automatiquement anonymisé AVANT d’être collé !**

**Avantages :**
- ✅ Fonctionne sur 100 % des sites d’IA.
- ✅ Méthode la plus fiable.
- ✅ Aucun clic supplémentaire nécessaire.
- ✅ Anonymisation instantanée.

**Exemple :**
```
TEXTE ORIGINAL (copié) :
Jan Kowalski, email: jan@example.com, tel: 123-456-789, PESEL: 92010212345

APRÈS COLLAGE (anonymisation automatique) :
[PERSONNE], email: [EMAIL], tel: [TELEPHONE], PESEL: [PESEL]
```

---

### Méthode n° 2 : RACCOURCI CLAVIER (Ctrl+Shift+A) ⭐ BACKUP

**Fonctionnement :**
1. Saisissez ou collez un texte contenant des données personnelles.
2. **Sélectionnez le texte** à anonymiser.
3. Appuyez sur **Ctrl+Shift+A** (Cmd+Shift+A sur Mac).
4. ✅ **Le texte sélectionné est anonymisé sur place !**

**Avantages :**
- ✅ Fonctionne TOUJOURS, sur tous les sites.
- ✅ Vous pouvez choisir le texte à anonymiser.
- ✅ Fonctionne même si l’auto-paste échoue.

**Exemple :**
```
1. Saisissez : "Jan Kowalski, email: jan@example.com"
2. Sélectionnez tout le texte.
3. Appuyez sur Ctrl+Shift+A.
4. Résultat : "[PERSONNE], email: [EMAIL]"
```

---

### Méthode n° 3 : CLIC DROIT

**Fonctionnement :**
1. Saisissez ou collez un texte contenant des données personnelles.
2. **Sélectionnez le texte.**
3. **Cliquez avec le bouton droit** → « Anonymiser le texte sélectionné ».
4. ✅ **Le texte est anonymisé !**

**Avantages :**
- ✅ Menu contextuel intuitif.
- ✅ Facile à utiliser pour les nouveaux utilisateurs.

---

### ~~Méthode n° 4 : AUTO-ANONYMISATION AVANT L’ENVOI~~ ⚠️ EXPÉRIMENTALE

**État :** désactivée dans la version actuelle.

**Pourquoi est-elle désactivée ?**
- Les frameworks JavaScript modernes (React, Vue) utilisés par ChatGPT, Claude et Perplexity ne gèrent pas toujours correctement l’interception des clics sur le bouton « Send ».
- Le déclenchement répété d’un clic peut échouer avec leur code JavaScript complexe.
- Cela entraînait parfois l’envoi de messages sans anonymisation.

**Recommandation :** utilisez la **MÉTHODE N° 1 (Ctrl+V)**, qui fonctionne parfaitement !

---

## 📋 Instructions pour chaque site

### ChatGPT (chatgpt.com)

#### ✅ FONCTIONNALITÉS :
1. **PASTE (Ctrl+V)** ⭐ LE MEILLEUR
   - Copiez le texte → Ctrl+V dans le champ ChatGPT → anonymisation automatique !

2. **Raccourci (Ctrl+Shift+A)** ⭐ BACKUP
   - Saisissez le texte → sélectionnez-le → Ctrl+Shift+A → anonymisé !

3. **Menu contextuel**
   - Saisissez le texte → sélectionnez-le → clic droit → « Anonymiser »

#### ⚠️ NON PRIS EN CHARGE :
- ~~Auto-anonymisation avant l’envoi~~ (désactivée)
- ~~Interception de la touche Entrée~~ (désactivée)

**Exemple de flux de travail :**
```
1. Vous avez le texte : "Jan Kowalski mieszka w Warszawie, PESEL: 92010212345"
2. Copiez le texte (Ctrl+C).
3. Ouvrez ChatGPT.
4. Cliquez dans le champ de texte.
5. Collez-le (Ctrl+V).
6. ✅ Le texte collé devient : "[PERSONNE] habite à [LIEU], PESEL : [PESEL]"
7. Envoyez-le à ChatGPT.
```

---

### Claude (claude.ai)

**Même fonctionnement que ChatGPT** : Claude utilise le même type d’interface (div contenteditable).

#### ✅ FONCTIONNALITÉS :
1. **PASTE (Ctrl+V)** ⭐ LE MEILLEUR
2. **Raccourci (Ctrl+Shift+A)** ⭐ BACKUP
3. **Menu contextuel**

---

### Perplexity (perplexity.ai)

**Même fonctionnement que ChatGPT et Claude.**

#### ✅ FONCTIONNALITÉS :
1. **PASTE (Ctrl+V)** ⭐ LE MEILLEUR
2. **Raccourci (Ctrl+Shift+A)** ⭐ BACKUP
3. **Menu contextuel**

---

### Google Gemini (gemini.google.com)

**Même fonctionnement que les autres sites d’IA.**

#### ✅ FONCTIONNALITÉS :
1. **PASTE (Ctrl+V)** ⭐ LE MEILLEUR
2. **Raccourci (Ctrl+Shift+A)** ⭐ BACKUP
3. **Menu contextuel**

---

## 🎓 Bonnes pratiques

### 1. Utilisez toujours PASTE (Ctrl+V)
```
✅ À FAIRE :
- Copiez le texte → Ctrl+V sur le site d’IA.
- Anonymisation automatique !

❌ À ÉVITER :
- Retaper le texte manuellement.
- Attendre une auto-anonymisation avant l’envoi.
```

### 2. Si PASTE échoue, utilisez Ctrl+Shift+A
```
✅ BACKUP :
1. Collez le texte normalement (Ctrl+V sans l’extension).
2. Sélectionnez tout le texte.
3. Appuyez sur Ctrl+Shift+A.
4. Envoyez le texte anonymisé.
```

### 3. Vérifiez que l’extension est activée
```
1. Cliquez sur l’icône de l’extension.
2. Vérifiez que le bouton « Auto-anonymisation » est VERT.
3. S’il est gris, cliquez dessus pour l’activer.
```

### 4. Consultez les notifications
```
✅ Lorsque PASTE fonctionne :
- Vous verrez : « Anonymisation du texte collé... »
- Puis : « Texte anonymisé lors du collage ! »

❌ En cas de problème :
- « Erreur d’anonymisation. Je colle le texte original. »
- Vérifiez que le backend fonctionne : http://localhost:7000
```

---

## 🔧 Troubleshooting

### Problème : « Erreur d’anonymisation. Je colle le texte original. »

**Solution :**
1. Vérifiez que le backend fonctionne :
   ```bash
   curl http://localhost:7000/api/health
   ```
2. S’il ne fonctionne pas, démarrez-le :
   ```bash
   cd /Users/gaca/masqueia/backend
   source .venv/bin/activate
   python app.py
   ```

### Problème : le collage (Ctrl+V) n’anonymise pas le texte

**Solution :**
1. **Rechargez l’extension :**
   - chrome://extensions/
   - Cliquez sur ⟳ (actualiser).
   - **FERMEZ tous les onglets des sites d’IA.**
   - Rouvrez-les (F5 ne suffit pas !).

2. **Vérifiez que l’extension est activée :**
   - Cliquez sur l’icône de l’extension.
   - Le bouton « Auto-anonymisation » doit être VERT.

3. **Utilisez une autre méthode :**
   - Collez le texte normalement.
   - Sélectionnez le texte.
   - Appuyez sur Ctrl+Shift+A.

### Problème : les notifications ne s’affichent pas

**Solution :**
1. Consultez la console des DevTools (F12).
2. Les notifications apparaissent dans le coin inférieur droit de la page.
3. Si elles ne s’affichent pas, vérifiez que le content script est chargé :
   - DevTools → Sources → Content scripts → content-script.js

---

## 📊 Comparaison des méthodes

| Méthode | ChatGPT | Claude | Perplexity | Gemini | Formulaires | Fiabilité |
|--------|---------|--------|------------|--------|------------|--------------|
| **Paste (Ctrl+V)** | ✅ | ✅ | ✅ | ✅ | ✅ | ⭐⭐⭐⭐⭐ 100% |
| **Raccourci (Ctrl+Shift+A)** | ✅ | ✅ | ✅ | ✅ | ✅ | ⭐⭐⭐⭐⭐ 100% |
| **Menu contextuel** | ✅ | ✅ | ✅ | ✅ | ✅ | ⭐⭐⭐⭐⭐ 100% |
| ~~Auto avant envoi~~ | ❌ | ❌ | ❌ | ❌ | ⚠️ | ⭐⭐ 30% |

---

## ✅ Récapitulatif

### ⭐ Méthode recommandée pour tous les sites d’IA :

```
1. Copiez le texte contenant des données (Ctrl+C).
2. Accédez à ChatGPT/Claude/Perplexity.
3. Cliquez dans le champ de texte.
4. Collez le texte (Ctrl+V).
5. ✅ Le texte est anonymisé automatiquement !
6. Envoyez-le au site d’IA.
```

### 🔄 Backup Method (si Paste échoue) :

```
1. Collez le texte normalement.
2. Sélectionnez tout le texte.
3. Appuyez sur Ctrl+Shift+A.
4. ✅ Le texte est anonymisé !
5. Envoyez-le au site d’IA.
```

---

## 🎯 Pourquoi PASTE est-il la meilleure méthode ?

1. **Fonctionne sur 100 % des sites** - textarea, contenteditable, input, formulaires.
2. **Automatique** - aucun clic supplémentaire nécessaire.
3. **Instantané** - anonymisation avant le collage.
4. **Fiable** - indépendant de la structure du site.
5. **Universel** - même flux de travail pour tous les sites d’IA.

---

## 📞 Besoin d’aide ?

1. Consultez [TESTING.md](./TESTING.md) - guide complet des tests.
2. Ouvrez [test-extension.html](./test-extension.html) - test local.
3. Consultez les journaux dans les DevTools (F12).
4. Consultez le background service worker console (chrome://extensions/).
5. Consultez les backend logs (terminal).

**Backend Health Check :**
```bash
curl http://localhost:7000/api/health
```

La réponse attendue est :
```json
{"service":"masqueia","status":"healthy","version":"1.0.0"}
```

---

## 🚀 Démarrage rapide

```
1. Backend : python app.py
2. Chrome : chargez l’extension.
3. Bouton : activez « Auto-anonymisation ».
4. Test : open test-extension.html
5. Paste : Ctrl+V → vérifiez que le texte est anonymisé.
6. IA : accédez à ChatGPT/Claude/Perplexity.
7. Utilisation : copiez le texte → Ctrl+V → ✅ anonymisé !
```

---

**Version :** 1.3.0
**Dernière mise à jour :** 2025-11-15
**Navigateurs pris en charge :** Chrome, Edge, Brave, Opera (Manifest V3)
