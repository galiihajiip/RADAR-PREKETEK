from __future__ import annotations

import hashlib
import io
import json
import time
from pathlib import Path
from typing import Any

from flask import Flask, jsonify, request
from flask_cors import CORS

from config import Config


SEVERITIES = ["no_damage", "minor_damage", "major_damage", "destroyed"]
PROJECT_ROOT = Path(__file__).resolve().parents[2]
MODEL_META_PATH = PROJECT_ROOT / "ml" / "models" / "model_meta.json"


def load_real_model():
    """Loads the MobileNetV3-Small checkpoint trained by ml/scripts/train.py.

    Returns None (falling back to the deterministic hash predictor) when torch
    isn't installed, no checkpoint has been trained yet, or DEMO_AI_FALLBACK is
    forced on - so the service degrades gracefully instead of crashing.
    """
    if Config.DEMO_AI_FALLBACK:
        return None

    # MODEL_PATH is conventionally relative to the process's cwd (apps/ai-service
    # when run via `flask run` or docker), matching apps/ai-service/.env.example.
    model_path = Path(Config.MODEL_PATH)
    if not model_path.is_absolute():
        model_path = Path.cwd() / model_path
    if not model_path.exists() or not MODEL_META_PATH.exists():
        return None

    try:
        import torch
        from torchvision import models, transforms
    except ImportError:
        return None

    meta = json.loads(MODEL_META_PATH.read_text(encoding="utf-8"))
    classes = meta["classes"]

    checkpoint = torch.load(model_path, map_location="cpu", weights_only=False)
    model = models.mobilenet_v3_small(weights=None)
    in_features = model.classifier[3].in_features
    model.classifier[3] = torch.nn.Linear(in_features, len(classes))
    model.load_state_dict(checkpoint["state_dict"])
    model.eval()

    preprocess = transforms.Compose(
        [
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
        ]
    )

    return {"torch": torch, "model": model, "classes": classes, "preprocess": preprocess, "meta": meta}


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, origins=Config.CORS_ORIGINS)

    runtime = load_real_model()

    @app.get("/health")
    def health() -> Any:
        return jsonify(
            {
                "status": "ok",
                "service": "radar-ai-service",
                "model_loaded": runtime is not None,
                "model_version": runtime["meta"].get("model_version") if runtime else "demo-fallback",
                "device": "cpu",
            }
        )

    @app.get("/model-info")
    def model_info() -> Any:
        if runtime is not None:
            meta = runtime["meta"]
            return jsonify(
                {
                    "model": meta.get("model", "MobileNetV3-Small"),
                    "version": meta.get("model_version"),
                    "status": meta.get("status"),
                    "classes": runtime["classes"],
                    "missing_classes": meta.get("missing_classes", []),
                    "val_accuracy": meta.get("val_accuracy"),
                    "note": meta.get("note"),
                    "data_sovereignty": "local inference only; no third-party vision APIs",
                }
            )
        return jsonify(
            {
                "model": "MobileNetV3-Small",
                "version": "demo-fallback",
                "classes": SEVERITIES,
                "data_sovereignty": "local inference only; no third-party vision APIs",
            }
        )

    def predict_with_hash_fallback(data: bytes) -> dict:
        digest = hashlib.sha256(data).digest()
        idx = digest[0] % len(SEVERITIES)
        base = [0.08, 0.12, 0.18, 0.22]
        base[idx] = 0.62
        total = sum(base)
        probabilities = {severity: round(base[i] / total, 4) for i, severity in enumerate(SEVERITIES)}
        severity = SEVERITIES[idx]
        return {"severity": severity, "confidence": probabilities[severity], "probabilities": probabilities, "model_version": "demo-fallback"}

    def predict_with_real_model(data: bytes) -> dict:
        from PIL import Image

        torch = runtime["torch"]
        image = Image.open(io.BytesIO(data)).convert("RGB")
        tensor = runtime["preprocess"](image).unsqueeze(0)
        with torch.no_grad():
            logits = runtime["model"](tensor)
            probs = torch.softmax(logits, dim=1)[0].tolist()
        classes = runtime["classes"]
        probabilities = {severity: 0.0 for severity in SEVERITIES}
        for cls, prob in zip(classes, probs):
            probabilities[cls] = round(prob, 4)
        severity = max(probabilities, key=probabilities.get)
        return {
            "severity": severity,
            "confidence": probabilities[severity],
            "probabilities": probabilities,
            "model_version": runtime["meta"].get("model_version", "poc"),
        }

    @app.post("/predict")
    def predict() -> Any:
        start = time.perf_counter()
        file = request.files.get("image")
        if file is None:
            return jsonify({"success": False, "error": {"code": "missing_image", "message": "image file is required"}}), 400
        data = file.read()
        if not data:
            return jsonify({"success": False, "error": {"code": "empty_image", "message": "image file is empty"}}), 400
        if len(data) > 8 * 1024 * 1024:
            return jsonify({"success": False, "error": {"code": "image_too_large", "message": "max image size is 8MB"}}), 400

        if runtime is not None:
            try:
                result = predict_with_real_model(data)
            except Exception as exc:  # malformed image, etc: degrade to hash fallback rather than 500
                result = predict_with_hash_fallback(data)
                result["model_version"] = f"demo-fallback (real model errored: {exc})"
        else:
            result = predict_with_hash_fallback(data)

        result["inference_ms"] = round((time.perf_counter() - start) * 1000, 2)
        return jsonify({"success": True, "data": result})

    @app.post("/validate-image")
    def validate_image() -> Any:
        file = request.files.get("image")
        size = len(file.read()) if file else 0
        return jsonify(
            {
                "success": True,
                "data": {
                    "quality_check": {
                        "has_image": file is not None,
                        "size_bytes": size,
                        "acceptable_size": 0 < size <= 8 * 1024 * 1024,
                    }
                },
            }
        )

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
