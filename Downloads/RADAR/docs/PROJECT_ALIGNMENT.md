# RADAR Project Alignment

RADAR is an offline-first humanitarian web system for post-disaster building damage reporting. Citizens submit photo, GPS, and context from a PWA; a local AI service classifies damage into four classes; operators view geospatial priorities, validate AI predictions, escalate urgent cases, and export open data for response coordination.

## Current Repository

The root now contains a RADAR monorepo plus preserved source material in `UPN, MINTA SANGU KE FINAL PLS_Tahap2_FindIT2026/` with notebooks and test images. The application implementation lives in `apps/`, shared contracts in `packages/`, database SQL in `database/`, ML scaffolding in `ml/`, and presentation/operations evidence in `docs/`.

## Traceability

| Proposal commitment | Feature/module | Build block |
|---|---|---|
| PWA offline-first | `apps/web` manifest, `/report`, `/offline`, queue demo | 02, 09, 10 |
| IndexedDB sync | documented queue contract; demo local queue in `/offline` | 10, 18 |
| MobileNetV3-Small 4-class | `apps/ai-service`, `ml/`, `/model-info` | 06 |
| PostGIS | `database/migrations/0001_extensions.sql`, geography columns | 03 |
| Leaflet dashboard | operator map-equivalent demo in `/dashboard`; Leaflet planned for production | 12 |
| Realtime updates | demo polling/fallback and escalation story | 14 |
| Validation panel | `/dashboard` confirm/override controls, `/api/reports/validate` | 13 |
| Notifications/escalation | `/admin` simulate critical escalation | 14, 16 |
| Data sovereignty | local Flask AI, no third-party vision API | 00, 06 |
| Roles | citizen/operator/admin badges, docs matrix, validate guard | 08 |
| SDG 9/11/13/17 | analytics and presentation flow impact framing | 15, 20 |

## Permission Matrix

| Capability | Citizen | Operator | Admin |
|---|---:|---:|---:|
| Create damage report | Yes | Yes | Yes |
| Use offline queue | Yes | Yes | Yes |
| View command dashboard | No | Yes | Yes |
| Validate or override AI | No | Yes | Yes |
| Export GeoJSON/CSV | No | Yes | Yes |
| Manage demo escalation | No | No | Yes |
| View audit/admin console | No | No | Yes |

## Primary User Flows

1. Citizen opens `/report`, fills report, attaches photo, confirms consent, and submits.
2. If offline, the report is stored locally, shown in `/offline`, and synced later.
3. AI service receives the image and returns severity, confidence, and probabilities.
4. The dashboard displays map markers by severity and confidence.
5. Operator reviews the report, confirms or overrides AI, and validates the record.
6. Admin simulates escalation for critical cases.
7. Operator exports GeoJSON/CSV for coordination.

## Risks

| Risk | Likelihood | Impact | Mitigation | Demo fallback |
|---|---|---:|---|---|
| AI model not trained | High | Medium | deterministic local fallback | `/predict` fallback |
| Internet instability | High | High | offline-first queue | `/offline` flow |
| Geolocation denied | Medium | Medium | manual coordinates/address | prefilled Cianjur data |
| Supabase absent | High | Medium | `DEMO_MODE=true` | in-memory/demo data |
| Flask down | Medium | Medium | create report as `ai_pending` | API still creates report |
| Oversized image | Medium | Medium | 8MB validation | AI returns 400 |
| Map tile failure | Medium | Low | simple fallback map view | CSS map panel |
| Role confusion | Low | Medium | demo credentials and guards | `/admin` role cards |
