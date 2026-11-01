@echo off
chcp 65001 >nul
REM ============================================================
REM  MasqueIA - installation en un clic (Windows, sans droits administrateur)
REM  Double-cliquez sur ce fichier. Pour une équipe, indiquez le fichier commun :
REM    Installer-MasqueIA.bat "\serveur\partage\masqueia-equipe.xlsx"
REM ============================================================
title MasqueIA - installation
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0installer\install-windows.ps1" -TeamConfig "%~1"
set "RC=%ERRORLEVEL%"
echo.
pause
exit /b %RC%
