import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../../scripts/db/load-env.mjs";

// This is an npm workspace: `next dev`/`next build` run with cwd=apps/web,
// so Next's own .env loader never sees the monorepo-root .env/.env.local
// where Supabase/AI_SERVICE_URL/etc actually live. Load them here so
// process.env is fully populated before Next reads it.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
loadEnv(path.resolve(__dirname, "..", ".."));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.DOCKER_BUILD === "true" ? "standalone" : undefined,
  transpilePackages: ["@radar/shared"]
};

export default nextConfig;
