// MasqueIA - tableau de bord, paramètres, journaux et installation

let entitySettings = {};
let entityMeta = {};
const supportedLanguages = ['fr', 'en', 'de'];
const requestedLanguage = new URLSearchParams(window.location.search).get('lang');
const savedLanguage = localStorage.getItem('dashboardLanguage');
let currentLang = supportedLanguages.includes(requestedLanguage)
  ? requestedLanguage
  : supportedLanguages.includes(savedLanguage) ? savedLanguage : 'fr';

// Translations
const translations = {
  fr: {
    nav_dashboard: 'Tableau de bord',
    nav_settings: 'Paramètres',
    nav_logs: 'Historique',
    nav_setup: 'Installation',
    dashboard_title: 'Tableau de bord',
    dashboard_subtitle: 'Surveillez et testez le service d\'anonymisation en temps réel.',
    status_service: 'État du service',
    status_online: 'En ligne',
    status_offline: 'Hors ligne',
    request_count: 'Nombre de requêtes',
    test_title: '🧪 Tester l\'anonymisation',
    test_placeholder: 'Saisissez un texte contenant des données personnelles...',
    test_button: '🚀 Tester',
    clear_button: 'Effacer',
    result_title: 'Texte anonymisé :',
    settings_title: 'Paramètres d\'anonymisation',
    settings_subtitle: 'Gérez les types de données personnelles à détecter et à anonymiser.',
    service_status: 'État du service',
    loading_settings: 'Chargement des paramètres...',
    save_settings: 'Enregistrer les paramètres',
    reset_settings: 'Réinitialiser les paramètres',
    settings_saved: 'Paramètres enregistrés !',
    confirm_reset: 'Voulez-vous vraiment rétablir les paramètres par défaut ?',
    setup_title: 'Assistant de configuration',
    setup_subtitle: 'Vérifiez la configuration requise et installez le backend.',
    system_check: 'Vérification du système',
    checking: 'Vérification de la configuration requise...',
    install_instructions: 'Instructions d\'installation',
    backend_running: 'Le backend fonctionne ! ✅',
    setup_repair_prompt: 'Pour mettre à jour ou réparer l\'installation :',
    setup_download_repository: 'Téléchargez le dépôt depuis GitHub',
    setup_run_installer: 'Lancez le script d\'installation correspondant à votre système',
    setup_configured: 'Le backend sera configuré automatiquement',
    category_polish: '🇫🇷 Données françaises',
    category_us: '🇺🇸 Données américaines',
    category_other_countries: '🌍 Autres pays',
    category_other: '🔐 Autres types',
    version: 'Version',
    created_by: 'Créé par',
    example: 'Exemple',
    logs_title: 'Journaux d\'anonymisation',
    logs_subtitle: 'Historique des textes anonymisés : contenu avant et après traitement.',
    logs_history: 'Historique des opérations',
    clear_logs: '🗑️ Effacer les journaux',
    loading_logs: 'Chargement des journaux...',
    no_logs: 'Aucun journal à afficher',
    logs_error: 'Échec du chargement des journaux',
    logs_count: 'Affichage de {shown} sur {total} opérations',
    entity_singular: 'entité',
    entity_plural: 'entités',
    original_text: 'Texte original :',
    anonymized_text: 'Texte anonymisé :',
    empty_test: 'Saisissez un texte à tester !',
    clear_logs_confirm: 'Voulez-vous vraiment effacer tous les journaux ?',
    clear_logs_error: 'Échec de l\'effacement des journaux',
    settings_error: 'Échec du chargement des paramètres',
    setup_error: 'Échec de la vérification du système',
    request_error: 'Erreur : ',
    polish_entities: {
      EMAIL_ADDRESS: ['Adresse e-mail', 'Adresse utilisée pour les communications électroniques'],
      PL_PESEL: ['PESEL', 'Numéro d\'identification PESEL (11 chiffres)'],
      PL_NIP: ['NIP', 'Numéro d\'identification fiscale NIP (10 chiffres)'],
      PL_PASSPORT: ['Passeport', 'Numéro de passeport (2 lettres + 7 chiffres)'],
      PL_ID_CARD: ['Carte d\'identité', 'Numéro de carte d\'identité (3 lettres + 6 chiffres)'],
      PL_REGON: ['REGON', 'Numéro d\'immatriculation d\'entreprise REGON (9 ou 14 chiffres)'],
      PHONE_NUMBER: ['Numéro de téléphone', 'Numéros de téléphone nationaux et internationaux'],
      CREDIT_CARD: ['Carte bancaire', 'Numéros de cartes de crédit et de débit'],
      IBAN_CODE: ['Numéro IBAN', 'Numéro de compte bancaire international'],
      IP_ADDRESS: ['Adresse IP', 'Adresses IPv4 et IPv6'],
      URL: ['Adresse URL', 'Adresses de sites web et liens'],
      DATE_TIME: ['Date et heure', 'Dates de naissance et horodatages'],
      US_SSN: ['Numéro de sécurité sociale américain', 'Numéro de sécurité sociale des États-Unis'],
      US_PASSPORT: ['Passeport américain', 'Numéro de passeport américain'],
      US_BANK_NUMBER: ['Compte bancaire américain', 'Numéro de compte bancaire aux États-Unis'],
      US_DRIVER_LICENSE: ['Permis de conduire américain', 'Permis de conduire des États-Unis'],
      US_ITIN: ['ITIN américain', 'Numéro d\'identification fiscale individuel américain'],
      UK_NHS: ['Numéro NHS britannique', 'Numéro du service de santé britannique'],
      AU_ABN: ['ABN australien', 'Numéro d\'entreprise australien'],
      AU_ACN: ['ACN australien', 'Numéro d\'immatriculation des sociétés australiennes'],
      AU_TFN: ['TFN australien', 'Numéro de dossier fiscal australien'],
      AU_MEDICARE: ['Medicare australien', 'Numéro Medicare australien'],
      SG_NRIC_FIN: ['NRIC/FIN singapourien', 'Numéro d\'identification singapourien'],
      NRP: ['Numéro d\'identification portugais', 'Numéro d\'identification portugais'],
      PERSON: ['Nom et prénom', 'Noms et prénoms de personnes'],
      LOCATION: ['Lieu', 'Adresses, villes et pays'],
      CRYPTO: ['Portefeuille de cryptomonnaie', 'Adresses de portefeuilles Bitcoin, Ethereum, etc.'],
      MEDICAL_LICENSE: ['Licence médicale', 'Numéros de licence médicale']
    }
  },
  en: {
    // Navigation
    nav_dashboard: 'Dashboard',
    nav_settings: 'Settings',
    nav_logs: 'Logs',
    nav_setup: 'Setup',

    // Dashboard
    dashboard_title: 'Dashboard',
    dashboard_subtitle: 'Monitor and test anonymization service in real-time.',
    status_service: 'Service Status',
    status_online: 'Online',
    status_offline: 'Offline',
    request_count: 'Request Count',
    test_title: '🧪 Anonymization Test',
    test_placeholder: 'Enter text with personal data...',
    test_button: '🚀 Test',
    clear_button: 'Clear',
    result_title: 'Anonymized text:',

    // Settings
    settings_title: 'Anonymization Settings',
    settings_subtitle: 'Manage personal data types to be detected and anonymized.',
    service_status: 'Service Status',
    loading_settings: 'Loading settings...',
    save_settings: 'Save Settings',
    reset_settings: 'Reset to Defaults',
    settings_saved: 'Settings saved!',
    confirm_reset: 'Are you sure you want to reset to default settings?',

    // Setup
    setup_title: 'Setup Wizard',
    setup_subtitle: 'Check system requirements and install backend.',
    system_check: 'System Check',
    checking: 'Checking requirements...',
    install_instructions: 'Installation Instructions',
    backend_running: 'Backend is running! ✅',
    setup_repair_prompt: 'To update or repair the installation:',
    setup_download_repository: 'Download the repository from GitHub',
    setup_run_installer: 'Run the installation script for your operating system',
    setup_configured: 'The backend will be configured automatically',

    // Categories
    category_polish: '🇫🇷 French Data',
    category_us: '🇺🇸 US Data',
    category_other_countries: '🌍 Other Countries',
    category_other: '🔐 Other Types',

    // Footer
    version: 'Version',
    created_by: 'Created by',

    // Entity examples
    example: 'Example',
    logs_title: 'Anonymization Logs',
    logs_subtitle: 'History of anonymized text: what went in and what came out.',
    logs_history: 'Operation History',
    clear_logs: '🗑️ Clear logs',
    loading_logs: 'Loading logs...',
    no_logs: 'No logs to display',
    logs_error: 'Failed to load logs',
    logs_count: 'Showing {shown} of {total} logs',
    entity_singular: 'entity',
    entity_plural: 'entities',
    original_text: 'Original text:',
    anonymized_text: 'Anonymized:',
    empty_test: 'Enter text to test!',
    clear_logs_confirm: 'Are you sure you want to clear all logs?',
    clear_logs_error: 'Failed to clear logs',
    settings_error: 'Failed to load settings',
    setup_error: 'System check failed',
    request_error: 'Error: ',
    entity_info: {
      EMAIL_ADDRESS: ['Email address', 'Address used for electronic communication'],
      PL_PESEL: ['PESEL', 'PESEL identification number (11 digits)'],
      PL_NIP: ['NIP', 'Tax identification number NIP (10 digits)'],
      PL_PASSPORT: ['Passport', 'Passport number (2 letters + 7 digits)'],
      PL_ID_CARD: ['Identity card', 'Identity card number (3 letters + 6 digits)'],
      PL_REGON: ['REGON', 'Business registry number REGON (9 or 14 digits)'],
      PHONE_NUMBER: ['Phone number', 'Domestic and international phone numbers'],
      CREDIT_CARD: ['Credit card', 'Credit and debit card numbers'],
      IBAN_CODE: ['IBAN number', 'International bank account number'],
      IP_ADDRESS: ['IP address', 'IPv4 and IPv6 addresses'],
      URL: ['URL', 'Website addresses and links'],
      DATE_TIME: ['Date and time', 'Birth dates and timestamps'],
      US_SSN: ['US Social Security Number', 'United States Social Security number'],
      US_PASSPORT: ['US passport', 'United States passport number'],
      US_BANK_NUMBER: ['US bank account', 'United States bank account number'],
      US_DRIVER_LICENSE: ['US driver license', 'United States driver license'],
      US_ITIN: ['US ITIN', 'United States Individual Taxpayer Identification Number'],
      UK_NHS: ['UK NHS number', 'United Kingdom National Health Service number'],
      AU_ABN: ['Australian ABN', 'Australian Business Number'],
      AU_ACN: ['Australian ACN', 'Australian Company Number'],
      AU_TFN: ['Australian TFN', 'Australian Tax File Number'],
      AU_MEDICARE: ['Australian Medicare', 'Australian Medicare number'],
      SG_NRIC_FIN: ['Singapore NRIC/FIN', 'Singapore identification number'],
      NRP: ['Portuguese identification number', 'Portuguese identification number'],
      PERSON: ['Person name', 'Names of people'],
      LOCATION: ['Location', 'Addresses, cities, and countries'],
      CRYPTO: ['Cryptocurrency wallet', 'Bitcoin, Ethereum, and other wallet addresses'],
      MEDICAL_LICENSE: ['Medical license', 'Medical and practitioner license numbers']
    }
  },
  de: {
    // Navigation
    nav_dashboard: 'Dashboard',
    nav_settings: 'Einstellungen',
    nav_logs: 'Protokolle',
    nav_setup: 'Setup',

    // Dashboard
    dashboard_title: 'Dashboard',
    dashboard_subtitle: 'Überwachen und testen Sie den Anonymisierungsdienst in Echtzeit.',
    status_service: 'Dienststatus',
    status_online: 'Online',
    status_offline: 'Offline',
    request_count: 'Anfragenzahl',
    test_title: '🧪 Anonymisierungstest',
    test_placeholder: 'Geben Sie Text mit personenbezogenen Daten ein...',
    test_button: '🚀 Testen',
    clear_button: 'Löschen',
    result_title: 'Anonymisierter Text:',

    // Settings
    settings_title: 'Anonymisierungseinstellungen',
    settings_subtitle: 'Verwalten Sie Arten personenbezogener Daten, die erkannt und anonymisiert werden sollen.',
    service_status: 'Dienststatus',
    loading_settings: 'Einstellungen werden geladen...',
    save_settings: 'Einstellungen speichern',
    reset_settings: 'Auf Standard zurücksetzen',
    settings_saved: 'Einstellungen gespeichert!',
    confirm_reset: 'Möchten Sie wirklich die Standardeinstellungen wiederherstellen?',

    // Setup
    setup_title: 'Setup-Assistent',
    setup_subtitle: 'Überprüfen Sie Systemanforderungen und installieren Sie das Backend.',
    system_check: 'Systemüberprüfung',
    checking: 'Überprüfung der Anforderungen...',
    install_instructions: 'Installationsanweisungen',
    backend_running: 'Backend läuft! ✅',
    setup_repair_prompt: 'So aktualisieren oder reparieren Sie die Installation:',
    setup_download_repository: 'Laden Sie das Repository von GitHub herunter',
    setup_run_installer: 'Führen Sie das Installationsskript für Ihr Betriebssystem aus',
    setup_configured: 'Das Backend wird automatisch konfiguriert',

    // Categories
    category_polish: '🇫🇷 Französische Daten',
    category_us: '🇺🇸 US-Daten',
    category_other_countries: '🌍 Andere Länder',
    category_other: '🔐 Andere Typen',

    // Footer
    version: 'Version',
    created_by: 'Erstellt von',

    // Entity examples
    example: 'Beispiel',
    logs_title: 'Anonymisierungsprotokolle',
    logs_subtitle: 'Verlauf anonymisierter Texte: Inhalt vor und nach der Verarbeitung.',
    logs_history: 'Vorgangsverlauf',
    clear_logs: '🗑️ Protokolle löschen',
    loading_logs: 'Protokolle werden geladen...',
    no_logs: 'Keine Protokolle vorhanden',
    logs_error: 'Protokolle konnten nicht geladen werden',
    logs_count: '{shown} von {total} Protokollen werden angezeigt',
    entity_singular: 'Entität',
    entity_plural: 'Entitäten',
    original_text: 'Originaltext:',
    anonymized_text: 'Anonymisiert:',
    empty_test: 'Geben Sie einen Text zum Testen ein!',
    clear_logs_confirm: 'Möchten Sie wirklich alle Protokolle löschen?',
    clear_logs_error: 'Protokolle konnten nicht gelöscht werden',
    settings_error: 'Einstellungen konnten nicht geladen werden',
    setup_error: 'Systemprüfung fehlgeschlagen',
    request_error: 'Fehler: '
  }
};

// Language switcher
document.querySelectorAll('.lang-flag').forEach(flag => {
  flag.addEventListener('click', () => {
    const lang = flag.dataset.lang;
    switchLanguage(lang);
  });
});

function switchLanguage(lang) {
  if (!supportedLanguages.includes(lang)) return;
  currentLang = lang;
  localStorage.setItem('dashboardLanguage', lang);
  // Langue des messages dans les sites (script de contenu) et du menu contextuel
  if (IN_EXTENSION && ['fr', 'en'].includes(lang)) chrome.storage.local.set({ uiLanguage: lang });
  document.documentElement.lang = lang;

  // Update active flag
  document.querySelectorAll('.lang-flag').forEach(f => f.classList.remove('active'));
  document.querySelector(`[data-lang="${lang}"]`)?.classList.add('active');

  // Update all UI text
  updateUIText();
}

function t(key, values = {}) {
  const template = translations[currentLang]?.[key] || translations.en[key] || key;
  return template.replace(/\{(\w+)\}/g, (_, name) => values[name] ?? '');
}

function updateUIText() {
  document.documentElement.lang = currentLang;
  document.title = `MasqueIA - ${t('nav_dashboard')}`;
  document.querySelectorAll('.lang-flag').forEach(flag => {
    flag.classList.toggle('active', flag.dataset.lang === currentLang);
  });

  // Navigation (le libellé sert aussi d'infobulle : seules les icônes restent dans le panneau latéral)
  const navLabels = {
    extension: 'Extension', dashboard: t('nav_dashboard'), settings: t('nav_settings'),
    logs: t('nav_logs'), setup: t('nav_setup')
  };
  document.querySelectorAll('.nav-item').forEach(item => {
    const label = navLabels[item.dataset.section];
    item.querySelector('span').textContent = label;
    item.title = label;
  });
  const languageSelect = document.getElementById('ext-language');
  if (languageSelect) languageSelect.value = currentLang;

  // Dashboard
  document.querySelector('#dashboard .page-header h1').textContent = t('dashboard_title');
  document.querySelector('#dashboard .page-header p').textContent = t('dashboard_subtitle');
  document.querySelectorAll('#dashboard .stat-content h3')[0].textContent = t('status_service');
  document.querySelectorAll('#dashboard .stat-content h3')[1].textContent = t('request_count');
  const statusValue = document.getElementById('status-value');
  statusValue.textContent = t(statusValue.classList.contains('offline') ? 'status_offline' : 'status_online');
  document.querySelector('#dashboard .card h2').textContent = t('test_title');
  document.getElementById('test-input').placeholder = t('test_placeholder');
  document.querySelector('#dashboard .btn-primary').textContent = t('test_button');
  document.querySelector('#dashboard .btn-secondary').textContent = t('clear_button');
  document.querySelector('#test-result h4').textContent = t('result_title');

  // Settings
  document.querySelector('#settings .page-header h1').textContent = t('settings_title');
  document.querySelector('#settings .page-header p').textContent = t('settings_subtitle');
  document.querySelector('#settings .card h2').textContent = t('service_status');
  document.querySelector('#status-badge-settings span').textContent = t('status_online');
  const settingsLoading = document.querySelector('#settings-container > p');
  if (settingsLoading) settingsLoading.textContent = t('loading_settings');
  document.getElementById('save-settings-button').textContent = t('save_settings');
  document.getElementById('reset-settings-button').textContent = t('reset_settings');

  // Setup
  document.querySelector('#setup .page-header h1').textContent = t('setup_title');
  document.querySelector('#setup .page-header p').textContent = t('setup_subtitle');
  document.querySelector('#setup .card h2').textContent = t('system_check');
  document.getElementById('setup-checking').textContent = t('checking');
  document.querySelector('#setup-instructions h2').textContent = t('install_instructions');
  document.getElementById('setup-backend-running').textContent = t('backend_running');
  document.getElementById('setup-repair-prompt').textContent = t('setup_repair_prompt');
  document.getElementById('setup-download-repository').textContent = t('setup_download_repository');
  document.getElementById('setup-run-installer').textContent = t('setup_run_installer');
  document.getElementById('setup-configured').textContent = t('setup_configured');

  // Logs
  document.querySelector('#logs .page-header h1').textContent = t('logs_title');
  document.getElementById('logs-subtitle').textContent = t('logs_subtitle');
  document.getElementById('logs-history-title').textContent = t('logs_history');
  document.getElementById('clear-logs-button').textContent = t('clear_logs');
  document.getElementById('logs-container').innerHTML =
    `<p style="text-align: center; color: var(--text-3); padding: 40px;">${t('loading_logs')}</p>`;

  // Footer
  document.getElementById('footer-version').textContent = t('version');
  document.getElementById('footer-created').textContent = t('created_by');

  // Re-render settings to update entity names
  if (document.getElementById('settings').classList.contains('active')) {
    renderSettings();
  }
  if (document.getElementById('logs').classList.contains('active')) {
    loadLogs();
  }
}

// Navigation
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    const section = item.dataset.section;
    showSection(section);
  });
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      showSection(item.dataset.section);
    }
  });
});

function showSection(sectionId) {
  // Update nav
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.section === sectionId) {
      item.classList.add('active');
    }
  });

  // Update sections
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  document.getElementById(sectionId).classList.add('active');

  // Load section data
  if (sectionId === 'extension') loadExtensionTab();
  if (sectionId === 'settings') loadSettings();
  if (sectionId === 'setup') checkSetup();
  if (sectionId === 'logs') loadLogs();
}

// Session ID de la dernière anonymisation (pour désanonymiser)
let currentSessionId = null;

// Dashboard functions
async function testAnonymize() {
  const text = document.getElementById('test-input').value;
  if (!text) return notify(t('empty_test'));

  try {
    const res = await apiFetch(`/anonymize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const data = await res.json();

    const tsLabel = (data.ts || data.session_id)
      ? `[SESSION:${data.ts || data.session_id}]\n` : '';
    document.getElementById('anonymized-text').textContent = tsLabel + data.anonymized_text;
    document.getElementById('test-result').classList.remove('hidden');

    // Activer le panneau de désanonymisation si on a un session_id
    const ts = data.ts || data.session_id;
    if (ts) {
      currentSessionId = ts;
      document.getElementById('deanon-panel').style.display = '';
      document.getElementById('deanon-result').classList.add('hidden');
      document.getElementById('deanon-input').value = '';
      const sid = document.getElementById('session-id-value');
      if (sid) sid.textContent = ts;
    }

    const count = parseInt(document.getElementById('request-count').textContent);
    document.getElementById('request-count').textContent = count + 1;
  } catch (err) {
    notify(t('request_error') + err.message, 'error');
  }
}

async function deanonymizeResponse() {
  const text = document.getElementById('deanon-input').value.trim();
  if (!text) return;
  if (!currentSessionId) return notify('Aucune session active. Testez d\'abord un texte.');

  try {
    const res = await apiFetch(`/deanonymize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: currentSessionId, text })
    });
    const data = await res.json();
    if (!res.ok) return notify(data.error || 'Erreur de désanonymisation', 'error');

    document.getElementById('deanon-text').textContent = data.deanonymized_text;
    document.getElementById('deanon-count').textContent =
      `${data.replacements} substitution(s) effectuée(s)`;
    document.getElementById('deanon-result').classList.remove('hidden');
  } catch (err) {
    notify(t('request_error') + err.message, 'error');
  }
}

function clearDeanon() {
  document.getElementById('deanon-input').value = '';
  document.getElementById('deanon-result').classList.add('hidden');
}

function clearTest() {
  document.getElementById('test-input').value = '';
  document.getElementById('test-result').classList.add('hidden');
  document.getElementById('deanon-panel').style.display = 'none';
  currentSessionId = null;
}

// Fichiers à déposer dans le RAG d'un LLM cloud (Projets, NotebookLM…)
const PREVIEW_CHARS = 3000;
const WORKSPACE_KEY = 'activeWorkspace';

async function engineJson(path, options = {}) {
  const res = await apiFetch(path, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || data?.error || `Erreur ${res.status}`);
  return data;
}

// Les sélecteurs d'espace (onglet Extension, carte Fichiers) affichent le même espace actif
let knownWorkspaces = [];

async function loadWorkspaces(selectedId) {
  ({ workspaces: knownWorkspaces } = await engineJson('/workspaces'));
  const remembered = selectedId === undefined ? await activeWorkspace() : selectedId;
  const options = '<option value="">Aucun : jetons propres à chaque collage ou fichier</option>' + knownWorkspaces
    .map(w => `<option value="${escapeHtml(w.id)}">${escapeHtml(w.name)} (${w.count} valeur(s))</option>`)
    .join('');
  const value = knownWorkspaces.some(w => w.id === remembered) ? remembered : '';
  document.querySelectorAll('.workspace-select').forEach(select => {
    select.innerHTML = options;
    select.value = value;
  });
  document.querySelectorAll('.workspace-card').forEach(card => card.classList.toggle('active', !!value));
}

function selectedWorkspace() {
  return document.querySelector('.workspace-select')?.value || '';
}

async function loadFileFormats() {
  const { extensions, docling } = await engineJson('/files/formats');
  document.getElementById('file-input').accept = extensions.join(',');
  document.getElementById('file-formats').textContent = extensions.join(' ')
    + (docling ? '' : ' — PDF, Office et images : installez Docling (pip install docling)');
}

async function createWorkspace() {
  const name = await askText('Nom du nouvel espace de travail', 'Nom du Projet ou du Notebook');
  if (!name) return;
  try {
    const workspace = await engineJson('/workspaces', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    rememberWorkspace(workspace.id);
    await loadWorkspaces(workspace.id);
    notify(`Espace « ${workspace.name} » créé et actif`, 'success');
  } catch (err) {
    notify(t('request_error') + err.message, 'error');
  }
}

async function deleteWorkspace() {
  const id = selectedWorkspace();
  if (!id) return notify('Choisissez d’abord l’espace à supprimer');
  const name = knownWorkspaces.find(w => w.id === id)?.name || id;
  const message = `Supprimer « ${name} » ? Les jetons de cet espace ne pourront plus être désanonymisés.`;
  if (!await askConfirm(message, 'Supprimer', true)) return;
  try {
    await engineJson(`/workspaces/${encodeURIComponent(id)}`, { method: 'DELETE' });
    rememberWorkspace('');
    await loadWorkspaces('');
  } catch (err) {
    notify(t('request_error') + err.message, 'error');
  }
}

// Dans l'extension, l'espace choisi ici est aussi celui des collages (service worker)
async function activeWorkspace() {
  if (IN_EXTENSION) return (await chrome.storage.local.get('activeWorkspace')).activeWorkspace || '';
  try { return localStorage.getItem(WORKSPACE_KEY) || ''; } catch { return ''; }
}

function rememberWorkspace(id) {
  if (IN_EXTENSION) return chrome.storage.local.set({ activeWorkspace: id });
  try { localStorage.setItem(WORKSPACE_KEY, id); } catch { /* stockage indisponible */ }
}

function readAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.slice(reader.result.indexOf(',') + 1));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function downloadText(filename, text) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const link = Object.assign(document.createElement('a'), { href: url, download: filename });
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function renderFileResult(box, file, data) {
  const types = {};
  data.entities_found.forEach(e => { types[e.type] = (types[e.type] || 0) + 1; });
  const summary = Object.entries(types).map(([type, n]) => `${type} × ${n}`).join(', ') || 'aucune';
  const preview = data.anonymized_text.length > PREVIEW_CHARS
    ? data.anonymized_text.slice(0, PREVIEW_CHARS) + '\n…' : data.anonymized_text;

  box.innerHTML = `
    <h4><span>✅ ${escapeHtml(file.name)} → ${escapeHtml(data.output_filename)}</span>
      <button class="btn btn-primary btn-sm">⬇ Télécharger</button></h4>
    <p class="meta">${data.entities_found.length} donnée(s) masquée(s) : ${escapeHtml(summary)}</p>
    <details><summary>Vérifier les valeurs masquées avant de déposer le fichier</summary>
      <p>${data.entities_found.map(e => `${escapeHtml(e.type)} : ${escapeHtml(e.text)}`).join('\n') || '—'}</p>
    </details>
    <details><summary>Aperçu du fichier anonymisé</summary>
      <p class="preview">${escapeHtml(preview)}</p>
    </details>`;
  box.querySelector('button').addEventListener('click', () => downloadText(data.output_filename, data.anonymized_text));
}

async function anonymizeFiles(files) {
  const results = document.getElementById('file-results');
  const workspaceId = selectedWorkspace() || undefined;

  for (const file of files) {
    const box = document.createElement('div');
    box.className = 'result file-result';
    box.innerHTML = `<h4><span>⏳ ${escapeHtml(file.name)} : conversion et anonymisation…</span></h4>`;
    results.prepend(box);
    try {
      const data = await engineJson('/files/anonymize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, content: await readAsBase64(file), workspace_id: workspaceId })
      });
      renderFileResult(box, file, data);
    } catch (err) {
      box.classList.add('error');
      box.innerHTML = `<h4><span>❌ ${escapeHtml(file.name)} : ${escapeHtml(err.message)}</span></h4>`;
    }
  }
  if (workspaceId) loadWorkspaces(workspaceId).catch(() => {});
}

function initFileDrop() {
  const drop = document.getElementById('file-drop');
  const input = document.getElementById('file-input');

  input.addEventListener('change', () => { anonymizeFiles([...input.files]); input.value = ''; });
  drop.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); input.click(); }
  });
  drop.addEventListener('dragover', (event) => { event.preventDefault(); drop.classList.add('dragging'); });
  drop.addEventListener('dragleave', () => drop.classList.remove('dragging'));
  drop.addEventListener('drop', (event) => {
    event.preventDefault();
    drop.classList.remove('dragging');
    anonymizeFiles([...event.dataTransfer.files]);
  });
  document.querySelectorAll('.workspace-select').forEach(select => select.addEventListener('change', () => {
    rememberWorkspace(select.value);
    loadWorkspaces(select.value).catch(() => {});
  }));

  loadWorkspaces().catch(() => {});
  loadFileFormats().catch(() => {});
}

// Settings functions
async function loadSettings() {
  try {
    const res = await apiFetch(`/config`);
    const data = await res.json();

    if (data.entities && Array.isArray(data.entities)) {
      entitySettings = {};
      entityMeta = {};
      data.entities.forEach(e => {
        entitySettings[e.name] = e.enabled;
        entityMeta[e.name] = { description: e.description || '', mask: e.mask || `[${e.name}]`, team: !!e.team };
      });
    }

    renderTeam(data.team);
    renderSettings();
  } catch (err) {
    document.getElementById('settings-container').innerHTML = `<p>${t('settings_error')}</p>`;
  }
}

function renderSettings() {
  // Complete entity definitions with categories, descriptions, and examples
  const entityData = {
    'polish': {
      title: t('category_polish'),
      entities: [
        {
          name: 'EMAIL_ADDRESS',
          displayName: 'Adresse e-mail',
          description: 'Adresse utilisée pour les communications électroniques',
          example: 'jan.kowalski@example.com',
          defaultEnabled: true
        },
        {
          name: 'PL_PESEL',
          displayName: 'PESEL',
          description: 'Numéro d\'identification PESEL (11 chiffres)',
          example: '92032912345',
          defaultEnabled: true
        },
        {
          name: 'PL_NIP',
          displayName: 'NIP',
          description: 'Numéro d\'identification fiscale (10 chiffres)',
          example: '1234563218',
          defaultEnabled: true
        },
        {
          name: 'PL_PASSPORT',
          displayName: 'Passeport',
          description: 'Numéro de passeport (2 lettres + 7 chiffres)',
          example: 'AB1234567',
          defaultEnabled: true
        },
        {
          name: 'PL_ID_CARD',
          displayName: 'Carte d\'identité',
          description: 'Numéro de carte d\'identité (3 lettres + 6 chiffres)',
          example: 'ABC123456',
          defaultEnabled: true
        },
        {
          name: 'PL_REGON',
          displayName: 'REGON',
          description: 'Numéro REGON d\'entreprise (9 ou 14 chiffres)',
          example: '123456785',
          defaultEnabled: true
        },
        {
          name: 'PHONE_NUMBER',
          displayName: 'Numéro de téléphone',
          description: 'Numéros nationaux et internationaux',
          example: '+48 123 456 789',
          defaultEnabled: true
        },
        {
          name: 'CREDIT_CARD',
          displayName: 'Carte bancaire',
          description: 'Numéros de cartes de crédit et de débit',
          example: '4532-1234-5678-9010',
          defaultEnabled: true
        },
        {
          name: 'IBAN_CODE',
          displayName: 'Numéro IBAN',
          description: 'Numéro de compte bancaire international',
          example: 'PL61109010140000071219812874',
          defaultEnabled: true
        },
        {
          name: 'IP_ADDRESS',
          displayName: 'Adresse IP',
          description: 'Adresses IPv4 et IPv6',
          example: '192.168.1.1',
          defaultEnabled: true
        },
        {
          name: 'URL',
          displayName: 'Adresse URL',
          description: 'Adresses de sites web et liens',
          example: 'https://example.com',
          defaultEnabled: true
        },
        {
          name: 'DATE_TIME',
          displayName: 'Date et heure',
          description: 'Dates de naissance et horodatages',
          example: '15.03.1992',
          defaultEnabled: true
        }
      ]
    },
    'us': {
      title: t('category_us'),
      entities: [
        {
          name: 'US_SSN',
          displayName: 'Social Security Number',
          description: 'Numéro de sécurité sociale américain',
          example: '123-45-6789',
          defaultEnabled: false
        },
        {
          name: 'US_PASSPORT',
          displayName: 'US Passport',
          description: 'Numéro de passeport américain',
          example: '123456789',
          defaultEnabled: false
        },
        {
          name: 'US_BANK_NUMBER',
          displayName: 'US Bank Account',
          description: 'Numéro de compte bancaire aux États-Unis',
          example: '123456789012',
          defaultEnabled: false
        },
        {
          name: 'US_DRIVER_LICENSE',
          displayName: 'US Driver License',
          description: 'Permis de conduire américain',
          example: 'D1234567',
          defaultEnabled: false
        },
        {
          name: 'US_ITIN',
          displayName: 'US ITIN',
          description: 'Individual Taxpayer Identification Number',
          example: '900-70-1234',
          defaultEnabled: false
        }
      ]
    },
    'other_countries': {
      title: t('category_other_countries'),
      entities: [
        {
          name: 'UK_NHS',
          displayName: 'UK NHS Number',
          description: 'Numéro NHS britannique (service de santé)',
          example: '123 456 7890',
          defaultEnabled: false
        },
        {
          name: 'AU_ABN',
          displayName: 'Australian ABN',
          description: 'Australian Business Number',
          example: '12345678901',
          defaultEnabled: false
        },
        {
          name: 'AU_ACN',
          displayName: 'Australian ACN',
          description: 'Australian Company Number',
          example: '123456789',
          defaultEnabled: false
        },
        {
          name: 'AU_TFN',
          displayName: 'Australian TFN',
          description: 'Tax File Number (Australia)',
          example: '123456782',
          defaultEnabled: false
        },
        {
          name: 'AU_MEDICARE',
          displayName: 'Australian Medicare',
          description: 'Numéro Medicare australien',
          example: '2123 45670 1',
          defaultEnabled: false
        },
        {
          name: 'SG_NRIC_FIN',
          displayName: 'Singapore NRIC/FIN',
          description: 'Numéro d\'identification singapourien',
          example: 'S1234567D',
          defaultEnabled: false
        },
        {
          name: 'NRP',
          displayName: 'NRP (Portugal)',
          description: 'Numéro d\'identification portugais',
          example: '123456789',
          defaultEnabled: false
        }
      ]
    },
    'other': {
      title: t('category_other'),
      entities: [
        {
          name: 'PERSON',
          displayName: 'Nom et prénom',
          description: 'Noms et prénoms de personnes',
          example: 'Jan Kowalski',
          defaultEnabled: true
        },
        {
          name: 'LOCATION',
          displayName: 'Lieu',
          description: 'Adresses, villes et pays',
          example: 'ul. Marszałkowska 1, Warszawa',
          defaultEnabled: true
        },
        {
          name: 'CRYPTO',
          displayName: 'Portefeuille de cryptomonnaie',
          description: 'Adresses de portefeuilles Bitcoin, Ethereum, etc.',
          example: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
          defaultEnabled: false
        },
        {
          name: 'MEDICAL_LICENSE',
          displayName: 'Licence médicale',
          description: 'Numéros de licences médicales et professionnelles',
          example: 'ML-123456',
          defaultEnabled: false
        }
      ]
    }
  };

  let html = '';

  // Render each category
  Object.keys(entityData).forEach(categoryKey => {
    const category = entityData[categoryKey];

    const enabledCount = category.entities.filter(entity => entitySettings.hasOwnProperty(entity.name)
      ? entitySettings[entity.name]
      : entity.defaultEnabled).length;
    html += categoryOpening(categoryKey, category.title, enabledCount, category.entities.length);

    category.entities.forEach(entity => {
      const localizedEntity = translations[currentLang]?.polish_entities?.[entity.name]
        || translations[currentLang]?.entity_info?.[entity.name];
      const displayName = localizedEntity?.[0] || entity.displayName;
      const description = localizedEntity?.[1] || entity.description;
      // Check if entity is enabled (use default if not set)
      const enabled = entitySettings.hasOwnProperty(entity.name)
        ? entitySettings[entity.name]
        : entity.defaultEnabled;

      html += `
        <div class="entity-card ${enabled ? 'enabled' : ''}" data-action="toggleEntity" data-arg="${entity.name}">
          <div class="entity-card-header">
            <div class="entity-name">${displayName}${teamBadge(entity.name)}</div>
            <div class="toggle-switch ${enabled ? 'enabled' : ''}">
              <div class="toggle-knob"></div>
            </div>
          </div>
          <div class="entity-description">${description}</div>
          <code class="entity-example">${t('example')}: ${entity.example}</code>
        </div>
      `;
    });

    html += `
        </div>
      </details>
    `;
  });

  // Les entités ajoutées via le panneau « Ajouter » ne sont pas dans la liste
  // codée en dur : elles sont affichées dans une catégorie dédiée.
  const knownNames = new Set();
  Object.values(entityData).forEach(cat => cat.entities.forEach(e => knownNames.add(e.name)));
  html += renderCustomEntities(knownNames);

  document.getElementById('settings-container').innerHTML = html;
}

function renderCustomEntities(knownNames) {
  const customNames = Object.keys(entitySettings).filter(name => !knownNames.has(name));
  if (customNames.length === 0) return '';

  const enabledCount = customNames.filter(name => entitySettings[name]).length;
  let html = categoryOpening('custom', '✨ Données personnalisées', enabledCount, customNames.length);

  customNames.forEach(name => {
    const enabled = !!entitySettings[name];
    const meta = entityMeta[name] || {};
    html += `
      <div class="entity-card ${enabled ? 'enabled' : ''}" data-action="toggleEntity" data-arg="${name}">
        <div class="entity-card-header">
          <div class="entity-name">${escapeHtml(name)}${teamBadge(name)}</div>
          <div class="toggle-switch ${enabled ? 'enabled' : ''}">
            <div class="toggle-knob"></div>
          </div>
        </div>
        <div class="entity-description">${escapeHtml(meta.description || '')}</div>
        <code class="entity-example">${escapeHtml(meta.mask || `[${name}]`)}</code>
      </div>
    `;
  });

  html += `</div></details>`;
  return html;
}

// Sections repliables : l'état est mémorisé, car chaque bascule d'entité redessine la liste
const COLLAPSED_KEY = 'collapsedCategories';
function collapsedCategories() {
  try {
    return new Set(JSON.parse(localStorage.getItem(COLLAPSED_KEY)) || []);
  } catch {
    return new Set();
  }
}

function categoryOpening(key, title, enabledCount, total) {
  const open = collapsedCategories().has(key) ? '' : ' open';
  return `
    <details class="card category-section" data-category="${key}"${open}>
      <summary class="category-header">
        <span>${title}</span>
        <span class="category-count">${enabledCount} / ${total}</span>
      </summary>
      <div class="entity-grid">
  `;
}

document.getElementById('settings-container').addEventListener('toggle', e => {
  const key = e.target.dataset?.category;
  if (!key) return;
  const collapsed = collapsedCategories();
  e.target.open ? collapsed.delete(key) : collapsed.add(key);
  try { localStorage.setItem(COLLAPSED_KEY, JSON.stringify([...collapsed])); } catch { /* stockage indisponible */ }
}, true);

async function testNewPattern() {
  const resultDiv = document.getElementById('ne-result');
  const payload = {
    regex: document.getElementById('ne-regex').value,
    text: document.getElementById('ne-sample').value,
    score: parseFloat(document.getElementById('ne-score').value) || 0.5,
    validator: document.getElementById('ne-validator').value || undefined,
    context: document.getElementById('ne-context').value
      .split(',').map(s => s.trim()).filter(Boolean)
  };

  if (!payload.regex || !payload.text) {
    resultDiv.className = '';
    resultDiv.style.cssText = 'background:var(--danger-soft);color:var(--danger);';
    resultDiv.textContent = 'Saisissez une expression régulière et un texte d\'exemple.';
    return;
  }

  try {
    const res = await apiFetch(`/test-pattern`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    resultDiv.className = '';
    if (!res.ok) {
      resultDiv.style.cssText = 'background:var(--danger-soft);color:var(--danger);';
      resultDiv.textContent = data.message || 'Erreur';
    } else if (data.matches.length === 0) {
      resultDiv.style.cssText = 'background:var(--warning-soft);color:var(--warning);';
      resultDiv.textContent = 'Aucune correspondance. Vérifiez le motif ou la somme de contrôle.';
    } else {
      resultDiv.style.cssText = 'background:var(--success-soft);color:var(--success);';
      resultDiv.innerHTML = '✅ Correspondances : ' + data.matches
        .map(m => `<code>${escapeHtml(m.text)}</code> (score ${m.score})`).join(', ');
    }
  } catch (err) {
    resultDiv.className = '';
    resultDiv.style.cssText = 'background:var(--danger-soft);color:var(--danger);';
    resultDiv.textContent = 'Backend injoignable : ' + err.message;
  }
}

async function addNewEntity() {
  const name = document.getElementById('ne-name').value.trim().toUpperCase();
  const mask = document.getElementById('ne-mask').value.trim();
  const description = document.getElementById('ne-description').value.trim();
  const regex = document.getElementById('ne-regex').value;
  const score = parseFloat(document.getElementById('ne-score').value) || 0.5;
  const validator = document.getElementById('ne-validator').value;
  const context = document.getElementById('ne-context').value
    .split(',').map(s => s.trim()).filter(Boolean);
  const resultDiv = document.getElementById('ne-result');

  if (!/^[A-Z][A-Z0-9_]*$/.test(name) || !mask || !regex) {
    resultDiv.className = '';
    resultDiv.style.cssText = 'background:var(--danger-soft);color:var(--danger);';
    resultDiv.textContent = 'Nom (MAJUSCULES), masque et expression régulière sont obligatoires.';
    return;
  }

  const entity = {
    description: description || name,
    enabled: true,
    mask,
    patterns: [{ name: name + '_1', regex, score }]
  };
  if (validator) entity.validator = validator;
  if (context.length) entity.context = context;

  try {
    const saveRes = await apiFetch(`/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entities: { [name]: entity } })
    });
    const saveData = await saveRes.json();
    if (!saveRes.ok) throw new Error(saveData.message || 'Échec de l\'enregistrement');

    // Rechargement à chaud : le nouveau motif devient actif sans redémarrage
    const reloadRes = await apiFetch(`/reload`, { method: 'POST' });
    const reloadData = await reloadRes.json();
    if (!reloadRes.ok) throw new Error(reloadData.message || 'Échec du rechargement');

    resultDiv.className = '';
    resultDiv.style.cssText = 'background:var(--success-soft);color:var(--success);';
    resultDiv.textContent = `✅ « ${name} » ajouté et actif (français + anglais).`;

    ['ne-name', 'ne-mask', 'ne-description', 'ne-regex', 'ne-context', 'ne-sample']
      .forEach(id => document.getElementById(id).value = '');

    await loadSettings();
  } catch (err) {
    resultDiv.className = '';
    resultDiv.style.cssText = 'background:var(--danger-soft);color:var(--danger);';
    resultDiv.textContent = 'Erreur : ' + err.message;
  }
}

// Import / export Excel des entités et de leurs motifs
async function exportFormulas() {
  try {
    const { filename, content } = await engineJson('/config/export');
    const bytes = Uint8Array.from(atob(content), c => c.charCodeAt(0));
    const url = URL.createObjectURL(new Blob([bytes], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }));
    Object.assign(document.createElement('a'), { href: url, download: filename }).click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (err) {
    notify(t('request_error') + err.message, 'error');
  }
}

const TEAM_STATUS = {
  ok: '✅ Appliquée',
  cache: '⚠️ Fichier inaccessible : dernière copie utilisée',
  error: '❌ Fichier inaccessible, aucune copie disponible',
};

function renderTeam(team) {
  const status = document.getElementById('team-status');
  const input = document.getElementById('team-source');
  if (!team || team.status === 'none') {
    status.textContent = 'Aucune configuration d’équipe : seuls vos réglages locaux s’appliquent.';
  } else {
    const loaded = team.loaded_at ? ` (lue le ${new Date(team.loaded_at).toLocaleString()})` : '';
    const message = team.message ? ` — ${team.message}` : '';
    status.textContent = `${TEAM_STATUS[team.status]} : ${team.entities} entité(s)${loaded}${message}`;
  }
  input.value = team?.source || '';
  // Source imposée par l'administrateur (variable MASQUEIA_TEAM_CONFIG)
  const locked = !!team?.from_env;
  input.disabled = locked;
  document.querySelectorAll('[data-action="setTeamConfig"], [data-action="removeTeamConfig"]')
    .forEach(btn => { btn.disabled = locked; });
  if (locked) status.textContent += ' — définie par votre administrateur.';
}

async function applyTeamSource(source) {
  try {
    await engineJson('/config/team', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source })
    });
    await engineJson('/reload', { method: 'POST' });
    await loadSettings();
    notify(source ? '✅ Configuration d’équipe appliquée.' : 'Configuration d’équipe retirée.', 'success');
  } catch (err) {
    notify('❌ ' + err.message, 'error');
  }
}

function setTeamConfig() {
  const source = document.getElementById('team-source').value.trim();
  if (!source) {
    notify('Indiquez le chemin du fichier d’équipe (.xlsx ou .yaml).', 'error');
    return;
  }
  applyTeamSource(source);
}

async function removeTeamConfig() {
  if (!await askConfirm('Retirer la configuration d’équipe ? Vos réglages locaux s’appliqueront seuls.', 'Retirer')) return;
  applyTeamSource('');
}

function chooseFormulasFile() {
  document.getElementById('formulas-input').click();
}

async function importFormulas(file) {
  if (!await askConfirm(`Importer « ${file.name} » ? Les entités du classeur remplaceront celles du même nom.`, 'Importer')) return;
  try {
    const result = await engineJson('/config/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: await readAsBase64(file) })
    });
    // Rechargement à chaud : les motifs importés deviennent actifs sans redémarrage
    await engineJson('/reload', { method: 'POST' });
    await loadSettings();
    const added = result.added.length ? `\nNouvelles entités : ${result.added.join(', ')}` : '';
    const team = result.overridden_by_team.length
      ? `\nToujours définies par l’équipe : ${result.overridden_by_team.join(', ')}` : '';
    notify(`✅ ${result.imported} entité(s) et ${result.patterns} motif(s) importés et actifs.${added}${team}`, 'success');
  } catch (err) {
    notify('❌ Import impossible : ' + err.message, 'error');
  }
}

document.getElementById('formulas-input').addEventListener('change', (event) => {
  const [file] = event.target.files;
  event.target.value = '';
  if (file) importFormulas(file);
});

function teamBadge(name) {
  return entityMeta[name]?.team ? ' <span title="Géré par la configuration d’équipe">🔒</span>' : '';
}

function toggleEntity(name) {
  if (entityMeta[name]?.team) {
    notify('🔒 Cette donnée est gérée par la configuration d’équipe.', 'error');
    return;
  }
  entitySettings[name] = !entitySettings[name];
  renderSettings();
}

async function saveSettings() {
  const entities = Object.keys(entitySettings).map(name => ({
    name,
    enabled: entitySettings[name]
  }));

  try {
    await apiFetch(`/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entities })
    });
    notify(t('settings_saved'), 'success');
  } catch (err) {
    notify(t('request_error') + err.message, 'error');
  }
}

async function resetSettings() {
  if (!await askConfirm(t('confirm_reset'), 'Rétablir', true)) return;

  // Reset to default settings - French/Polish entities enabled, rest disabled
  entitySettings = {
    // French entities and specific identifiers - enabled by default
    'EMAIL_ADDRESS': true,
    'PL_PESEL': true,
    'PL_NIP': true,
    'PL_PASSPORT': true,
    'PL_ID_CARD': true,
    'PL_REGON': true,
    'PHONE_NUMBER': true,
    'CREDIT_CARD': true,
    'IBAN_CODE': true,
    'IP_ADDRESS': true,
    'URL': true,
    'DATE_TIME': true,
    'PERSON': true,
    'LOCATION': true,

    // US entities - disabled by default
    'US_SSN': false,
    'US_PASSPORT': false,
    'US_BANK_NUMBER': false,
    'US_DRIVER_LICENSE': false,
    'US_ITIN': false,

    // Other countries - disabled by default
    'UK_NHS': false,
    'AU_ABN': false,
    'AU_ACN': false,
    'AU_TFN': false,
    'AU_MEDICARE': false,
    'SG_NRIC_FIN': false,
    'NRP': false,

    // Other types - mixed defaults
    'CRYPTO': false,
    'MEDICAL_LICENSE': false
  };

  renderSettings();
}

// Setup functions
async function checkSetup() {
  try {
    const res = await apiFetch(`/setup/check-system`);
    const data = await res.json();

    let html = '<ul style="list-style:none;padding:0;">';
    Object.values(data.checks).forEach(check => {
      const icon = check.status ? '✅' : '❌';
      html += `
        <li style="padding:12px;margin-bottom:8px;background:var(--surface-2);border-radius:8px;">
          ${icon} <strong>${check.name}:</strong> ${check.message}
        </li>
      `;
    });
    html += '</ul>';

    document.getElementById('setup-checks').innerHTML = html;

    if (data.all_passed) {
      document.getElementById('setup-instructions').classList.remove('hidden');
    }
  } catch (err) {
    document.getElementById('setup-checks').innerHTML = IN_EXTENSION
      ? engineHelp(err.message)
      : `<p>${t('setup_error')}</p>`;
  }
}

// Moteur injoignable : comment le démarrer, une fois ou à chaque session Windows
function engineHelp(reason) {
  const pre = 'style="margin-top:8px;padding:12px;background:#111827;color:#f9fafb;border-radius:8px;overflow-x:auto;"';
  return `
    <p>❌ <strong>Moteur MasqueIA non disponible :</strong> ${escapeHtml(reason)}</p>
    <p style="margin-top:12px;">Depuis le dossier du projet, démarrez-le automatiquement à chaque session Windows (une seule fois) :</p>
    <pre ${pre}>python backend\\install_autostart.py</pre>
    <p style="margin-top:12px;">Ou lancez-le ponctuellement :</p>
    <pre ${pre}>python backend\\app.py</pre>
  `;
}

// Load logs
async function loadLogs() {
  const container = document.getElementById('logs-container');

  try {
    const res = await apiFetch(`/logs?limit=50`);
    const data = await res.json();

    if (data.logs && data.logs.length > 0) {
      let html = '';
      data.logs.forEach(log => {
        const date = new Date(log.timestamp);
        const locale = { fr: 'fr-FR', en: 'en-US', pl: 'pl-PL', de: 'de-DE' }[currentLang];
        const timeStr = date.toLocaleString(locale);

        html += `
          <div class="log-entry">
            <div class="log-header">
              <span class="log-time">${timeStr}</span>
              <span class="log-badge">${log.entities_count} ${log.entities_count === 1 ? t('entity_singular') : t('entity_plural')}</span>
              <span class="log-time-ms">${log.processing_time_ms}ms</span>
            </div>
            <div class="log-content">
              <div class="log-section">
                <div class="log-label">${t('original_text')}</div>
                <div class="log-text original">${escapeHtml(log.original_text)}</div>
              </div>
              <div class="log-arrow">→</div>
              <div class="log-section">
                <div class="log-label">${t('anonymized_text')}</div>
                <div class="log-text anonymized">${escapeHtml(log.anonymized_text)}</div>
              </div>
            </div>
            ${log.entities_found && log.entities_found.length > 0 ? `
              <div class="log-entities">
                ${log.entities_found.map(e => `<span class="entity-tag">${e.type}: <code>${escapeHtml(e.text)}</code></span>`).join(' ')}
              </div>
            ` : ''}
          </div>
        `;
      });

      container.innerHTML = `
        <div style="margin-bottom: 16px; color: var(--text-3); font-size: 14px;">
          ${t('logs_count', { shown: data.logs.length, total: data.total })}
        </div>
        ${html}
      `;
    } else {
      container.innerHTML = `<p style="text-align: center; color: var(--text-3); padding: 40px;">${t('no_logs')}</p>`;
    }
  } catch (err) {
    console.error('Failed to load logs:', err);
    container.innerHTML = `<p style="text-align: center; color: var(--danger); padding: 40px;">${t('logs_error')}</p>`;
  }
}

// Clear logs
async function clearLogs() {
  if (!await askConfirm(t('clear_logs_confirm'), 'Effacer', true)) {
    return;
  }

  try {
    const res = await apiFetch(`/logs/clear`, { method: 'POST' });
    if (res.ok) {
      loadLogs();
    }
  } catch (err) {
    console.error('Failed to clear logs:', err);
    notify(t('clear_logs_error'), 'error');
  }
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Messages et dialogues intégrés à la page : alert(), confirm() et prompt()
// se comportent mal dans le panneau latéral du navigateur
let toastTimer = null;

function notify(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), type === 'error' ? 7000 : 4000);
}

function openDialog(message, { input = false, placeholder = '', okLabel = 'OK', danger = false } = {}) {
  const dialog = document.getElementById('app-dialog');
  const field = document.getElementById('app-dialog-input');
  const ok = document.getElementById('app-dialog-ok');
  document.getElementById('app-dialog-message').textContent = message;
  field.classList.toggle('hidden', !input);
  field.value = '';
  field.placeholder = placeholder;
  ok.textContent = okLabel;
  ok.classList.toggle('danger', danger);
  dialog.returnValue = '';
  dialog.showModal();
  if (input) field.focus();
  return new Promise(resolve => {
    dialog.addEventListener('close', () => {
      if (dialog.returnValue !== 'ok') return resolve(null);
      resolve(input ? field.value.trim() : true);
    }, { once: true });
  });
}

async function askConfirm(message, okLabel = 'Confirmer', danger = false) {
  return (await openDialog(message, { okLabel, danger })) === true;
}

function askText(message, placeholder = '') {
  return openDialog(message, { input: true, placeholder, okLabel: 'Créer' });
}

// Check health
async function checkHealth() {
  let isOnline = false;
  let reason = 'Moteur MasqueIA injoignable (démarré ?)';
  try {
    const res = await apiFetch(`/health`);
    const data = await res.json();
    isOnline = data.status === 'healthy' && data.analyzer_ready !== false;
    if (!isOnline) reason = data.analyzer_error || 'Moteur non prêt';
  } catch (err) {
    reason = err.message || reason;
  }

  document.getElementById('status-value').textContent = isOnline ? t('status_online') : t('status_offline');
  document.getElementById('status-value').className = isOnline ? 'online' : 'offline';

  const badge = document.getElementById('ext-status');
  badge.className = `status-badge ${isOnline ? 'online' : 'offline'}`;
  badge.querySelector('.status-dot').className = `status-dot ${isOnline ? 'online' : 'offline'}`;
  document.getElementById('ext-status-text').textContent = isOnline ? t('status_online') : t('status_offline');
  document.getElementById('ext-offline').classList.toggle('hidden', isOnline);
  document.getElementById('ext-offline-reason').textContent = reason;
}

// ── Onglet Extension (ancienne popup) ────────────────────────────────────────
async function loadExtensionTab() {
  checkHealth();
  loadWorkspaces().then(loadDeanonSessions).catch(() => {});
  if (!IN_EXTENSION) return;
  const { extensionEnabled } = await chrome.storage.local.get('extensionEnabled');
  renderExtensionToggle(extensionEnabled !== false);
}

function renderExtensionToggle(enabled) {
  const toggle = document.getElementById('ext-toggle');
  toggle.classList.toggle('enabled', enabled);
  toggle.setAttribute('aria-checked', String(enabled));
}

async function toggleExtension() {
  const enabled = document.getElementById('ext-toggle').getAttribute('aria-checked') !== 'true';
  renderExtensionToggle(enabled);
  if (!IN_EXTENSION) return;
  await chrome.storage.local.set({ extensionEnabled: enabled });
  chrome.runtime.sendMessage({ action: 'setExtensionState', enabled }).catch(() => {});
}

// "26_10_30_06_59_30" → "30/10/26 06:59:30"
function formatTs(ts) {
  const p = ts.split('_');
  return p.length === 6 ? `${p[2]}/${p[1]}/${p[0]} ${p[3]}:${p[4]}:${p[5]}` : ts;
}

async function loadDeanonSessions() {
  const select = document.getElementById('ext-session');
  const { sessions } = await engineJson('/sessions?limit=20');
  const current = select.value;
  const workspaceOptions = knownWorkspaces
    .map(w => `<option value="${escapeHtml(w.id)}">Espace « ${escapeHtml(w.name)} »</option>`);
  const sessionOptions = sessions.map(s => {
    const types = s.types.slice(0, 3).join(', ') + (s.types.length > 3 ? ', …' : '');
    return `<option value="${escapeHtml(s.ts)}">${formatTs(s.ts)} – ${s.count} entité(s) (${escapeHtml(types)})</option>`;
  });
  select.innerHTML = '<option value="">Détectée automatiquement</option>'
    + workspaceOptions.join('') + sessionOptions.join('');
  select.value = [...select.options].some(o => o.value === current) ? current : '';
}

const TOKEN_TS_RE = /\[[A-Z][A-Z_]*_\d+_(\d{2}(?:_\d{2}){5})\]/g;

async function extDeanonymize() {
  const text = document.getElementById('ext-deanon-input').value.trim();
  if (!text) return notify('Collez d’abord la réponse de l’IA.');

  // Une réponse peut citer plusieurs sessions (collages successifs) : chacune est résolue
  const chosen = document.getElementById('ext-session').value;
  const sessions = chosen ? [chosen] : [...new Set([...text.matchAll(TOKEN_TS_RE)].map(m => m[1]))];
  if (sessions.length === 0) return notify('Aucun jeton MasqueIA dans ce texte.', 'error');

  let result = text;
  let replacements = 0;
  for (const ts of sessions) {
    try {
      const data = await engineJson('/deanonymize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ts, text: result })
      });
      result = data.deanonymized_text;
      replacements += data.replacements;
    } catch { /* session expirée ou inconnue : ses jetons restent tels quels */ }
  }
  if (replacements === 0) return notify('Aucun jeton n’a pu être restauré (session expirée ou inconnue).', 'error');

  document.getElementById('ext-deanon-text').textContent = result;
  document.getElementById('ext-deanon-count').textContent = `${replacements} jeton(s) restauré(s)`;
  document.getElementById('ext-deanon-result').classList.remove('hidden');
}

async function extPaste() {
  try {
    document.getElementById('ext-deanon-input').value = await navigator.clipboard.readText();
  } catch {
    notify('Collez le texte avec Ctrl+V dans la zone.');
    document.getElementById('ext-deanon-input').focus();
  }
}

function extClear() {
  document.getElementById('ext-deanon-input').value = '';
  document.getElementById('ext-deanon-result').classList.add('hidden');
}

async function extCopy() {
  await navigator.clipboard.writeText(document.getElementById('ext-deanon-text').textContent);
  // Le prochain collage dans un site passe tel quel : c'est du texte déjà désanonymisé
  if (IN_EXTENSION) chrome.storage.local.set({ skipNextPaste: true });
  notify('Copié', 'success');
}

function openFullTab() {
  const section = document.querySelector('.section.active')?.id || 'extension';
  chrome.tabs.create({ url: chrome.runtime.getURL(`app.html?section=${section}`) });
}

document.getElementById('ext-language').addEventListener('change', event => switchLanguage(event.target.value));

// Initialize
updateUIText();
initFileDrop();
setInterval(checkHealth, 15000);
// Dans le panneau latéral, le bouton ↗ ouvre la même page en plein écran
document.getElementById('open-full-tab').classList.toggle('hidden', !IN_EXTENSION);

const requestedSection = new URLSearchParams(window.location.search).get('section');
showSection(document.getElementById(requestedSection)?.classList.contains('section') ? requestedSection : 'extension');

function copySessionId() {
  navigator.clipboard.writeText(document.getElementById('session-id-value').textContent);
}

// Inline handlers are forbidden in extension pages (CSP): delegate clicks instead
document.addEventListener('click', (event) => {
  const el = event.target.closest('[data-action]');
  if (!el) return;
  const handler = window[el.dataset.action];
  if (typeof handler === 'function') handler(el.dataset.arg);
});
