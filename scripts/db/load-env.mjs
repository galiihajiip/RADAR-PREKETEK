import fs from "node:fs";
import path from "node:path";

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, "utf8");
  const result = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    result[key] = value;
  }
  return result;
}

// Precedence: real (pre-existing) process env wins, .env.local overrides .env.
export function loadEnv(rootDir) {
  const preExisting = new Set(Object.keys(process.env));
  const merged = {};
  for (const file of [".env", ".env.local"]) {
    Object.assign(merged, parseEnvFile(path.join(rootDir, file)));
  }
  for (const [key, value] of Object.entries(merged)) {
    if (!preExisting.has(key)) process.env[key] = value;
  }
}
