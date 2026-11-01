@echo off
chcp 65001 >nul
REM ============================================================
REM  MasqueIA - tout-en-un pour Windows
REM  Au premier lancement : installation automatique.
REM  Aux lancements suivants : le backend démarre directement.
REM  Il suffit de DOUBLE-CLIQUER sur ce fichier.
REM ============================================================
setlocal EnableExtensions
title Presidio Anonymizer
cd /d "%~dp0"

set "PORT=7000"
set "VENV_PY=%~dp0backend\.venv\Scripts\python.exe"
set "MARKER=%~dp0backend\.venv\install-ok-fr-en.txt"

echo ============================================================
echo  MasqueIA
echo ============================================================
echo.

REM ---------- 1. Rechercher Python (lanceur py ou commande python) ----------
set "PY_CMD="
py -3 --version >nul 2>&1 && set "PY_CMD=py -3"
if not defined PY_CMD (
    python --version >nul 2>&1 && set "PY_CMD=python"
)

if defined PY_CMD goto :python_ok

echo [INFO] Python n’est pas installé. Tentative d’installation automatique...
winget --version >nul 2>&1
if %errorlevel% neq 0 goto :python_manual

echo [INFO] Installation de Python avec winget (cela peut prendre quelques minutes)...
winget install -e --id Python.Python.3.12 --scope user --accept-package-agreements --accept-source-agreements
if %errorlevel% neq 0 goto :python_manual

echo.
echo [OK] Python a été installé !
echo [IMPORTANT] Fermez cette fenêtre et double-cliquez ENCORE sur Uruchom-Windows.bat.
echo             Windows doit actualiser sa configuration après l’installation de Python.
echo.
pause
exit /b 0

:python_manual
echo.
echo [ERREUR] L’installation automatique de Python a échoué.
echo.
echo Installez-le manuellement (2 minutes) :
echo   1. La page www.python.org s’ouvrira : cliquez sur le bouton jaune "Download Python"
echo   2. Lancez le fichier téléchargé
echo   3. IMPORTANT : cochez "Add Python to PATH", puis cliquez sur "Install Now"
echo   4. Après l’installation, relancez Uruchom-Windows.bat
echo.
start "" https://www.python.org/downloads/
pause
exit /b 1

:python_ok
echo [OK] Python détecté :
%PY_CMD% --version
echo.

REM ---------- 2. Première installation (une seule fois) ----------
if exist "%MARKER%" goto :run_backend

echo ============================================================
echo  PREMIER LANCEMENT - installation automatique.
echo  Cette étape dure 5 à 10 minutes et nécessite Internet. Ne fermez pas la fenêtre !
echo ============================================================
echo.

if not exist "%VENV_PY%" (
    echo [1/3] Création de l’environnement Python...
    %PY_CMD% -m venv "%~dp0backend\.venv"
    if errorlevel 1 (
        echo [ERREUR] Impossible de créer l’environnement. Réessayez.
        pause
        exit /b 1
    )
)
echo [OK] Environnement prêt
echo.

echo [2/3] Téléchargement des bibliothèques (Presidio, Flask, spaCy)...
"%VENV_PY%" -m pip install --upgrade pip --quiet
"%VENV_PY%" -m pip install -r "%~dp0backend\requirements.txt"
if errorlevel 1 (
    echo [ERREUR] L’installation des bibliothèques a échoué. Vérifiez votre connexion Internet et réessayez.
    pause
    exit /b 1
)
echo [OK] Bibliothèques installées
echo.

echo [3/3] Téléchargement des modèles linguistiques français et anglais (environ 90 Mo chacun)...
"%VENV_PY%" -m spacy download fr_core_news_md
if errorlevel 1 goto model_error
"%VENV_PY%" -m spacy download en_core_web_md
if errorlevel 1 goto model_error
goto model_ok
:model_error
echo [ERREUR] Impossible de télécharger les modèles. Vérifiez votre connexion Internet et réessayez.
pause
exit /b 1
:model_ok
echo [OK] Modèle téléchargé
echo.

echo instalacja-zakonczona> "%MARKER%"
echo ============================================================
echo  INSTALLATION TERMINÉE ! Démarrage du programme...
echo ============================================================
echo.

REM ---------- 3. Démarrage du backend et ouverture du tableau de bord ----------
:run_backend
echo ============================================================
echo  DÉMARRAGE DU BACKEND sur http://localhost:%PORT%
echo  Les réglages sont dans le panneau latéral de l’extension.
echo.
echo  NE FERMEZ PAS CETTE FENÊTRE pendant l’utilisation de l’anonymisation !
echo  (Vous pouvez la réduire.)
echo  Pour arrêter le backend : fermez la fenêtre ou appuyez sur Ctrl+C
echo ============================================================
echo.

cd /d "%~dp0backend"
"%VENV_PY%" app.py

pause
