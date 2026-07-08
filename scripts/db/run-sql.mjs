import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { loadEnv } from "./load-env.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..", "..");
loadEnv(rootDir);

const targetArg = process.argv[2];
if (!targetArg) {
  console.error("Usage: node scripts/db/run-sql.mjs <relative-dir-of-sql-files>");
  process.exit(1);
}

const targetDir = path.resolve(rootDir, targetArg);
if (!fs.existsSync(targetDir)) {
  console.error(`Directory not found: ${targetDir}`);
  process.exit(1);
}

const files = fs
  .readdirSync(targetDir)
  .filter((name) => name.endsWith(".sql"))
  .sort();

if (files.length === 0) {
  console.log(`No .sql files found in ${targetDir}`);
  process.exit(0);
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString || connectionString.includes("localhost:5433")) {
  console.error(
    "DATABASE_URL is missing or still the local docker placeholder. Put your real Supabase connection string in .env.local first."
  );
  process.exit(1);
}

const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } });

async function main() {
  await client.connect();
  for (const file of files) {
    const filePath = path.join(targetDir, file);
    const sql = fs.readFileSync(filePath, "utf8");
    process.stdout.write(`Applying ${path.relative(rootDir, filePath)} ... `);
    await client.query(sql);
    console.log("done");
  }
}

main()
  .then(() => client.end())
  .catch(async (error) => {
    console.error("\nFailed:", error.message);
    await client.end().catch(() => {});
    process.exit(1);
  });
