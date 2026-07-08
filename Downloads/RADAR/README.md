# RADAR

RADAR (Rapid Artificial Intelligence Damage Assessment and Response) is an offline-first disaster damage reporting demo: citizens submit photo and GPS reports, local AI predicts damage severity, and operators validate incidents on a command dashboard.

## Monorepo Map

- `apps/web` - Next.js 14 App Router PWA, demo APIs, dashboards, queue UI.
- `apps/ai-service` - Flask AI service with deterministic local fallback.
- `packages/shared` - shared TypeScript severity, role, report, and API types.
- `database` - PostGIS migrations, RLS notes, demo seed.
- `ml` - dataset folders and placeholder training scripts.
- `docs` - alignment, architecture, demo, deployment, and judge prep.

## Quickstart

```bash
npm install
npm run dev:web
```

In another terminal for AI:

```bash
cd apps/ai-service
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
flask --app app run --port 5001
```

Fast demo mode works without Supabase, PostGIS, or a trained model because `DEMO_MODE=true` and `DEMO_AI_FALLBACK=true`.

Generate a full dummy dataset for database, web, and ML. Details live in `docs/DUMMY_DATA.md`.

```bash
npm run data:generate
npm run ml:train
npm run ml:evaluate
```

## Demo Routes

- `/` landing and role entry.
- `/report` citizen report flow with local queue simulation.
- `/offline` queued report status.
- `/dashboard` operator command dashboard with map-style incident view.
- `/analytics` summary and exports.
- `/admin` audit and escalation controls.
- `/brand` design system preview.

## Docs

Start with `docs/PROJECT_ALIGNMENT.md`, then `docs/LOCAL_RUN.md`, `docs/DEMO_SCRIPT.md`, and `FINAL_CHECKLIST.md`.
