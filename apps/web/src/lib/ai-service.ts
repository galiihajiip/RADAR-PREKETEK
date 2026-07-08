import type { AiPrediction } from "@radar/shared";

type FlaskPredictResponse = {
  success: boolean;
  data?: {
    severity: AiPrediction["severity"];
    confidence: number;
    probabilities: AiPrediction["probabilities"];
    model_version: string;
    inference_ms: number;
  };
};

// Calls the real Flask AI service. Returns null on any failure (service down,
// timeout, bad response) so callers can fall back to the deterministic
// placeholder instead of failing the whole report submission.
export async function predictSeverity(imageBuffer: Buffer, contentType: string): Promise<AiPrediction | null> {
  const baseUrl = process.env.AI_SERVICE_URL;
  if (!baseUrl) return null;

  const form = new FormData();
  form.append("image", new Blob([new Uint8Array(imageBuffer)], { type: contentType }), "upload");

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(`${baseUrl}/predict`, { method: "POST", body: form, signal: controller.signal });
    clearTimeout(timeout);
    if (!response.ok) return null;

    const json = (await response.json()) as FlaskPredictResponse;
    if (!json.success || !json.data) return null;

    return {
      severity: json.data.severity,
      confidence: json.data.confidence,
      probabilities: json.data.probabilities,
      modelVersion: json.data.model_version,
      inferenceMs: json.data.inference_ms
    };
  } catch {
    return null;
  }
}
