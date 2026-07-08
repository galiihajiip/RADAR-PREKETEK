# Feature Scope

## MVP

| Feature | Role | Priority | Acceptance sketch |
|---|---|---:|---|
| Citizen report form | Citizen | P0 | `/report` accepts photo, location, description, consent |
| Offline queue | Citizen | P0 | `/offline` persists last report after reload |
| AI fallback prediction | System | P0 | Flask `/predict` returns 4-class probabilities |
| Operator dashboard | Operator | P0 | `/dashboard` shows severity markers and report cards |
| Validation action | Operator | P0 | `/api/reports/validate` allows operator/admin and rejects citizen |
| Export | Operator | P1 | `/api/export/geojson` and `/api/export/csv` return usable data |

## Enhanced Demo Scope

| Feature | Role | Priority | Acceptance sketch |
|---|---|---:|---|
| Brand system | All | P1 | `/brand` renders badges/cards/states |
| Analytics | Operator | P1 | `/analytics` shows totals and confidence |
| Escalation simulate | Admin | P1 | `/admin` presents critical escalation control |
| Docker mode | DevOps | P2 | compose defines web, AI, optional PostGIS |

## Future Production Scope

| Feature | Role | Priority | Acceptance sketch |
|---|---|---:|---|
| Real Supabase auth/RLS | All | P0 | JWT roles mapped to policies |
| Leaflet live map | Operator | P0 | OSM tiles and clustered markers |
| Trained TorchScript model | System | P0 | MobileNetV3-Small metrics documented |
| Real IndexedDB sync worker | Citizen | P0 | retry/backoff/idempotency tests |
