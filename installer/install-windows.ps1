<#
  MasqueIA - installation en un clic pour Windows (sans droits administrateur).

  1. Installe Python 3.12 si besoin (winget, pour l'utilisateur courant).
  2. Prépare l'environnement du moteur (bibliothèques et modèles français / anglais).
  3. Applique la configuration d'équipe si un fichier est indiqué.
  4. Démarre le moteur à chaque ouverture de session, et le lance tout de suite.
  5. Guide le chargement de l'extension dans Chrome, Edge ou Brave.

  Relancer l'installateur est sans risque : les étapes déjà faites sont sautées.

  Usage : Installer-MasqueIA.bat [chemin du fichier d'équipe .xlsx ou .yaml]
#>
param([string]$TeamConfig = "")

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$Backend = Join-Path $Root "backend"
$Extension = Join-Path $Root "chrome-extension"
$VenvPython = Join-Path $Backend ".venv\Scripts\python.exe"
$Port = if ($env:PRESIDIO_PORT) { $env:PRESIDIO_PORT } else { "7000" }

function Step($text) { Write-Host "`n==> $text" -ForegroundColor Cyan }
function Ok($text) { Write-Host "    [OK] $text" -ForegroundColor Green }
function Fail($text) {
    Write-Host "`n[ERREUR] $text" -ForegroundColor Red
    exit 1
}

# Les versions prises en charge par spaCy 3.7 (3.10 à 3.12)
function Find-Python {
    foreach ($version in "3.12", "3.11", "3.10") {
        try {
            $exe = & py "-$version" -c "import sys; print(sys.executable)" 2>$null
            if ($LASTEXITCODE -eq 0 -and $exe) { return $exe.Trim() }
        } catch { }
    }
    foreach ($candidate in @(
        (Join-Path $env:LOCALAPPDATA "Programs\Python\Python312\python.exe"),
        (Join-Path $env:LOCALAPPDATA "Programs\Python\Python311\python.exe"),
        (Join-Path $env:LOCALAPPDATA "Programs\Python\Python310\python.exe"))) {
        if (Test-Path $candidate) { return $candidate }
    }
    return $null
}

function Invoke-Checked($exe, [string[]]$arguments, $message) {
    & $exe @arguments
    if ($LASTEXITCODE -ne 0) { Fail $message }
}

Write-Host "============================================================"
Write-Host " Installation de MasqueIA"
Write-Host " Première installation : 5 à 10 minutes, connexion Internet nécessaire."
Write-Host "============================================================"

# ---------- 1. Python ----------
Step "Python"
if (-not (Test-Path $VenvPython)) {
    $python = Find-Python
    if (-not $python) {
        if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
            Start-Process "https://www.python.org/downloads/release/python-3128/"
            Fail "Python 3.12 est introuvable et winget n'est pas disponible. Installez Python 3.12 (cochez « Add Python to PATH »), puis relancez l'installateur."
        }
        Write-Host "    Installation de Python 3.12..."
        winget install -e --id Python.Python.3.12 --scope user --silent --accept-package-agreements --accept-source-agreements
        $python = Find-Python
        if (-not $python) { Fail "L'installation de Python a échoué. Relancez l'installateur." }
    }
    Ok $python

    # ---------- 2. Environnement du moteur ----------
    Step "Environnement du moteur"
    Invoke-Checked $python @("-m", "venv", (Join-Path $Backend ".venv")) "Impossible de créer l'environnement Python."
} else {
    Ok "environnement existant"
    Step "Environnement du moteur"
}
Invoke-Checked $VenvPython @("-m", "pip", "install", "--quiet", "--upgrade", "pip") "Mise à jour de pip impossible (connexion Internet ?)."
Write-Host "    Bibliothèques (Presidio, spaCy, Flask)..."
Invoke-Checked $VenvPython @("-m", "pip", "install", "--quiet", "-r", (Join-Path $Backend "requirements.txt")) "Installation des bibliothèques impossible (connexion Internet ?)."
Ok "bibliothèques"
foreach ($model in "fr_core_news_md", "en_core_web_md") {
    & $VenvPython -c "import spacy.util, sys; sys.exit(0 if spacy.util.is_package('$model') else 1)"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "    Modèle $model (environ 90 Mo)..."
        Invoke-Checked $VenvPython @("-m", "spacy", "download", $model) "Téléchargement du modèle $model impossible."
    }
    Ok $model
}

# ---------- 3. Configuration d'équipe ----------
if ($TeamConfig) {
    Step "Configuration d'équipe"
    Push-Location $Backend
    try {
        & $VenvPython -c "import sys; from core.config_store import set_team_source; set_team_source(sys.argv[1])" $TeamConfig
        if ($LASTEXITCODE -ne 0) { Fail "Configuration d'équipe refusée : $TeamConfig" }
    } finally { Pop-Location }
    Ok $TeamConfig
}

# ---------- 4. Démarrage automatique ----------
Step "Démarrage du moteur"
Invoke-Checked $VenvPython @((Join-Path $Backend "install_autostart.py")) "Impossible de configurer le démarrage automatique."
$healthUrl = "http://localhost:$Port/api/health"
$ready = $false
for ($i = 0; $i -lt 60 -and -not $ready; $i++) {
    try {
        $health = Invoke-RestMethod -Uri $healthUrl -Headers @{ "X-MasqueIA" = "1" } -TimeoutSec 2
        $ready = [bool]$health.analyzer_ready
    } catch { }
    if (-not $ready) { Start-Sleep -Seconds 2 }
}
if (-not $ready) { Fail "Le moteur ne répond pas sur le port $Port. Consultez backend\logs\backend.log." }
Ok "moteur prêt sur http://localhost:$Port"

# ---------- 5. Extension ----------
Step "Extension du navigateur"
Set-Clipboard -Value $Extension
$browsers = @(
    @{ Name = "Google Chrome"; Url = "chrome://extensions"; Paths = @("$env:ProgramFiles\Google\Chrome\Application\chrome.exe", "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe", "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe") },
    @{ Name = "Microsoft Edge"; Url = "edge://extensions"; Paths = @("${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe", "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe") },
    @{ Name = "Brave"; Url = "brave://extensions"; Paths = @("$env:ProgramFiles\BraveSoftware\Brave-Browser\Application\brave.exe", "$env:LOCALAPPDATA\BraveSoftware\Brave-Browser\Application\brave.exe") }
)
$opened = $null
foreach ($browser in $browsers) {
    $exe = $browser.Paths | Where-Object { $_ -and (Test-Path $_) } | Select-Object -First 1
    if ($exe) {
        Start-Process $exe $browser.Url
        $opened = $browser.Name
        break
    }
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host " Le moteur est installé et démarrera à chaque ouverture de session." -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
if ($opened) { Write-Host " La page des extensions de $opened vient de s'ouvrir. Il reste 3 clics :" }
else { Write-Host " Ouvrez la page des extensions de votre navigateur (chrome://extensions), puis :" }
Write-Host "   1. Activez le « Mode développeur » (en haut à droite)."
Write-Host "   2. Cliquez sur « Charger l'extension non empaquetée »."
Write-Host "   3. Collez le chemin du dossier (déjà copié) et validez :"
Write-Host "      $Extension" -ForegroundColor Yellow
Write-Host ""
Write-Host " Si l'extension est déjà chargée, cliquez simplement sur son bouton ⟳ (Recharger)."
Write-Host ""
