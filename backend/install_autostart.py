#!/usr/bin/env python3
"""
Démarre le moteur MasqueIA automatiquement à l'ouverture de session Windows
(clé Run de l'utilisateur, sans fenêtre ni droits administrateur).
Les journaux vont dans backend/logs/backend.log.

Usage :
    python install_autostart.py              installe le démarrage et lance le moteur
    python install_autostart.py --uninstall  retire le démarrage automatique
"""

import argparse
import os
import socket
import subprocess
import sys
from pathlib import Path

VALUE_NAME = "MasqueIA"
RUN_KEY = r"Software\Microsoft\Windows\CurrentVersion\Run"
APP = Path(__file__).resolve().parent / "app.py"
PORT = int(os.environ.get("PRESIDIO_PORT", "7000"))


def engine_running() -> bool:
    with socket.socket() as sock:
        sock.settimeout(0.5)
        return sock.connect_ex(("127.0.0.1", PORT)) == 0


def install() -> None:
    import winreg
    pythonw = Path(sys.executable).with_name("pythonw.exe")
    if not pythonw.exists():
        sys.exit(f"pythonw.exe introuvable à côté de {sys.executable}")
    with winreg.OpenKey(winreg.HKEY_CURRENT_USER, RUN_KEY, 0, winreg.KEY_SET_VALUE) as key:
        winreg.SetValueEx(key, VALUE_NAME, 0, winreg.REG_SZ, f'"{pythonw}" "{APP}"')
    if engine_running():
        print(f"Un moteur répond déjà sur le port {PORT} : il n'est pas relancé.")
    else:
        subprocess.Popen([str(pythonw), str(APP)], cwd=APP.parent)
    print(f"Le moteur démarrera à chaque ouverture de session ({pythonw.name} {APP.name}).")


def uninstall() -> None:
    import winreg
    try:
        with winreg.OpenKey(winreg.HKEY_CURRENT_USER, RUN_KEY, 0, winreg.KEY_SET_VALUE) as key:
            winreg.DeleteValue(key, VALUE_NAME)
    except FileNotFoundError:
        pass
    print("Démarrage automatique retiré (le moteur en cours tourne jusqu'à la fermeture de session).")


def main() -> None:
    if sys.platform != "win32":
        sys.exit("Démarrage automatique disponible sous Windows uniquement.")
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--uninstall", action="store_true", help="retire le démarrage automatique")
    args = parser.parse_args()
    uninstall() if args.uninstall else install()


if __name__ == "__main__":
    main()
