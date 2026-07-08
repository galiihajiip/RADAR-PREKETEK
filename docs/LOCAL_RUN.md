# Local Run

## Mode 1 Fast Demo

```bash
cp .env.example .env
npm install
npm run dev
```

This runs web and AI locally with `DEMO_MODE=true`; Supabase, PostGIS, and trained model are optional.

## Mode 2 Docker

```bash
cp .env.example .env
docker compose up --build
docker compose --profile db up --build
```

Web: `http://localhost:3000`, AI: `http://localhost:5001/health`, Adminer: `http://localhost:8080` with the `db` profile.

## Mode 3 Supabase Production-Like

Create a Supabase project, run `database/migrations` in numeric order, create the report image bucket, apply RLS policies, seed demo data, set env vars, switch `DEMO_MODE=false`, then run `npm run build:web`.
