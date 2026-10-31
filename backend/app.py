#!/usr/bin/env python3
"""
MasqueIA - Backend API Server
Localhost service for real-time text anonymization in browser

Author: Bartosz Gaca
License: MIT
"""

import base64
import hashlib
import json
import os
import sys
import logging
from pathlib import Path
from flask import Flask, jsonify, request
from flask_cors import CORS

# Add backend directory to path for imports
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

# Évite le chargement de torch par Presidio (démarrage nettement plus rapide)
os.environ.setdefault('PRESIDIO_DEVICE', 'cpu')

PORT = int(os.environ.get('PRESIDIO_PORT', '7000'))
# Mode développement : autorise l'interface servie en HTTP par ce serveur et les outils (curl)
DEV_MODE = os.environ.get('MASQUEIA_DEV') == '1'
EXTENSION_DIR = backend_dir.parent / 'chrome-extension'


def _extension_id() -> str:
    """ID de l'extension, dérivé de la clé publique du manifeste (identique dans tous les navigateurs)."""
    manifest = json.loads((EXTENSION_DIR / 'manifest.json').read_text(encoding='utf-8'))
    digest = hashlib.sha256(base64.b64decode(manifest['key'])).hexdigest()[:32]
    return ''.join(chr(ord('a') + int(c, 16)) for c in digest)


EXTENSION_ORIGIN = f'chrome-extension://{_extension_id()}'
LOCAL_HOSTS = {f'localhost:{PORT}', f'127.0.0.1:{PORT}', f'[::1]:{PORT}'}
LOCAL_ORIGINS = {f'http://{host}' for host in LOCAL_HOSTS}

# Configure logging (fichier si lancé sans console, p. ex. par pythonw au démarrage de session).
# À faire avant d'importer les modules : certaines bibliothèques remplacent sys.stderr
# (absent sous pythonw) par un flux cp1252, qui ferait échouer le premier message accentué.
_log_file = None
if sys.stderr is None:
    (backend_dir / 'logs').mkdir(exist_ok=True)
    _log_file = backend_dir / 'logs' / 'backend.log'
    sys.stdout = sys.stderr = open(os.devnull, 'w', encoding='utf-8')
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    filename=_log_file,
    encoding='utf-8',
)
logger = logging.getLogger(__name__)

from api.health import health_bp
from api.anonymize import anonymize_bp
from api.files import files_bp
from api.config import config_bp
from api.patterns import patterns_bp
from api.setup import setup_bp

# Initialize Flask app
# Mode développement seulement : sert l'interface de l'extension (app.html, app.js, api.js) en HTTP.
# Hors de ce mode, le moteur refuse les appels de cette page : elle ne doit s'ouvrir que depuis l'extension.
app = Flask(__name__, static_folder='../chrome-extension' if DEV_MODE else None, static_url_path='')
app.config['JSON_AS_ASCII'] = False  # Support for accented characters (French, Polish, etc.)

CORS(app, resources={r"/api/*": {"origins": [EXTENSION_ORIGIN, *(LOCAL_ORIGINS if DEV_MODE else [])]}})


@app.before_request
def restrict_to_masqueia():
    """
    Le serveur n'écoute que sur la boucle locale ; on refuse en plus :
    - un Host étranger (attaque par DNS rebinding depuis une page web) ;
    - toute origine autre que MasqueIA (sites web, autres extensions), que le
      navigateur ne permet pas de falsifier.
    """
    if request.host not in LOCAL_HOSTS:
        return jsonify({'error': 'Forbidden', 'message': 'Hôte non autorisé'}), 403
    if not request.path.startswith('/api/') or request.path == '/api/health':
        return None
    origin = request.headers.get('Origin')
    if origin == EXTENSION_ORIGIN:
        return None
    # GET de l'extension : Chrome n'y met pas d'Origin (hôte autorisé dans le manifeste).
    # L'en-tête X-MasqueIA déclenche une vérification CORS préalable qu'aucun site n'obtient.
    if origin is None and request.headers.get('X-MasqueIA') == '1':
        return None
    if DEV_MODE and (origin is None or origin in LOCAL_ORIGINS):
        return None
    return jsonify({'error': 'Forbidden', 'message': 'Origine non autorisée'}), 403

# Register blueprints
app.register_blueprint(health_bp, url_prefix='/api')
app.register_blueprint(anonymize_bp, url_prefix='/api')
app.register_blueprint(files_bp, url_prefix='/api')
app.register_blueprint(config_bp, url_prefix='/api')
app.register_blueprint(patterns_bp, url_prefix='/api')
app.register_blueprint(setup_bp, url_prefix='/api/setup')

# Root endpoint - serve main app
@app.route('/')
@app.route('/dashboard')
@app.route('/setup')
def index():
    """Serve main application - single page app"""
    if not DEV_MODE:
        return EXTENSION_ONLY_PAGE, 200, {'Content-Type': 'text/html; charset=utf-8'}
    from flask import send_from_directory
    return send_from_directory('../chrome-extension', 'app.html')


EXTENSION_ONLY_PAGE = """<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><title>MasqueIA</title>
<style>body{font:16px/1.5 system-ui,sans-serif;max-width:560px;margin:15vh auto;padding:0 16px;color:#1f2330}</style>
</head><body>
<h1>Le moteur MasqueIA fonctionne ✅</h1>
<p>Les paramètres et le tableau de bord s'ouvrent depuis l'extension : cliquez sur l'icône
MasqueIA dans la barre d'outils du navigateur, puis sur « Paramètres » ou « Tableau de bord ».</p>
<p>Pour protéger vos données, le moteur ne répond qu'à l'extension : cette adresse ne permet pas de le piloter.</p>
</body></html>"""

# No token endpoint needed - no authentication required

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'error': 'Not found',
        'message': 'The requested endpoint does not exist'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal server error: {error}")
    return jsonify({
        'error': 'Internal server error',
        'message': 'An unexpected error occurred'
    }), 500

def main():
    """Start the Flask server (dual-stack loopback: IPv4 + IPv6)"""
    import threading
    from werkzeug.serving import make_server

    port = PORT

    logger.info("=" * 60)
    logger.info("MasqueIA - Backend Service")
    logger.info("=" * 60)
    logger.info(f"🌐 Backend URL: http://localhost:{port} (IPv4 + IPv6 loopback)")
    if DEV_MODE:
        logger.info(f"🔧 Settings (dev): http://localhost:{port}")
    else:
        logger.info("🔧 Settings and dashboard: open them from the MasqueIA extension icon")
    logger.info("=" * 60)

    s4 = make_server('127.0.0.1', port, app, threaded=True)
    try:
        s6 = make_server('::1', port, app, threaded=True)
    except OSError:
        # Système sans loopback IPv6 : fonctionnement en IPv4 uniquement
        s6 = None
        logger.warning("Loopback IPv6 indisponible ; le backend fonctionne uniquement sur 127.0.0.1")

    if s6 is not None:
        threading.Thread(target=s4.serve_forever, daemon=True).start()
        s6.serve_forever()
    else:
        s4.serve_forever()

if __name__ == '__main__':
    main()
