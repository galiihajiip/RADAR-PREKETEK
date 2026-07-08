# Technical Architecture

## Layers

- PWA client: Next.js App Router, Tailwind, manifest, offline queue UI.
- Next.js API: demo-mode report, validation, analytics, and export routes.
- Flask AI service: local `/predict`, `/health`, `/model-info`.
- PostgreSQL + PostGIS: migrations define roles, events, damage reports, review log.
- Supabase Storage/Realtime: production path; demo fallback does not require it.
- Demo fallbacks: local demo data, deterministic AI, CSS map panel, CSV/GeoJSON routes.

```mermaid
flowchart LR
  Citizen[PWA Citizen] --> Web[Next.js Web/API]
  Web --> Queue[Offline Queue]
  Web --> AI[Flask AI Service]
  Web --> DB[(PostgreSQL + PostGIS)]
  DB --> RT[Supabase Realtime]
  RT --> Dash[Operator Dashboard]
  Dash --> Validate[Validation Panel]
  Admin[Admin Console] --> Escalate[Escalation]
```

```mermaid
sequenceDiagram
  participant C as Citizen PWA
  participant Q as Offline Queue
  participant W as Next.js API
  participant A as Flask AI
  participant D as PostGIS
  participant O as Operator Dashboard
  C->>Q: Save draft/report if offline
  Q->>W: Sync when online with local_id
  W->>A: Predict image locally
  A-->>W: severity + confidence
  W->>D: Store report geography(Point,4326)
  D-->>O: Realtime/demo update
  O->>W: Validate or override
  W->>D: Store review action
```

`DEMO_MODE=true` is the default presentation path. Supabase, Flask, trained model, and map tiles each have a local fallback so the demo can continue when external dependencies fail.
