# RADAR — Rapid Artificial Intelligence Damage Assessment and Response

Post-disaster building-damage reporting and response web system: citizens report damage with photo and GPS
evidence, AI gives an initial severity estimate, and operators validate, override, or reject before help is
prioritized.

**Competition context:** PREKETEK team, FIT Competition 2026, Track I — Bencana Alam (Web Development).

## Tech Stack

- Next.js App Router + TypeScript + Tailwind CSS
- Demo API routes (Next.js route handlers) backed by an in-memory data store
- `localStorage`-based offline queue on the citizen side
- Mock/deterministic AI fallback service (Flask) for damage classification
- CSV / GeoJSON / JSON export endpoints
- Leaflet + OpenStreetMap for the crisis map

## How to Run

```bash
npm install
npm run dev:web
```

Optional — run the AI fallback service alongside the web app:

```bash
cd apps/ai-service
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
flask --app app run --port 5001
```

The web app works standalone in demo mode even without the AI service running (it falls back to a deterministic
mock prediction).

Verification:

```bash
npm run lint
npm run typecheck
npm run build:web
npm run test
```

## Demo Accounts

No password/registration is needed. Pick a role from `/login`:

| Role | Email | Landing page |
|---|---|---|
| Warga (citizen) | citizen@radar.demo | `/report` |
| Operator | operator@radar.demo | `/dashboard` |
| Admin | admin@radar.demo | `/dashboard/admin` |

## Main Features

- **Landing (`/`)** — public emergency portal introduction, alert banner, feature overview, report flow.
- **Report flow (`/report`)** — citizen report form with GPS capture, photo input, consent, and online/offline submit.
- **Offline queue (`/offline`)** — local queue with pending/syncing/synced/failed states, retry, sync, delete.
- **Dashboard (`/dashboard`)** — operator command center with escalation banner, metrics, latest reports.
- **Reports & validation (`/dashboard/reports`, `/dashboard/reports/[id]`)** — filterable report list and a
  validation panel (Confirm AI / Override Severity / Reject Report).
- **Crisis map (`/dashboard/map`)** — Leaflet/OpenStreetMap view with severity filters and legend.
- **Analytics & export (`/dashboard/analytics`)** — severity/status distribution and CSV/GeoJSON/JSON export.
- **Admin (`/dashboard/admin`)** — AI service status, data sovereignty notes, settings preview, demo tools.
- **Audit (`/dashboard/audit`)** — traceable log of report and validation actions.

## Demo Limitations

This is an MVP built to prove the end-to-end flow, not a production disaster-response system:

- Offline queue uses `localStorage`; there is no Service Worker, IndexedDB, or background sync.
- Photo evidence uses a mock/path preview; there is no production binary upload pipeline.
- AI predictions use a deterministic mock fallback (`mock-fallback-v1`); there is no trained MobileNetV3-Small
  model running in this demo.
- Data lives in an in-memory demo store; there is no Supabase/PostgreSQL/PostGIS runtime connected.
- The crisis map uses Leaflet with public OpenStreetMap tiles and in-memory data — no clustering or persisted
  GIS layer yet.
- There is no push notification integration.

See `docs/LIMITATIONS.md` for the full list and production roadmap.

## 5-Minute Demo Flow

1. `/` — introduce RADAR and its role in disaster response.
2. `/report` — submit a citizen report (online), show the success screen with report ID.
3. `/offline` — show the offline queue concept (retry/sync/delete).
4. `/dashboard` — operator command center overview.
5. `/dashboard/reports` → `/dashboard/reports/[id]` — open a report, run Confirm AI / Override / Reject.
6. `/dashboard/map` — show severity distribution on the crisis map.
7. `/dashboard/analytics` — export CSV / GeoJSON / JSON.
8. `/dashboard/admin` and `/dashboard/audit` — data sovereignty, AI status, audit trail.
9. Close by naming the demo limitations honestly and the production roadmap.

Full script: `docs/DEMO_SCRIPT.md`. Judge Q&A prep: `docs/JURY_QA.md`.

## Monorepo Map

- `apps/web` — Next.js app (pages, demo API routes, dashboards, queue UI).
- `apps/ai-service` — Flask AI service with deterministic fallback.
- `packages/shared` — shared TypeScript types (severity, role, report, API response shapes).
- `database` — PostGIS migration and seed reference (not connected in demo mode).
- `ml` — dataset folders and training script placeholders.
- `docs` — design, architecture, demo, limitations, and judge Q&A docs.
