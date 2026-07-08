from __future__ import annotations

import os


class Config:
    DEMO_AI_FALLBACK = os.getenv("DEMO_AI_FALLBACK", "true").lower() == "true"
    MODEL_PATH = os.getenv("MODEL_PATH", "ml/models/radar_mobilenetv3_small.ts")
    CORS_ORIGINS = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")]
