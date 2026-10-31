// MasqueIA service worker : relaie les requêtes de l'extension au moteur local
importScripts('locales.js');

// Le moteur n'accepte que l'origine de cette extension (ID fixé par "key" dans le manifeste)
const ENGINE_URL = 'http://localhost:7000/api';
const ENGINE_TIMEOUT_MS = 60000;
// Conversion Docling : premier chargement des modèles, OCR des PDF scannés
const FILE_TIMEOUT_MS = 10 * 60000;

async function callEngine(method, path, body) {
  try {
    const response = await fetch(ENGINE_URL + path, {
      method,
      // Chrome n'envoie pas d'en-tête Origin sur les GET d'une extension vers un hôte autorisé :
      // cet en-tête les identifie (une page web ne peut pas l'ajouter sans l'accord CORS du moteur)
      headers: { 'X-MasqueIA': '1', ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(path.startsWith('/files/') ? FILE_TIMEOUT_MS : ENGINE_TIMEOUT_MS)
    });
    return { status: response.status, body: await response.json().catch(() => null) };
  } catch (error) {
    const reason = error.name === 'TimeoutError'
      ? 'Le moteur MasqueIA ne répond pas'
      : 'Moteur MasqueIA injoignable (démarré ?)';
    return { transportError: reason };
  }
}

async function engineJson(method, path, body) {
  const reply = await callEngine(method, path, body);
  if (reply.transportError) throw new Error(reply.transportError);
  if (reply.status >= 400) throw new Error(reply.body?.message || reply.body?.error || `Erreur ${reply.status}`);
  return reply.body;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Seules les pages et scripts de l'extension peuvent appeler le moteur
  if (sender.id !== chrome.runtime.id) return;

  if (request.action === 'api') {
    callEngine(request.method, request.path, request.body).then(sendResponse);
    return true;
  }

  if (request.action === 'anonymize') {
    anonymizeText(request.text)
      .then(result => sendResponse({ success: true, data: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }

  if (request.action === 'deanonymize') {
    engineJson('POST', '/deanonymize', { session_id: request.sessionId, text: request.text })
      .then(result => sendResponse({ success: true, data: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

async function anonymizeText(text) {
  // Espace de travail actif (onglet Extension) : mêmes jetons que les fichiers déposés dans le projet
  const { activeWorkspace } = await chrome.storage.local.get('activeWorkspace');
  let reply = await callEngine('POST', '/anonymize', { text, workspace_id: activeWorkspace || undefined });
  if (activeWorkspace && reply.status === 404) {
    // Espace supprimé entre-temps : on l'oublie et on anonymise quand même, en session simple
    await chrome.storage.local.remove('activeWorkspace');
    reply = await callEngine('POST', '/anonymize', { text });
  }
  if (reply.transportError) throw new Error(reply.transportError);
  if (reply.status >= 400) throw new Error(reply.body?.message || reply.body?.error || `Erreur ${reply.status}`);
  const data = reply.body;
  const ts = data.ts || data.session_id;
  if (ts) chrome.storage.local.set({ lastTs: ts, lastSessionId: ts });
  return data;
}

// Open the side panel (right side) when the toolbar icon is clicked
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch(error => console.error('Failed to set side panel behavior:', error));

// Context menu for anonymizing selected text
chrome.runtime.onInstalled.addListener(() => {
  getUiLanguage().then(language => {
    chrome.contextMenus.removeAll(() => {
      if (chrome.runtime.lastError) {
        console.error('Failed to reset context menu:', chrome.runtime.lastError.message);
        return;
      }

      chrome.contextMenus.create({
        id: 'anonymize-selection',
        title: extensionText('contextMenu', language),
        contexts: ['selection']
      }, () => {
        if (chrome.runtime.lastError) {
          console.error('Failed to create context menu:', chrome.runtime.lastError.message);
        }
      });
    });
  }).catch(error => console.error('Failed to initialize context menu language:', error));
});

chrome.runtime.onStartup.addListener(() => {
  updateContextMenuLanguage().catch(error => console.error('Failed to update context menu language:', error));
});
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.uiLanguage) {
    updateContextMenuLanguage().catch(error => console.error('Failed to update context menu language:', error));
  }
});

async function updateContextMenuLanguage() {
  const language = await getUiLanguage();
  chrome.contextMenus.update('anonymize-selection', {
    title: extensionText('contextMenu', language)
  }, () => {
    if (chrome.runtime.lastError) {
      console.error('Failed to update context menu language:', chrome.runtime.lastError.message);
    }
  });
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'anonymize-selection') {
    const selectedText = info.selectionText;

    anonymizeText(selectedText)
      .then(result => {
        // Send result to content script to replace text
        chrome.tabs.sendMessage(tab.id, {
          action: 'replaceSelection',
          anonymizedText: result.anonymized_text
        });
      })
      .catch(error => {
        console.error('Failed to anonymize:', error);
      });
  }
});
