#!/usr/bin/env python3
"""
Fabrique le paquet à envoyer au Chrome Web Store : dist/masqueia-store-<version>.zip.

Le paquet est la copie de chrome-extension/ sans le champ « key » du manifeste,
que le Store refuse (il attribue son propre ID). Le dossier chrome-extension/
n'est pas modifié : la version chargée en mode développeur garde son ID.

Après le premier envoi, reportez l'ID attribué par le Store dans
STORE_EXTENSION_ID (backend/app.py) pour que le moteur accepte cette version.

Usage : python scripts/build_store_package.py
"""

import json
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXTENSION = ROOT / "chrome-extension"
DIST = ROOT / "dist"
# Fichiers du dépôt inutiles dans l'extension publiée (documentation, générateurs d'icônes)
EXCLUDED = {"README.md"}
EXCLUDED_SUFFIXES = {".py"}


def main() -> None:
    manifest = json.loads((EXTENSION / "manifest.json").read_text(encoding="utf-8"))
    manifest.pop("key", None)
    version = manifest["version"]

    DIST.mkdir(exist_ok=True)
    target = DIST / f"masqueia-store-{version}.zip"
    files = sorted(p for p in EXTENSION.rglob("*")
                   if p.is_file() and p.name not in EXCLUDED and p.suffix not in EXCLUDED_SUFFIXES
                   and p.name != "manifest.json")
    with zipfile.ZipFile(target, "w", zipfile.ZIP_DEFLATED) as archive:
        archive.writestr("manifest.json", json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
        for path in files:
            archive.write(path, path.relative_to(EXTENSION).as_posix())

    print(f"{target.relative_to(ROOT)} : {len(files) + 1} fichiers, version {version}, sans « key ».")


if __name__ == "__main__":
    sys.exit(main())
