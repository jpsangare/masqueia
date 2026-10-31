#!/bin/bash
# MasqueIA - macOS Installer
# Installation automatique du backend pour macOS

set -e  # Exit on error

echo "========================================"
echo "MasqueIA"
echo "Installation du backend pour macOS"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python 3 n’est pas installé !"
    echo ""
    echo "Installez Python 3 avec Homebrew :"
    echo "  brew install python3"
    echo ""
    echo "Ou téléchargez-le depuis : https://www.python.org/downloads/"
    exit 1
fi

echo "[OK] Python 3 est installé"
python3 --version
echo ""

# Navigate to backend directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/backend"

echo "[1/5] Création de l’environnement virtuel..."
python3 -m venv .venv
echo "[OK] Environnement virtuel créé"
echo ""

echo "[2/5] Aktywowanie venv..."
source .venv/bin/activate
echo "[OK] Environnement virtuel activé"
echo ""

echo "[3/5] Installation des dépendances..."
pip install --upgrade pip
pip install -r requirements.txt
echo "[OK] Dépendances installées"
echo ""

echo "[4/5] Téléchargement des modèles SpaCy (fr_core_news_md, en_core_web_md)..."
python -m spacy download fr_core_news_md
python -m spacy download en_core_web_md
echo "[OK] Modèle SpaCy téléchargé"
echo ""

echo "[5/5] Démarrage du backend..."
echo ""
echo "========================================"
echo "BACKEND DÉMARRÉ !"
echo "========================================"
echo ""
echo "Backend URL: http://localhost:7000"
echo "Dashboard:   http://localhost:7000/dashboard"
echo "Paramètres : http://localhost:7000/"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter le backend"
echo "========================================"
echo ""

python app.py
