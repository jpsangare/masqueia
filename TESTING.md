# 🧪 Tester l’extension Presidio

## Préparation (IMPORTANT !)

### 1. Rechargez l’extension après toute modification
```
1. Ouvrez chrome://extensions/
2. Repérez « MasqueIA ».
3. Cliquez sur l’icône d’actualisation (⟳) ou basculez OFF/ON.
4. FERMEZ tous les onglets ouverts avec des sites d’IA (ChatGPT, Claude, Perplexity).
5. Rouvrez-les (F5 ne suffit pas !)
```

### 2. Vérifiez que l’extension est activée
```
1. Cliquez sur l’icône de l’extension dans la barre d’outils.
2. Vérifiez que le bouton « Auto-anonymisation » est VERT.
3. S’il est gris, cliquez dessus pour l’activer.
```

### 3. Vérifiez que le backend fonctionne
```bash
# Test 1: Health check
curl http://localhost:7000/api/health

# Test 2 : anonymisation
curl -X POST http://localhost:7000/api/anonymize \
  -H "Content-Type: application/json" \
  -d '{"text":"Jan Kowalski, email: jan@example.com, tel: 123456789"}'
```

## Test 1 : Page de test (le test le plus rapide)

```bash
# Ouvrez test-extension.html
open /Users/gaca/masqueia/test-extension.html
```

### Étapes du test :
1. Ouvrez les **DevTools** (F12) → onglet **Console**.
2. Copiez le texte de test :
   ```
   Jan Kowalski, email: jan.kowalski@example.com, tel: 123-456-789, PESEL: 92010212345
   ```
3. Collez-le dans le champ de texte (Ctrl+V).
4. **Vérifiez que les messages suivants apparaissent dans la console :**
   ```
   [Presidio] Paste event detected - extension ENABLED
   [Presidio] Sending anonymization request...
   [Presidio] Received response: ...
   ```
5. **Le texte doit être anonymisé :**
   ```
   [PERSONNE], email: [EMAIL], tel: [TELEPHONE], PESEL: [PESEL]
   ```

### Si les messages n’apparaissent pas :
1. L’extension n’est pas chargée → rechargez-la (étape 1 ci-dessus).
2. L’extension est désactivée → activez le bouton dans la fenêtre contextuelle.
3. Le content script ne fonctionne pas → vérifiez l’absence d’erreurs dans la console.

### Si une erreur apparaît :
1. Consultez la **background service worker console** :
   - chrome://extensions/
   - "MasqueIA" → "Inspect views: service worker"
   - Vérifiez si une erreur de communication avec le backend est affichée.

## Test 2 : ChatGPT (https://chatgpt.com)

### Préparation :
1. Fermez tous les onglets ChatGPT.
2. Ouvrez un nouvel onglet : https://chatgpt.com
3. Ouvrez les DevTools (F12).

### Test A : Collage (Ctrl+V)
1. Copiez : `Jan Kowalski, email: jan@example.com, PESEL: 92010212345`
2. Cliquez dans le champ de texte de ChatGPT.
3. Appuyez sur Ctrl+V.
4. **Vérifiez :** le texte doit être anonymisé AVANT d’être collé.

### Test B : Raccourci clavier (Ctrl+Shift+A)
1. Saisissez un texte contenant des données personnelles.
2. Sélectionnez le texte.
3. Appuyez sur Ctrl+Shift+A (Cmd+Shift+A sur Mac).
4. **Vérifiez :** le texte est anonymisé sur place.

### Test C : Clic droit
1. Saisissez un texte contenant des données personnelles.
2. Sélectionnez le texte.
3. Cliquez avec le bouton droit → « Anonymiser le texte sélectionné ».
4. **Vérifiez :** le texte est anonymisé.

## Test 3 : Claude (https://claude.ai)

Répétez les mêmes tests que pour ChatGPT.

**Remarque :** Claude utilise contenteditable, comme ChatGPT ; l’extension devrait donc fonctionner de la même manière.

## Test 4 : Perplexity (https://www.perplexity.ai)

Répétez les mêmes tests que pour ChatGPT.

**Remarque :** Perplexity peut utiliser textarea ou contenteditable ; l’extension prend en charge les deux.

## Test 5 : Autres sites d’IA

L’extension devrait fonctionner sur TOUS les sites (<all_urls>), notamment :

- Gemini (gemini.google.com)
- Microsoft Copilot
- You.com
- Poe.com
- Any.chat
- Gmail
- Outlook
- Facebook
- Twitter/X
- LinkedIn
- **Tous les formulaires sur Internet !**

## Dépannage

### Problème : « Erreur d’anonymisation. Je colle le texte original. »

**Causes possibles :**

1. **Le backend ne fonctionne pas :**
   ```bash
   curl http://localhost:7000/api/health
   # S’il ne fonctionne pas : démarrez le backend
   cd /Users/gaca/masqueia/backend
   source .venv/bin/activate
   python app.py
   ```

2. **URL du backend incorrecte :**
   - Ouvrez la fenêtre contextuelle de l’extension.
   - Cliquez sur « Paramètres ».
   - Vérifiez que l’URL est `http://localhost:7000`.

3. **Erreur CORS :**
   - Consultez la background service worker console.
   - Si une erreur CORS apparaît, la configuration CORS du backend est incorrecte.

4. **L’extension n’a pas été actualisée après son chargement :**
   - Rechargez l’extension : chrome://extensions/ → ⟳
   - Fermez les pages d’IA, puis rouvrez-les.

### Problème : aucun message dans la console

**Solution :**

1. Vérifiez que l’extension est installée :
   - chrome://extensions/
   - « MasqueIA » - ACTIVÉ

2. Vérifiez que le content script est chargé :
   - DevTools → onglet « Sources »
   - Dans l’arborescence à gauche : « Content scripts » → « content-script.js » doit être présent.

3. Actualisez la page (F5) après avoir rechargé l’extension.

### Problème : l’extension se désactive automatiquement

**Solution :**

L’état de l’extension est enregistré dans `chrome.storage.local`. Vérifiez-le dans la background service worker console :

```javascript
chrome.storage.local.get(['extensionEnabled'], (result) => {
  console.log('Extension enabled:', result.extensionEnabled);
});
```

## Consulter les journaux

### 1. Content Script Console (page Web)
- Ouvrez les DevTools (F12) sur la page Web.
- Onglet « Console ».
- Repérez les messages commençant par `[Presidio]`.

### 2. Background Service Worker Console
- chrome://extensions/
- "MasqueIA" → "Inspect views: service worker"
- Repérez les messages commençant par `[Presidio Background]`.

### 3. Backend Logs
- Terminal dans lequel le backend est lancé.
- Les journaux Flask affichent toutes les requêtes :
  ```
  127.0.0.1 - - [15/Nov/2025 15:18:02] "POST /api/anonymize HTTP/1.1" 200 -
  ```

## Éléments à rechercher dans les journaux

### ✅ Fonctionnement normal :

**Content Script:**
```
[Presidio] Content script initialized. Auto-anonymization: ENABLED
[Presidio] Paste event detected - extension ENABLED
[Presidio] Sending anonymization request for pasted text...
[Presidio] Received response: {success: true, data: {...}}
```

**Background Service Worker:**
```
[Presidio Background] Backend URL: http://localhost:7000
[Presidio Background] Sending request to: http://localhost:7000/api/anonymize
[Presidio Background] Response status: 200
[Presidio Background] Anonymization successful: [PERSONNE] tel [TELEPHONE]
```

**Backend:**
```
2025-11-15 15:18:02 - api.anonymize - INFO - Analyzing with entities: [...]
2025-11-15 15:18:02 - app.anonymizer - INFO - Entités détectées : {'PERSON': 1, 'PHONE_NUMBER': 1}
2025-11-15 15:18:02 - api.anonymize - INFO - Anonymized text: 2 entities found, 116ms
2025-11-15 15:18:02 - werkzeug - INFO - 127.0.0.1 - - [15/Nov/2025 15:18:02] "POST /api/anonymize HTTP/1.1" 200 -
```

### ❌ Problèmes :

**Extension disabled:**
```
[Presidio] Paste event - extension DISABLED, skipping
```
→ Activez le bouton dans la fenêtre contextuelle.

**Backend offline:**
```
[Presidio Background] Anonymization error: Failed to fetch
```
→ Démarrez le backend.

**CORS error:**
```
Access to fetch at 'http://localhost:7000/api/anonymize' from origin 'chrome-extension://...' has been blocked by CORS policy
```
→ Vérifiez que la configuration CORS du backend est correcte.

## Conseils

### 1. Rechargez toujours l’extension après une modification du code
```
chrome://extensions/ → ⟳ → Fermez les onglets → Rouvrez-les
```

### 2. Utilisez test-extension.html pour effectuer rapidement des tests
```bash
open /Users/gaca/masqueia/test-extension.html
```

### 3. Consultez les trois journaux (content, background, backend)

### 4. Faites un test sur une page simple avant de tester des sites d’IA
- Commencez par test-extension.html.
- Passez ensuite à ChatGPT/Claude/Perplexity.

### 5. Utilisez le raccourci Ctrl+Shift+A comme backup
- Si l’auto-paste ne fonctionne pas.
- Vous pouvez toujours sélectionner le texte et utiliser le raccourci.

## C’est réussi !

Si tous les tests sont réussis, l’extension fonctionne correctement sur TOUS les sites d’IA :
- ✅ ChatGPT
- ✅ Claude
- ✅ Perplexity
- ✅ Gemini
- ✅ Copilot
- ✅ Et tout autre site comportant des formulaires !
