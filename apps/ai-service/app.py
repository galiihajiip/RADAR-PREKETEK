from __future__ import annotations

import hashlib
import time
from typing import Any

from flask import Flask, jsonify, request
from flask_cors import CORS

from config import Config


SEVERITIES = ["no_damage", "minor_damage", "major_damage", "destroyed"]


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, origins=Config.CORS_ORIGINS)

    @app.get("/health")
    def health() -> Any:
        return jsonify(
            {
                "status": "ok",
                "service": "radar-ai-service",
                "model_loaded": False,
                "device": "cpu",
            }
        )

    @app.get("/model-info")
    def model_info() -> Any:
        return jsonify(
            {
                "model": "MobileNetV3-Small",
                "version": "demo-fallback",
                "classes": SEVERITIES,
                "data_sovereignty": "local inference only; no third-party vision APIs",
            }
        )

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
        digest = hashlib.sha256(data).digest()
        idx = digest[0] % len(SEVERITIES)
        base = [0.08, 0.12, 0.18, 0.22]
        base[idx] = 0.62
        total = sum(base)
        probabilities = {severity: round(base[i] / total, 4) for i, severity in enumerate(SEVERITIES)}
        severity = SEVERITIES[idx]
        return jsonify(
            {
                "success": True,
                "data": {
                    "severity": severity,
                    "confidence": probabilities[severity],
                    "probabilities": probabilities,
                    "model_version": "demo-fallback",
                    "inference_ms": round((time.perf_counter() - start) * 1000, 2),
                },
            }
        )

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
