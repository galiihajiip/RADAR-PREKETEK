import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { loadEnv } from "./load-env.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..", "..");
loadEnv(rootDir);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucket = process.env.STORAGE_BUCKET_REPORTS || "report-images";

if (!url || !serviceKey || url.includes("localhost:54321")) {
  console.error(
    "Supabase URL/service role key missing or still the local placeholder. Fill .env.local first."
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function main() {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw listError;

  if (buckets?.some((b) => b.name === bucket)) {
    console.log(`Bucket "${bucket}" already exists.`);
    return;
  }

  const { error: createError } = await supabase.storage.createBucket(bucket, {
    public: true,
    fileSizeLimit: "10MB"
  });
  if (createError) throw createError;
  console.log(`Bucket "${bucket}" created.`);
}

main().catch((error) => {
  console.error("Failed to ensure storage bucket:", error.message);
  process.exit(1);
});
