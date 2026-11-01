"""Tests de l’API HTTP (Flask test client)."""

import re

import pytest
import yaml


def untimestamped(text):
    """Retire le suffixe des jetons ([EMAIL_1_26_10_30_18_38_26] -> [EMAIL])."""
    return re.sub(r"_\d+(?:_\d{2}){6}\]", "]", text)


def test_health_reports_status_and_analyzer_state(client):
    response = client.get("/api/health")
    body = response.get_json()

    assert response.status_code == 200
    assert body["status"] == "healthy"
    assert "analyzer_ready" in body and "analyzer_error" in body


def test_settings_page_is_not_served_outside_dev_mode(client):
    # Ses appels seraient refusés (origine non autorisée) : on renvoie vers l'extension
    page = client.get("/").get_data(as_text=True)

    assert "depuis l'extension" in page
    assert client.get("/app.js").status_code == 404


class TestOriginRestriction:
    """Seule l'extension pilote le moteur (Origin, ou en-tête X-MasqueIA sur ses GET sans Origin)."""

    def get_config(self, client, headers):
        environ = {"HTTP_ORIGIN": None}  # retire l'Origin ajoutée par défaut au client de test
        environ.update({f"HTTP_{k.upper().replace('-', '_')}": v for k, v in headers.items()})
        return client.get("/api/config", environ_overrides=environ).status_code

    def test_extension_get_without_origin_is_accepted_with_header(self, client):
        assert self.get_config(client, {"X-MasqueIA": "1"}) == 200

    def test_request_without_origin_or_header_is_refused(self, client):
        assert self.get_config(client, {}) == 403

    def test_web_page_origin_is_refused_even_with_header(self, client):
        assert self.get_config(client, {"Origin": "https://evil.example", "X-MasqueIA": "1"}) == 403

    def test_store_version_is_accepted_once_its_id_is_set(self, client, app_module, monkeypatch):
        store = "chrome-extension://" + "p" * 32
        assert self.get_config(client, {"Origin": store}) == 403
        monkeypatch.setattr(app_module, "EXTENSION_ORIGINS", app_module.EXTENSION_ORIGINS | {store})
        assert self.get_config(client, {"Origin": store}) == 200

    def test_other_extensions_are_refused(self, client):
        assert self.get_config(client, {"Origin": "chrome-extension://" + "a" * 32}) == 403


def test_unknown_endpoint_returns_json_404(client):
    response = client.get("/api/does-not-exist")

    assert response.status_code == 404
    assert response.get_json()["error"] == "Not found"


def test_anonymize_returns_503_with_reason_when_analyzer_missing(client, anonymize_module, monkeypatch):
    monkeypatch.setattr(anonymize_module, "analyzer", None)
    monkeypatch.setattr(anonymize_module, "analyzer_error", "Modèles SpaCy manquants : fr_core_news_md")

    response = client.post("/api/anonymize", json={"text": "bonjour"})

    assert response.status_code == 503
    assert "fr_core_news_md" in response.get_json()["message"]


@pytest.mark.models
class TestAnonymizeEndpoint:
    @pytest.fixture(autouse=True)
    def _need_models(self, models_ready):
        pass

    def test_missing_text_field(self, client):
        assert client.post("/api/anonymize", json={"foo": "bar"}).status_code == 400

    @pytest.mark.parametrize("text", ["", "   \n"])
    def test_empty_text(self, client, text):
        assert client.post("/api/anonymize", json={"text": text}).status_code == 400

    def test_email_is_masked(self, client):
        body = client.post("/api/anonymize", json={"text": "Écrire à jean.dupont@exemple.fr"}).get_json()

        assert untimestamped(body["anonymized_text"]) == "Écrire à [EMAIL]"
        assert body["stats"]["total_entities"] == 1
        assert body["entities_found"][0]["type"] == "EMAIL_ADDRESS"

    def test_text_without_pii_is_unchanged(self, client):
        text = "Le code source est disponible sur demande."
        body = client.post("/api/anonymize", json={"text": text}).get_json()

        assert body["anonymized_text"] == text
        assert body["entities_found"] == []

    def test_entities_filter(self, client):
        text = "jean@example.com et 192.168.1.10"
        body = client.post("/api/anonymize", json={"text": text, "entities": ["IP_ADDRESS"]}).get_json()

        assert untimestamped(body["anonymized_text"]) == "jean@example.com et [IP]"

    def test_disabled_entity_is_never_used(self, client):
        body = client.post(
            "/api/anonymize", json={"text": "SSN 078-05-1120", "entities": ["US_SSN"]}
        ).get_json()

        assert body["entities_found"] == []

    def test_language_parameter_restricts_analysis(self, client):
        text = "Carte 4111 1111 1111 1111"
        body = client.post("/api/anonymize", json={"text": text, "language": "fr"}).get_json()

        assert untimestamped(body["anonymized_text"]) == "Carte [CARTE]"

    def test_context_word_boosts_score(self, client):
        def plate_score(text):
            body = client.post("/api/anonymize", json={"text": text}).get_json()
            return next(e["score"] for e in body["entities_found"] if e["type"] == "FR_PLATE")

        assert plate_score("immatriculation AB-123-CD") > plate_score("AB-123-CD")

    def test_invalid_checksum_is_filtered_out(self, client):
        # Validation stricte (REGON) ; SIREN, SIRET et NIR restent masqués même invalides
        body = client.post("/api/anonymize", json={"text": "REGON 123456789"}).get_json()

        assert body["entities_found"] == []
        assert body["anonymized_text"] == "REGON 123456789"

    def test_invalid_checksum_is_still_masked_when_not_strict(self, client):
        body = client.post("/api/anonymize", json={"text": "SIREN 123456789"}).get_json()

        assert [e["type"] for e in body["entities_found"]] == ["FR_SIREN"]

    def test_response_keeps_original_text(self, client):
        text = "jean@example.com"
        body = client.post("/api/anonymize", json={"text": text}).get_json()

        assert body["original_text"] == text

    def test_requests_are_logged_and_can_be_cleared(self, client):
        client.post("/api/logs/clear")
        client.post("/api/anonymize", json={"text": "jean@example.com"})

        logs = client.get("/api/logs?limit=5").get_json()
        assert logs["total"] == 1
        assert logs["logs"][0]["entities_count"] == 1

        assert client.post("/api/logs/clear").status_code == 200
        assert client.get("/api/logs").get_json()["total"] == 0


class TestPatternEndpoint:
    """Tests de /api/test-pattern (aucun modèle NLP requis)."""

    def test_matching_pattern(self, client):
        body = client.post("/api/test-pattern", json={
            "regex": r"\b\d{2}[A-Z]{2}\d{5}\b",
            "text": "passeport 12AB34567",
            "score": 0.6
        }).get_json()

        assert body["matches"] == [{"text": "12AB34567", "start": 10, "end": 19, "score": 0.6}]

    def test_invalid_regex_returns_400(self, client):
        response = client.post("/api/test-pattern", json={"regex": "([", "text": "abc"})

        assert response.status_code == 400
        assert response.get_json()["error"] == "Invalid regex"

    def test_missing_fields_return_400(self, client):
        assert client.post("/api/test-pattern", json={"regex": "a"}).status_code == 400

    def test_unknown_validator_returns_400(self, client):
        response = client.post(
            "/api/test-pattern",
            json={"regex": "a", "text": "a", "validator": "inconnu"},
        )

        assert response.status_code == 400
        assert "luhn" in response.get_json()["message"]

    def test_validator_filters_invalid_checksum(self, client):
        body = client.post("/api/test-pattern", json={
            "regex": r"\b\d{9}\b",
            "text": "SIREN 123456789",
            "validator": "luhn"
        }).get_json()

        assert body["matches"] == []

    def test_context_list_is_accepted(self, client):
        # Le renforcement par contexte exige les artefacts NLP du pipeline complet
        # (couvert par test_context_word_boosts_score) ; ici on vérifie l’acceptation.
        response = client.post("/api/test-pattern", json={
            "regex": r"\b[A-Z]{2}-\d{3}-[A-Z]{2}\b",
            "text": "immatriculation AB-123-CD",
            "score": 0.6,
            "context": ["immatriculation"]
        })

        assert response.status_code == 200
        assert response.get_json()["matches"][0]["text"] == "AB-123-CD"


@pytest.mark.models
class TestAddEntityFlow:
    """Ajout d’une entité via /api/config + rechargement à chaud."""

    @pytest.fixture(autouse=True)
    def _need_models(self, models_ready):
        pass

    def test_add_entity_and_reload_makes_it_active(self, client, temp_config):
        payload = {
            "entities": {
                "TEST_DONNEE": {
                    "description": "Entité de test",
                    "enabled": True,
                    "mask": "[TEST]",
                    "patterns": [{"name": "T1", "regex": r"\bZZ-\d{4}\b", "score": 0.9}]
                }
            }
        }

        assert client.post("/api/config", json=payload).status_code == 200
        assert client.post("/api/reload").status_code == 200

        body = client.post("/api/anonymize", json={"text": "code ZZ-1234 ici"}).get_json()
        assert untimestamped(body["anonymized_text"]) == "code [TEST] ici"

    def test_add_entity_with_invalid_name_returns_400(self, client, temp_config):
        payload = {"entities": {"mauvais nom": {"enabled": True, "mask": "[X]"}}}

        assert client.post("/api/config", json=payload).status_code == 400

    def test_add_entity_with_invalid_regex_returns_400(self, client, temp_config):
        payload = {
            "entities": {
                "TEST_CASSE": {
                    "enabled": True,
                    "mask": "[X]",
                    "patterns": [{"name": "T", "regex": "([", "score": 0.5}]
                }
            }
        }

        assert client.post("/api/config", json=payload).status_code == 400

    def test_get_config(self, client, temp_config):
        body = client.get("/api/config").get_json()

        assert body["language"] == "fr"
        names = {e["name"] for e in body["entities"]}
        assert {"EMAIL_ADDRESS", "PERSON"} <= names

    def test_update_threshold_and_entity_without_touching_real_file(self, client, temp_config):
        payload = {"threshold": 0.6, "entities": [{"name": "URL", "enabled": False}]}

        response = client.post("/api/config", json=payload)

        assert response.status_code == 200
        saved = yaml.safe_load(temp_config.read_text(encoding="utf-8"))
        assert saved["threshold"] == 0.6
        assert saved["entities"]["URL"]["enabled"] is False

    def test_update_requires_a_body(self, client, temp_config):
        assert client.post("/api/config", json={}).status_code == 400
