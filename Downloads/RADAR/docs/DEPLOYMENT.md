# Deployment

## Vercel Web

Set project root to `apps/web`, configure workspace install from repo root when possible, and add public env vars. PWA manifest and service worker assets require HTTPS, which Vercel provides.

## Render/Railway/VPS AI

Deploy `apps/ai-service` with `gunicorn -b 0.0.0.0:$PORT -w 2 app:app`. Upload or mount `radar_mobilenetv3_small.ts` and set `MODEL_PATH`. Set `CORS_ORIGINS` to the web domain.

## Supabase

Run migrations in order, create storage bucket `report-images`, apply policies, and seed demo data. Keep service role keys server-only.

## Health Checklist

| Check | How |
|---|---|
| Web loads | open `/` |
| Web API | `curl http://localhost:3000/api/health` |
| AI health | `curl http://localhost:5001/health` |
| Create report | submit `/report` |
| Dashboard | open `/dashboard` |
| Validation | POST `/api/reports/validate` with `x-demo-role: operator` |
| Export | open `/api/export/geojson` |
