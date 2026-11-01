"""
Configuration endpoint - manage anonymization settings
"""

from flask import Blueprint, jsonify, request
import base64
import binascii
import logging

from core import config_store
from core.config_excel import ExcelConfigError, from_xlsx, to_xlsx

logger = logging.getLogger(__name__)
config_bp = Blueprint('config', __name__)

@config_bp.route('/config', methods=['GET'])
def get_config():
    """
    Get current configuration

    Response JSON:
        {
            "language": "fr",
            "threshold": 0.35,
            "entities": [{"name": "EMAIL_ADDRESS", "enabled": true}, ...]
        }
    """
    try:
        config, team = config_store.effective_config()

        # Convert entities dict to array format for frontend
        entities_array = []
        for name, settings in config.get('entities', {}).items():
            entities_array.append({
                'name': name,
                'enabled': settings.get('enabled', True),
                'description': settings.get('description', ''),
                'mask': settings.get('mask', f'[{name}]'),
                'team': name in team['entities'],
            })

        response = {
            'language': config.get('language', 'fr'),
            'threshold': config.get('threshold', 0.35),
            'entities': entities_array,
            'team': _team_summary(team),
        }

        return jsonify(response), 200

    except Exception as e:
        logger.error(f"Error loading config: {e}")
        return jsonify({
            'error': 'Failed to load configuration',
            'message': str(e)
        }), 500

@config_bp.route('/config', methods=['POST'])
def update_config():
    """
    Update configuration

    Request JSON:
        {
            "threshold": 0.5,
            "entities": {...}
        }

    Response JSON:
        {
            "status": "success",
            "message": "Configuration updated"
        }
    """
    try:
        # Get new config from request
        new_config = request.get_json()

        if not new_config:
            return jsonify({
                'error': 'Invalid request',
                'message': 'Missing configuration data'
            }), 400

        # Load current config
        current_config = config_store.load_local()
        managed = _managed_by_team(new_config, config_store.load_team())
        if managed:
            return jsonify({'error': 'Managed by team', 'message': managed}), 409

        # Update config (merge)
        if 'threshold' in new_config:
            current_config['threshold'] = new_config['threshold']

        if 'entities' in new_config:
            # Handle array format from frontend: [{name: "EMAIL", enabled: true}, ...]
            if isinstance(new_config['entities'], list):
                for entity_update in new_config['entities']:
                    entity_name = entity_update.get('name')
                    if entity_name and entity_name in current_config['entities']:
                        current_config['entities'][entity_name]['enabled'] = entity_update.get('enabled', True)
            # Handle dict format: {EMAIL_ADDRESS: {...}, ...}
            else:
                invalid = config_store.invalid_entities(new_config['entities'])
                if invalid:
                    return jsonify({'error': invalid[0], 'message': invalid[1]}), 400
                current_config['entities'].update(new_config['entities'])

        config_store.save_local(current_config)

        logger.info("Configuration updated successfully")

        return jsonify({
            'status': 'success',
            'message': 'Configuration updated',
            'config': current_config
        }), 200

    except Exception as e:
        logger.error(f"Error updating config: {e}")
        return jsonify({
            'error': 'Failed to update configuration',
            'message': str(e)
        }), 500


@config_bp.route('/config/export', methods=['GET'])
def export_config():
    """Classeur Excel des entités et de leurs motifs (base64 : l'extension ne relaie que du JSON)."""
    try:
        content = to_xlsx(config_store.effective_config()[0])
    except Exception as e:
        logger.error(f"Error exporting config: {e}", exc_info=True)
        return jsonify({'error': 'Export failed', 'message': str(e)}), 500
    return jsonify({
        'filename': 'masqueia-formules.xlsx',
        'content': base64.b64encode(content).decode(),
    }), 200


@config_bp.route('/config/import', methods=['POST'])
def import_config():
    """
    Importe un classeur exporté puis modifié.

    Les entités du classeur remplacent celles du même nom (motifs compris) ;
    les entités absentes du classeur sont conservées.
    """
    data = request.get_json(silent=True) or {}
    try:
        threshold, entities = from_xlsx(base64.b64decode(data.get('content') or '', validate=True))
    except (binascii.Error, ValueError) as e:
        message = str(e) if isinstance(e, ExcelConfigError) else 'Contenu base64 invalide'
        return jsonify({'error': 'Invalid file', 'message': message}), 400
    if not entities:
        return jsonify({'error': 'Invalid file', 'message': 'Aucune entité dans le classeur'}), 400

    invalid = config_store.invalid_entities(entities)
    if invalid:
        return jsonify({'error': invalid[0], 'message': invalid[1]}), 400

    config = config_store.load_local()
    added = [name for name in entities if name not in config['entities']]
    config['entities'].update(entities)
    if threshold is not None:
        config['threshold'] = threshold
    config_store.save_local(config)

    logger.info("Configuration importée depuis Excel : %d entité(s), %d nouvelle(s)", len(entities), len(added))
    return jsonify({
        'status': 'success',
        'imported': len(entities),
        'added': added,
        'patterns': sum(len(e.get('patterns', [])) for e in entities.values()),
        # Ces entités restent définies par l'équipe tant que la configuration d'équipe est active
        'overridden_by_team': sorted(set(entities) & set(config_store.load_team()['entities'])),
    }), 200


def _team_summary(team: dict) -> dict:
    return {key: team[key] for key in ('source', 'from_env', 'status', 'message', 'loaded_at', 'threshold')} | {
        'entities': len(team['entities']),
    }


def _managed_by_team(new_config: dict, team: dict) -> str | None:
    """Message si la modification change un réglage imposé par l'équipe, sinon None."""
    if 'threshold' in new_config and team['threshold'] is not None:
        return "Seuil géré par la configuration d'équipe"
    team_entities = team['entities']
    entities = new_config.get('entities') or []
    if isinstance(entities, list):
        # Le panneau renvoie toutes les cartes : seul un changement d'état compte
        names = {e.get('name') for e in entities if isinstance(e, dict)
                 and e.get('name') in team_entities
                 and e.get('enabled', True) != team_entities[e['name']].get('enabled', True)}
    else:
        names = set(entities) & set(team_entities)
    if names:
        return f"Entités gérées par la configuration d'équipe : {', '.join(sorted(names))}"
    return None


@config_bp.route('/config/team', methods=['GET'])
def get_team_config():
    """État de la configuration d'équipe (source, lecture, copie hors réseau)."""
    return jsonify(_team_summary(config_store.load_team())), 200


@config_bp.route('/config/team', methods=['POST'])
def set_team_config():
    """
    Choisit le fichier d'équipe (chemin local ou réseau, .xlsx ou .yaml) ; source vide pour le retirer.
    Le fichier est validé avant d'être retenu ; l'appelant recharge ensuite l'analyseur.
    """
    if config_store.team_source()[1]:
        return jsonify({'error': 'Managed by administrator',
                        'message': f"Source imposée par la variable {config_store.TEAM_ENV}"}), 409
    source = str((request.get_json(silent=True) or {}).get('source') or '').strip().strip('"')
    try:
        config_store.set_team_source(source or None)
    except config_store.TeamConfigError as e:
        return jsonify({'error': 'Invalid team config', 'message': str(e)}), 400
    logger.info("Configuration d'équipe %s", f"définie : {source}" if source else "retirée")
    return jsonify(_team_summary(config_store.load_team())), 200
