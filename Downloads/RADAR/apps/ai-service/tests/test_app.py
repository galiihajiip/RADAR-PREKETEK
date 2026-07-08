from __future__ import annotations

import io

from app import create_app


def client():
    app = create_app()
    app.testing = True
    return app.test_client()


def test_health():
    res = client().get("/health")
    assert res.status_code == 200
    assert res.json["status"] == "ok"


def test_predict_fallback_deterministic():
    data = {"image": (io.BytesIO(b"fake-png-bytes"), "demo.png")}
    first = client().post("/predict", data=data, content_type="multipart/form-data")
    second = client().post("/predict", data={"image": (io.BytesIO(b"fake-png-bytes"), "demo.png")}, content_type="multipart/form-data")
    assert first.status_code == 200
    assert first.json["data"]["severity"] == second.json["data"]["severity"]
    assert round(sum(first.json["data"]["probabilities"].values()), 1) == 1.0


def test_predict_empty_rejected():
    res = client().post("/predict", data={"image": (io.BytesIO(b""), "empty.png")}, content_type="multipart/form-data")
    assert res.status_code == 400
