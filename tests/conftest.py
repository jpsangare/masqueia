"""Fixtures partagées : accès au backend et à l’application Flask."""

import logging
import shutil
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parent.parent
BACKEND = ROOT / "backend"
sys.path.insert(0, str(BACKEND))

logging.disable(logging.CRITICAL)

METRICS = {}


def pytest_terminal_summary(terminalreporter):
    if METRICS:
        terminalreporter.section("Qualité de détection (corpus tests/data/corpus.json)")
        terminalreporter.write_line(
            f"Précision : {METRICS['precision']:.2f} | Rappel : {METRICS['recall']:.2f} "
            f"| Cas : {METRICS['cases']}"
        )


@pytest.fixture(scope="session")
def app_module():
    """Importe l’application (construit l’analyseur une seule fois)."""
    import app as app_module
    return app_module


@pytest.fixture(scope="session")
def anonymize_module(app_module):
    import api.anonymize as anonymize_module
    return anonymize_module


@pytest.fixture(scope="session")
def client(app_module):
    app_module.app.config["TESTING"] = True
    # Le serveur n'accepte que l'hôte local et l'origine de l'extension
    app_module.app.config["SERVER_NAME"] = f"localhost:{app_module.PORT}"
    test_client = app_module.app.test_client()
    test_client.environ_base["HTTP_ORIGIN"] = app_module.EXTENSION_ORIGIN
    return test_client


@pytest.fixture(scope="session")
def models_ready(anonymize_module):
    """Saute les tests si les modèles spaCy ne sont pas installés."""
    if anonymize_module.analyzer is None:
        pytest.skip(f"Analyseur indisponible : {anonymize_module.analyzer_error}")


@pytest.fixture
def isolated_store(anonymize_module, tmp_path, monkeypatch):
    """Redirige mappings et espaces de travail vers un dossier temporaire."""
    monkeypatch.setattr(anonymize_module, "_DATA_DIR", str(tmp_path))
    monkeypatch.setattr(anonymize_module, "_MAPPINGS_FILE", str(tmp_path / "mappings.json"))
    monkeypatch.setattr(anonymize_module, "_WORKSPACES_FILE", str(tmp_path / "workspaces.json"))
    return tmp_path


@pytest.fixture
def temp_config(tmp_path, monkeypatch):
    """Copie de entities.yaml et dossier de données temporaire :
    la vraie configuration (locale et d’équipe) n’est jamais modifiée."""
    from core import config_store

    copy = tmp_path / "entities.yaml"
    shutil.copy(config_store.CONFIG_PATH, copy)
    monkeypatch.setattr(config_store, "CONFIG_PATH", copy)
    monkeypatch.setattr(config_store, "DATA_DIR", tmp_path / "data")
    monkeypatch.delenv(config_store.TEAM_ENV, raising=False)
    return copy


@pytest.fixture(scope="session")
def entities_config():
    import yaml

    with open(BACKEND / "config" / "entities.yaml", encoding="utf-8") as f:
        return yaml.safe_load(f)
