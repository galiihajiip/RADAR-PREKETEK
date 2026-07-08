# Technical Defense

Model: target production model is MobileNetV3-Small with four classes, augmentation, class weighting, confusion matrix, and TorchScript export. Demo fallback is deterministic and local to preserve data sovereignty.

Offline: reports use `local_id` for idempotency, queue persistence, retry/backoff, and `ai_pending` when Flask is unavailable.

Geospatial: PostGIS stores `geography(Point,4326)` and indexes with GiST for radius and bounding queries.

Security: roles are citizen/operator/admin; production path uses Supabase JWT/RLS, while demo API route guards prove the role matrix.

Sovereignty: the AI endpoint runs locally in `apps/ai-service`; there is no third-party vision API dependency.
