import type { AiPrediction, Severity } from "@radar/shared";

const SEVERITIES: Severity[] = ["no_damage", "minor_damage", "major_damage", "destroyed"];

// Deterministic placeholder used until the real MobileNetV3 model is wired
// up: hashes the report's text fields into a severity + confidence so the
// rest of the pipeline (validation, dashboard, audit log) has something
// consistent to work with. Swap this out for a real /predict call to the
// Flask AI service once the model is trained.
export function fallbackPrediction(payload: Record<string, unknown>): AiPrediction {
  const source = `${payload.localId ?? payload.local_id ?? ""}-${payload.address ?? ""}-${payload.description ?? ""}`;
  const score = [...source].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const severity = SEVERITIES[score % SEVERITIES.length];

  const base: Record<Severity, number> = {
    no_damage: 0.08,
    minor_damage: 0.12,
    major_damage: 0.18,
    destroyed: 0.22,
    unknown: 0
  };
  base[severity] = 0.62;
  const total = SEVERITIES.reduce((sum, item) => sum + base[item], 0);
  const probabilities = {
    no_damage: Number((base.no_damage / total).toFixed(4)),
    minor_damage: Number((base.minor_damage / total).toFixed(4)),
    major_damage: Number((base.major_damage / total).toFixed(4)),
    destroyed: Number((base.destroyed / total).toFixed(4)),
    unknown: 0
  };

  return {
    severity,
    confidence: probabilities[severity],
    probabilities,
    modelVersion: "demo-fallback",
    inferenceMs: 18 + (score % 17)
  };
}
