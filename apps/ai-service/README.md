# RADAR AI Service

Flask service for local damage classification. The competition demo ships with a deterministic fallback that mimics MobileNetV3-Small output without sending images to any third-party API.

```bash
pip install -r requirements.txt
flask --app app run --port 5001
```

Endpoints: `GET /health`, `GET /model-info`, `POST /predict`, `POST /validate-image`.
