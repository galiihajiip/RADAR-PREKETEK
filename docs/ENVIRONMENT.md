# Environment

| Variable | Demo value | Used by | Production guidance |
|---|---|---|---|
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Web | deployed HTTPS URL |
| `NEXT_PUBLIC_SUPABASE_URL` | empty | Web | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | empty | Web | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | empty | API | server-only secret |
| `DATABASE_URL` | local Postgres | API/db | managed Postgres URL |
| `AI_SERVICE_URL` | `http://localhost:5001` | API | Flask service URL |
| `DEMO_MODE` | `true` | API | false for production |
| `NEXT_PUBLIC_DEMO_MODE` | `true` | Browser | mirrors demo state only |
| `JWT_SECRET` | placeholder | API | strong random secret |
| `STORAGE_BUCKET_REPORTS` | `report-images` | API/storage | bucket name |
| `DEMO_AI_FALLBACK` | `true` | AI | false when model required |
| `MODEL_PATH` | local path | AI | mounted TorchScript file |
| `CORS_ORIGINS` | local web | AI | deployed web domain |
| `POSTGRES_PASSWORD` | `postgres` | Docker db | secret manager value |

`DEMO_MODE` is server-side behavior. `NEXT_PUBLIC_DEMO_MODE` is visible to the browser and only controls UI messaging.
