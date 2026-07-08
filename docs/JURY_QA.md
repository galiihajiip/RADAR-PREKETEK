# Jury Q&A Prep — RADAR PREKETEK

Short, honest answers for judging. Expand verbally as needed, but keep the written core concise.

### 1. Why PWA instead of native app?

Disaster response can't wait for an app store install. A browser-based PWA works on any phone instantly,
supports offline queuing, and is far cheaper to distribute during an emergency than a native app.

### 2. How does offline queue work?

When a citizen submits a report without connectivity (or the API call fails), the report is saved to
`localStorage` on the device with a `pending` status. The `/offline` page lets the user retry or manually
sync; once online, queued reports are sent to the API. This MVP intentionally uses `localStorage` for
simplicity — production would upgrade to a Service Worker with IndexedDB and Background Sync for a real
offline-first experience.

### 3. Why use AI fallback in MVP?

Training and deploying a real computer-vision model needs a labeled dataset and infrastructure we couldn't
finish inside the competition timeline. The fallback (`mock-fallback-v1`) is a deterministic function that
still exercises the full pipeline — report → prediction → operator validation — so the workflow, UI, and
data contracts are already correct and ready to plug a real model into.

### 4. How would real MobileNetV3-Small be integrated?

The AI service (Flask, `apps/ai-service`) already exposes `/predict`, `/health`, and `/model-info` with the
same response shape the fallback uses. Swapping in a trained MobileNetV3-Small model means replacing the
fallback function with real inference — no change needed on the Next.js side, since it already calls the
service through a stable contract.

### 5. Why does the geospatial dashboard matter?

Disaster response prioritization is inherently spatial — operators need to see where destroyed buildings
cluster, not just a flat list. A map view lets command centers assign field teams by proximity and severity
density instead of reading through hundreds of individual reports.

### 6. How does operator validation reduce AI risk?

AI severity is a suggestion, not a decision. Every report enters a `pending_validation` state, and only an
operator action (Confirm AI, Override Severity, or Reject) changes its final status. This human-in-the-loop
design prevents a wrong AI prediction from silently driving a resource allocation decision.

### 7. How does export CSV/GeoJSON help response teams?

Command posts and NGOs typically already use spreadsheets or GIS tools (QGIS, ArcGIS). CSV covers
spreadsheet analysis, GeoJSON covers direct GIS import, and JSON covers system-to-system integration. This
makes RADAR data usable outside RADAR itself instead of trapping it in one dashboard.

### 8. What is data sovereignty in RADAR?

The production target runs AI inference locally (not a third-party vision API) and stores report data in a
self-managed PostgreSQL/PostGIS database rather than an external SaaS. For disaster and citizen data, this
matters for both privacy and continuity — the system doesn't depend on a foreign vendor staying available
during a crisis.

### 9. What are the current MVP limitations?

- Offline queue is `localStorage`, not a Service Worker/IndexedDB.
- Photo evidence is a mock/path preview, not a real upload pipeline.
- AI prediction is a deterministic fallback, not a trained model.
- Data lives in an in-memory demo store, not PostgreSQL/PostGIS.
- The crisis map uses Leaflet with public OpenStreetMap tiles and demo data — no clustering or persisted
  spatial layer yet.
- No push notification integration; escalation is shown in-UI only.
- Demo authentication is role-selection only, not production-grade auth.

Full list: `docs/LIMITATIONS.md`.

### 10. What is the roadmap after the competition?

1. Persist data in PostgreSQL/PostGIS and connect the existing migration/seed scripts.
2. Build and evaluate a real MobileNetV3-Small model, replacing the mock fallback transparently.
3. Add a production upload pipeline for photo evidence with validation.
4. Implement a real offline-first client: Service Worker, IndexedDB, Background Sync.
5. Add map clustering and persisted spatial queries.
6. Add real notification/escalation channels (SMS/WhatsApp/email) behind the existing escalation logic.
7. Harden authentication, audit persistence, accessibility, and performance for field use.
