"""Configuration d'équipe partagée : fichier commun qui complète et prime sur la configuration locale."""

import yaml

from core import config_store
from core.config_excel import to_xlsx

TEAM_ENTITY = {
    "enabled": True, "mask": "[MATRICULE]", "description": "Matricule interne",
    "context": ["matricule"], "patterns": [{"name": "MAT", "regex": r"\bMAT-\d{5}\b", "score": 0.8}],
}


def write_team_yaml(path, entities=None, threshold=0.5):
    path.write_text(yaml.dump({"threshold": threshold, "entities": entities or {"TEAM_MATRICULE": TEAM_ENTITY}},
                              allow_unicode=True), encoding="utf-8")
    return path


def set_team(client, source):
    return client.post("/api/config/team", json={"source": str(source)})


def test_no_team_config_by_default(client, temp_config):
    body = client.get("/api/config/team").get_json()

    assert body["status"] == "none" and body["source"] is None


def test_team_entities_and_threshold_take_precedence(client, temp_config, tmp_path):
    local_email = yaml.safe_load(temp_config.read_text(encoding="utf-8"))["entities"]["EMAIL_ADDRESS"]
    team_file = write_team_yaml(tmp_path / "equipe.yaml", {
        "TEAM_MATRICULE": TEAM_ENTITY,
        "EMAIL_ADDRESS": {**local_email, "enabled": False},
    })

    response = set_team(client, team_file)

    assert response.status_code == 200
    assert response.get_json()["status"] == "ok" and response.get_json()["entities"] == 2
    config = client.get("/api/config").get_json()
    entities = {e["name"]: e for e in config["entities"]}
    assert config["threshold"] == 0.5
    assert entities["TEAM_MATRICULE"]["team"] is True
    assert entities["EMAIL_ADDRESS"]["enabled"] is False and entities["EMAIL_ADDRESS"]["team"] is True
    assert entities["PERSON"]["team"] is False
    # Le fichier local n'est pas modifié
    assert "TEAM_MATRICULE" not in yaml.safe_load(temp_config.read_text(encoding="utf-8"))["entities"]


def test_excel_team_file_is_accepted(client, temp_config, tmp_path):
    team_file = tmp_path / "equipe.xlsx"
    team_file.write_bytes(to_xlsx({"threshold": 0.4, "entities": {"TEAM_MATRICULE": TEAM_ENTITY}}))

    assert set_team(client, team_file).get_json()["status"] == "ok"
    assert client.get("/api/config").get_json()["threshold"] == 0.4


def test_invalid_team_file_is_rejected_and_not_kept(client, temp_config, tmp_path):
    bad = write_team_yaml(tmp_path / "equipe.yaml", {"BAD": {"patterns": [{"name": "X", "regex": "(", "score": 1}]}})

    response = set_team(client, bad)

    assert response.status_code == 400
    assert "BAD" in response.get_json()["message"]
    assert client.get("/api/config/team").get_json()["status"] == "none"


def test_missing_file_and_unsupported_format_are_rejected(client, temp_config, tmp_path):
    assert set_team(client, tmp_path / "absent.yaml").status_code == 400
    assert set_team(client, tmp_path / "equipe.txt").status_code == 400


def test_offline_share_falls_back_to_last_copy(client, temp_config, tmp_path):
    team_file = write_team_yaml(tmp_path / "equipe.yaml")
    set_team(client, team_file)
    team_file.unlink()  # partage réseau inaccessible

    body = client.get("/api/config/team").get_json()

    assert body["status"] == "cache" and body["entities"] == 1
    entities = {e["name"] for e in client.get("/api/config").get_json()["entities"]}
    assert "TEAM_MATRICULE" in entities


def test_changing_a_team_entity_locally_is_refused(client, temp_config, tmp_path):
    set_team(client, write_team_yaml(tmp_path / "equipe.yaml"))

    toggled = client.post("/api/config", json={"entities": [{"name": "TEAM_MATRICULE", "enabled": False}]})
    unchanged = client.post("/api/config", json={"entities": [{"name": "TEAM_MATRICULE", "enabled": True},
                                                              {"name": "PERSON", "enabled": False}]})
    threshold = client.post("/api/config", json={"threshold": 0.9})

    assert toggled.status_code == 409
    assert unchanged.status_code == 200
    assert threshold.status_code == 409


def test_removing_the_team_config_restores_local(client, temp_config, tmp_path):
    set_team(client, write_team_yaml(tmp_path / "equipe.yaml"))

    assert set_team(client, "").get_json()["status"] == "none"
    entities = {e["name"] for e in client.get("/api/config").get_json()["entities"]}
    assert "TEAM_MATRICULE" not in entities


def test_environment_variable_wins_and_locks_the_choice(client, temp_config, tmp_path, monkeypatch):
    monkeypatch.setenv(config_store.TEAM_ENV, str(write_team_yaml(tmp_path / "it.yaml")))

    body = client.get("/api/config/team").get_json()

    assert body["from_env"] is True and body["status"] == "ok"
    assert set_team(client, "").status_code == 409


def test_team_patterns_are_active_after_reload(client, temp_config, tmp_path, models_ready):
    set_team(client, write_team_yaml(tmp_path / "equipe.yaml"))
    assert client.post("/api/reload").status_code == 200
    try:
        body = client.post("/api/anonymize", json={"text": "Votre matricule MAT-12345 est actif."}).get_json()
        assert "TEAM_MATRICULE" in {e["type"] for e in body["entities_found"]}
    finally:
        set_team(client, "")
        client.post("/api/reload")
