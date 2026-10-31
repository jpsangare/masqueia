<p align="center">
  <img src="assets/logo-banner.svg" alt="MasqueIA" width="600"/>
</p>

<h1 align="center">🔐 MasqueIA</h1>

<p align="center">
  <strong>Chrome Extension + Local Backend - Auto-anonymize PII when pasting text!</strong>
</p>

<p align="center">
  Automatically anonymize personal data when pasting into ChatGPT, Claude, Perplexity, Gmail, and any website.<br/>
  Powered by Microsoft Presidio. Works 100% locally - no data leaves your computer.
</p>

<p align="center">
  <a href="https://github.com/jpsangare/masqueia/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
  <a href="https://www.python.org/"><img src="https://img.shields.io/badge/python-3.8+-blue.svg" alt="Python"></a>
  <img src="https://img.shields.io/badge/chrome-extension-brightgreen.svg" alt="Chrome Extension">
  <img src="https://img.shields.io/badge/version-1.4.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/manifest-v3-brightgreen.svg" alt="Manifest V3">
</p>

<p align="center">
  <a href="Guide%20pour%20tous.md">🇫🇷 Guide en français pour tous</a> •
  <a href="#-features">Features</a> •
  <a href="#-quick-installation">Installation</a> •
  <a href="#-how-it-works">How It Works</a> •
  <a href="#-documentation">Documentation</a>
</p>

---

## ✨ Features

### 🆕 New in v1.4.0:
- 🪟 **Windows one-click** - `Uruchom-Windows.bat`: installs everything (incl. Python) and starts the backend with a double-click; `Autostart-Windows.bat` for start-at-login. Guide for non-technical users: [WINDOWS.md](WINDOWS.md)
- 🔌 **New default port 7000** - unified across backend, extension and docs (configurable via `PRESIDIO_PORT`)
- 🐛 **Send-button fix** - fixed an infinite anonymize/click loop when intercepting send buttons
- 🔒 **No PII in console** - extension logs no longer print clipboard/text fragments

### v1.3.x:
- 🔘 **Toggle ON/OFF** - Enable/disable auto-anonymization with one click in extension popup
- 📊 **Dashboard Logs** - View history: original → anonymized text with timestamps
- 🚀 **Chrome Web Store Ready** - Manifest V3 compliant, ready for publication

### Core Features:
- ⚡ **Auto-Paste Anonymization** - Automatically anonymizes when you paste (Ctrl+V) anywhere!
- 🎯 **Works on AI Sites** - ChatGPT, Claude, Perplexity, Gemini - 100% reliable PASTE method
- ✅ **Zero configuration** - One-click installation scripts for Windows/Mac/Linux
- 🔒 **100% offline** - Everything runs locally, no data leaves your machine
- 🏆 **Microsoft Presidio** - Professional PII detection engine
- 📋 **28 entity types** - PESEL, NIP, REGON, emails, phones, credit cards, passports, IDs
- 🇫🇷 **French & English optimized** - Native support for French and English PII, plus Polish identifiers (PESEL, NIP, REGON)
- 🇫🇷 **French by default** - French and English interface, selectable from the extension popup
- 🌐 **Works everywhere** - ChatGPT, Claude, Gmail, forms, content-editable fields
- 📊 **Web Dashboard** - Real-time monitoring, testing, and logs

---

## 🚀 Quick Installation

> **🇫🇷 GUIDE SIMPLE EN FRANÇAIS :** [Guide pour tous.md](Guide%20pour%20tous.md) - Instructions pas à pas pour tous !
>
> **📖 Full Documentation:** [INSTALLATION.md](INSTALLATION.md) - Complete step-by-step guide with troubleshooting

### Option 1: Automatic Installation (Recommended)

#### Windows (no technical knowledge needed!)

> 🪟 **Vous n’êtes pas à l’aise avec l’informatique ? Consultez [WINDOWS.md](WINDOWS.md)** — installation en 3 étapes, sans Git ni terminal.

1. **Download ZIP:** green `Code` button → `Download ZIP` → extract
2. **Double-click `Uruchom-Windows.bat`** — first run installs everything (auto-installs Python if missing), then starts the backend and opens the dashboard
3. Optional: double-click `Autostart-Windows.bat` to start the backend automatically at login

Or via git:
```cmd
git clone https://github.com/jpsangare/masqueia
cd masqueia
Uruchom-Windows.bat
```

#### macOS
```bash
git clone https://github.com/jpsangare/masqueia
cd masqueia
chmod +x install-mac.sh
./install-mac.sh
```

#### Linux
```bash
git clone https://github.com/jpsangare/masqueia
cd masqueia
chmod +x install-linux.sh
./install-linux.sh
```

### Option 2: Install Chrome Extension

1. Open Chrome: `chrome://extensions/`
2. Enable "Developer mode" (top-right toggle)
3. Click "Load unpacked" → select `chrome-extension/` folder
4. Done! Extension is now installed

### Option 3: Start Backend Manually

```bash
cd backend
source .venv/bin/activate  # Windows: .venv\Scripts\activate
python app.py
```

Backend runs at: **http://localhost:7000**

---

## 🎯 How It Works

### 🌟 PASTE Method (Best!)

1. **Copy text with PII:**
   ```
   Jan Kowalski, email: jan@example.com, PESEL: 92010212345
   ```

2. **Paste anywhere (Ctrl+V):**
   - ChatGPT prompt
   - Claude conversation
   - Perplexity query
   - Gmail compose
   - Any form field

3. **Text automatically anonymized:**
   ```
   [PERSONNE], email: [EMAIL], PESEL: [PESEL]
   ```

### Alternative Methods

**Keyboard Shortcut:** Select text → Press `Ctrl+Shift+A` (Mac: `Cmd+Shift+A`)

**Context Menu:** Select text → Right-click → « Anonymiser le texte sélectionné »

**Extension Toggle:** Click extension icon → Toggle ON/OFF

---

## 📊 Web Dashboard

Open in browser: **http://localhost:7000/dashboard**

<p align="center">
  <img src="https://via.placeholder.com/800x400/2c3e50/ecf0f1?text=Dashboard+Screenshot" alt="Dashboard"/>
</p>

Dashboard features:
- ✅ **Service status** - Backend online/offline indicator
- 📊 **Statistics** - Requests, detected entities, processing time
- 🧪 **Live testing** - Test anonymization without extension
- 📋 **Activity logs** - See original → anonymized history (last 100 entries)
- 🔑 **Entity management** - Enable/disable specific PII types

---

## 🔒 Detected Data Types

### 🇵🇱 Polish Identifiers (Default: Enabled):

| Type | Example | Mask | Confidence |
|------|---------|------|------------|
| **EMAIL** | jan@example.com | `[EMAIL]` | 100% |
| **PL_PESEL** | 92010212345 | `[PESEL]` | 95-100% |
| **PL_NIP** | 123-456-78-90 | `[NIP]` | 90-100% |
| **PL_REGON** | 123456789 | `[REGON]` | 85-95% |
| **PL_PASSPORT** | AB1234567 | `[PASSEPORT_PL]` | 90-100% |
| **PL_ID_CARD** | ABC123456 | `[CARTE_IDENTITE_PL]` | 90-100% |
| **PHONE_NUMBER** | +48 123 456 789 | `[TELEPHONE]` | 85-100% |
| **CREDIT_CARD** | 4532-1234-5678-9010 | `[CARTE]` | 95-100% |
| **IBAN_CODE** | PL61109010140000071219812874 | `[IBAN]` | 100% |
| **IP_ADDRESS** | 192.168.1.1 | `[IP]` | 100% |
| **URL** | https://example.com | `[URL]` | 90-100% |
| **DATE_TIME** | 2024-12-10 | `[DATE]` | 80-95% |
| **LOCATION** | Warsaw | `[LIEU]` | 70-90% |

### 🌍 International Data (Default: Disabled):

| Type | Example | Mask | Country |
|------|---------|------|---------|
| **US_SSN** | 123-45-6789 | `[SSN]` | 🇺🇸 USA |
| **US_PASSPORT** | 123456789 | `[PASSEPORT_US]` | 🇺🇸 USA |
| **US_BANK_NUMBER** | 123456789 | `[BANK_US]` | 🇺🇸 USA |
| **US_DRIVER_LICENSE** | D1234567 | `[PERMIS_CONDUIRE_US]` | 🇺🇸 USA |
| **UK_NHS** | 123 456 7890 | `[NHS]` | 🇬🇧 UK |
| **AU_ABN** | 12 345 678 901 | `[ABN]` | 🇦🇺 Australia |
| **SG_NRIC_FIN** | S1234567D | `[NRIC_SG]` | 🇸🇬 Singapore |

### 🔐 Other Data:

| Type | Example | Mask | Default |
|------|---------|------|---------|
| **PERSON** | Jan Kowalski | `[PERSONNE]` | ❌ OFF |
| **CRYPTO** | 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa | `[CRYPTO]` | ❌ OFF |
| **MEDICAL_LICENSE** | MD123456 | `[LICENCE_MEDICALE]` | ❌ OFF |

**Total: 28 PII entity types!**

Configure in Dashboard: http://localhost:7000/dashboard → Paramètres

---

## 🧪 Testing

### Test on ChatGPT:

1. Open https://chatgpt.com
2. Copy test text:
   ```
   Jan Kowalski, PESEL: 92010212345, email: jan@example.com, tel: +48 123 456 789
   ```
3. **Paste (Ctrl+V)** into ChatGPT
4. ✅ **See result:** `[PERSONNE], PESEL: [PESEL], email: [EMAIL], tel: [TELEPHONE]`

### Test on Dashboard:

1. Open http://localhost:7000/dashboard
2. Navigate to "Test" section
3. Paste test text and click "Anonymize"
4. See results with entity detection details

### Check Logs:

1. Open http://localhost:7000/dashboard
2. Click « Journaux » in navigation
3. See history: original → anonymized (last 100 entries)

### Automated tests (pytest):

Double-click `Lancer-Tests.bat` (Windows) or run `./lancer-tests.sh` (Mac/Linux). Extra arguments go to pytest (e.g. `Lancer-Tests.bat -k api -x`). The script uses `backend\.venv` if present and installs missing dependencies automatically.

- Tests live in [`tests/`](tests/): config, regex patterns, anonymizer, result merging, HTTP API and a detection corpus (`tests/data/corpus.json`) that reports precision and recall.
- Tests that need the spaCy models (`fr_core_news_md`, `en_core_web_md`) are skipped with a clear reason if they are not installed.
- Cases tagged `known_issue` in the corpus track known false positives/negatives without failing the run.

**More testing guides:** [TESTING.md](TESTING.md)

---

## 📚 Documentation

### User Guides:
- 📖 **[README-USER.md](README-USER.md)** - Quick start guide for users (ce qui a été fait)
- 🤖 **[AI-SITES-GUIDE.md](AI-SITES-GUIDE.md)** - Complete guide for ChatGPT, Claude, Perplexity
- 🧪 **[TESTING.md](TESTING.md)** - Comprehensive testing and debugging instructions
- 💾 **[INSTALLATION.md](INSTALLATION.md)** - Detailed installation guide with troubleshooting

### Developer / Publishing:
- 🏪 **[CHROME-WEB-STORE.md](CHROME-WEB-STORE.md)** - Step-by-step Chrome Web Store publication guide
- 🔒 **[PRIVACY_POLICY.md](PRIVACY_POLICY.md)** - Full privacy policy (GDPR/CCPA/LGPD compliant)
- 📊 **[SPRINT-REVIEW.md](SPRINT-REVIEW.md)** - Complete sprint review and feature list

### Test Page:
- 🧪 **[test-extension.html](test-extension.html)** - Local test page for extension functionality

---

## 🏪 Chrome Web Store

### Status: Ready for Publication! ✅

The extension is fully compliant with Chrome Web Store requirements:
- ✅ Manifest V3
- ✅ All icons (16, 32, 48, 128px)
- ✅ Privacy Policy published
- ✅ Specific host permissions (no wildcards)
- ✅ Description within 132 character limit

**Latest Release:** `presidio-extension-v1.3.2.zip` (30KB)

**Publication Guide:** See [CHROME-WEB-STORE.md](CHROME-WEB-STORE.md) for step-by-step instructions.

---

## 🐛 Troubleshooting

### Extension shows "Offline" or "Disconnected"

**Problem:** Backend not running.

**Solution:**
```bash
# Start backend
cd backend
source .venv/bin/activate
python app.py
```

Then reload extension:
1. Open `chrome://extensions/`
2. Find "MasqueIA"
3. Click 🔄 **Reload** button

### Text not anonymizing on paste

**Check:**
1. ✅ Extension toggle is ON (click extension icon)
2. ✅ Backend is running (dashboard shows "online")
3. ✅ Using PASTE method (Ctrl+V) - most reliable!
4. ✅ Extension is reloaded after any changes

**Debug:**
- Open DevTools (F12) → Console
- Look for `[Presidio]` logs
- Check backend terminal for API requests

### Where to check logs?

**Content Script Logs (webpage):**
- F12 → Console
- Look for: `[Presidio] Paste event detected`

**Background Service Worker:**
- `chrome://extensions/` → Find extension → "service worker"
- Look for: `[Presidio Background] Anonymization successful`

**Backend Logs:**
- Terminal where backend runs
- Look for: `POST /api/anonymize` with status 200

---

## 📦 Project Structure

```
masqueia/
├── backend/                    # Flask API (localhost:7000)
│   ├── app.py                 # Main server
│   ├── api/                   # REST endpoints
│   │   ├── anonymize.py       # Anonymization + logs API
│   │   ├── health.py          # Health check
│   │   └── entities.py        # Entity management
│   ├── core/                  # Presidio integration
│   │   ├── analyzer.py        # PII detection
│   │   └── anonymizer.py      # PII anonymization
│   └── config/                # Configuration
│
├── chrome-extension/          # Browser Extension (Manifest V3)
│   ├── manifest.json          # Extension config
│   ├── background.js          # Service worker
│   ├── content-script.js      # Content injection
│   ├── popup.html/js          # Extension popup (toggle)
│   ├── options.html/js        # Settings page
│   └── icons/                 # Extension icons (16,32,48,128)
│
├── web-ui/                    # Web Dashboard
│   ├── app.html               # Dashboard UI (logs, stats, test)
│   └── favicon.svg
│
├── assets/                    # Branding
│   ├── logo.svg
│   ├── logo-banner.svg
│   └── icon.svg
│
└── docs/                      # Documentation
    ├── README-USER.md
    ├── AI-SITES-GUIDE.md
    ├── TESTING.md
    ├── INSTALLATION.md
    ├── CHROME-WEB-STORE.md
    ├── PRIVACY_POLICY.md
    └── SPRINT-REVIEW.md
```

---

## 🛠️ Tech Stack

**Backend:**
- Flask 3.0 - Lightweight web framework
- Microsoft Presidio 2.2.354 - PII detection engine
- SpaCy 3.7.2 - NLP for French and English language
- Python 3.8+ - Modern Python

**Extension:**
- Manifest V3 - Latest Chrome extension standard
- Vanilla JavaScript - No framework bloat
- Auto-connect to localhost - Zero configuration

**Dashboard:**
- HTML/CSS/JavaScript - Simple, fast, responsive
- Real-time updates - Live monitoring
- No external dependencies - 100% self-contained

---

## 🔧 Requirements

- **Python 3.8+** (3.11 recommended)
- **Chrome/Edge browser** (Manifest V3 support)
- **Operating System:** macOS, Linux, or Windows
- **Disk space:** ~500 MB (for SpaCy model)
- **RAM:** Minimum 2GB, recommended 4GB+

---

## ⚡ Performance

- **Detection:** ~50-100ms per request
- **Anonymization:** ~100-500ms (first call), ~50-100ms (cached)
- **Paste interception:** Instant (< 10ms)
- **Memory:** ~200MB (backend with SpaCy model)

---

## 💡 FAQ

### Q: Do I need to configure anything?
**A:** NO! Extension automatically connects to backend. Just install and use.

### Q: Extension shows "Offline"?
**A:** Backend not running. Start: `cd backend && source .venv/bin/activate && python app.py`

### Q: Text doesn't anonymize?
**A:** Check:
1. Extension toggle is ON (click icon)
2. Backend running (dashboard: http://localhost:7000/dashboard)
3. Using PASTE method (Ctrl+V) - most reliable!

### Q: Does it work on ChatGPT/Claude/Perplexity?
**A:** YES! Use PASTE method (Ctrl+V) - 100% reliable. See [AI-SITES-GUIDE.md](AI-SITES-GUIDE.md)

### Q: Where can I see what's happening?
**A:** Open dashboard: http://localhost:7000/dashboard
- Real-time statistics
- Activity logs (last 100 operations)
- Test anonymization
- Service status

### Q: How do I enable/disable anonymization temporarily?
**A:** Click extension icon → Toggle ON/OFF. State persists across tabs.

### Q: Can I publish this on Chrome Web Store myself?
**A:** YES! All files ready. See [CHROME-WEB-STORE.md](CHROME-WEB-STORE.md) for instructions.

### Q: Must I keep terminal open?
**A:** Yes, backend must run. You can minimize terminal or create a system service/alias.

**Create alias in `.bashrc` or `.zshrc`:**
```bash
alias presidio='cd /path/to/masqueia/backend && source .venv/bin/activate && python app.py'
```

Then just: `presidio` 🚀

---

## 🤝 Contributing

Contributions welcome! Please follow these steps:

1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m "feat: add amazing feature"`
4. Push branch: `git push origin feature/amazing-feature`
5. Open Pull Request

**Code style:**
- Python: PEP 8
- JavaScript: ESLint recommended
- Commit messages: Conventional Commits

---

## 📄 License

MIT License - see [LICENSE](LICENSE)

You are free to use, modify, and distribute this software.

---

## 🙏 Credits

- **[Microsoft Presidio](https://github.com/microsoft/presidio)** - PII detection and anonymization engine
- **[SpaCy](https://spacy.io/)** - Industrial-strength NLP for French and English language support
- **[Flask](https://flask.palletsprojects.com/)** - Lightweight web framework
- **[Claude Code](https://claude.com/claude-code)** - AI-powered development assistant

---

## ⚠️ Disclaimer

This tool helps protect personal data, but:
- ❌ Does NOT guarantee 100% detection of all PII
- ❌ May produce false positives/negatives
- ❌ Should not be solely relied upon for GDPR compliance

**Always review anonymized text before sending to third parties.**

For sensitive data, consider additional security measures.

---

## 📮 Support & Community

**Need help?**
- 📖 [Documentation](INSTALLATION.md) - Start here
- 🐛 [GitHub Issues](https://github.com/jpsangare/masqueia/issues) - Report bugs
- 💬 [GitHub Discussions](https://github.com/jpsangare/masqueia/discussions) - Ask questions
- 📊 [Dashboard](http://localhost:7000/dashboard) - Service status and logs

**Star this repo** if you find it useful! ⭐

---

<p align="center">
  <strong>Made with ❤️ using Claude Code</strong><br/>
  <sub>Version 1.4.0 | Last Updated: July 2026</sub>
</p>

<p align="center">
  <a href="#-quick-installation">Get Started</a> •
  <a href="INSTALLATION.md">Installation Guide</a> •
  <a href="AI-SITES-GUIDE.md">AI Sites Guide</a> •
  <a href="CHROME-WEB-STORE.md">Chrome Web Store</a>
</p>
