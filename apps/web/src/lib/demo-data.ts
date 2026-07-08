import generatedReports from "@/data/demo-reports.generated.json";
import type { AiPrediction, DamageReport, ReportStatus, Severity } from "@radar/shared";

export const reports: DamageReport[] = generatedReports as DamageReport[];

const SEVERITIES: Severity[] = ["no_damage", "minor_damage", "major_damage", "destroyed"];

export function summary() {
  const total = reports.length;
  const destroyed = reports.filter((report) => report.severity === "destroyed").length;
  const validated = reports.filter((report) => report.status === "validated").length;
  const confidence = reports.reduce((sum, report) => sum + report.confidence, 0) / total;
  return { total, destroyed, validated, avgConfidence: Number(confidence.toFixed(2)) };
}

export function filterReports(severity?: Severity, minConfidence?: number, q?: string, status?: ReportStatus) {
  return reports.filter((report) => {
    if (severity && report.severity !== severity) return false;
    if (status && report.status !== status) return false;
    if (minConfidence && report.confidence < minConfidence) return false;
    if (q && !`${report.address} ${report.description}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
}

function predictionFromPayload(payload: Record<string, unknown>): AiPrediction {
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

export function getReportById(id: string) {
  return reports.find((report) => report.id === id || report.localId === id || report.local_id === id);
}

export function createDemoReport(payload: Record<string, unknown>) {
  const localId = String(payload.localId ?? payload.local_id ?? `local-${Date.now()}`);
  const existing = reports.find((report) => report.localId === localId || report.local_id === localId);
  if (existing) return existing;

  const aiPrediction = predictionFromPayload({ ...payload, localId });
  const now = new Date().toISOString();
  const report: DamageReport = {
    id: `rpt-${Date.now()}`,
    localId,
    local_id: localId,
    reporterName: String(payload.reporterName ?? "Demo Citizen"),
    address: String(payload.address ?? "Cianjur"),
    description: String(payload.description ?? "Demo report created in fallback mode."),
    latitude: Number(payload.latitude ?? -6.816),
    longitude: Number(payload.longitude ?? 107.079),
    severity: aiPrediction.severity,
    status: "ai_completed",
    syncStatus: "synced",
    confidence: aiPrediction.confidence,
    createdAt: now,
    updatedAt: now,
    aiPrediction,
    image: {
      id: `img-${Date.now()}`,
      reportId: "",
      url: String(payload.imagePreview ?? "/radar-mark.svg"),
      contentType: String(payload.imageContentType ?? "image/mock")
    }
  };
  report.image = { ...report.image!, reportId: report.id };
  reports.unshift(report);
  return report;
}

export function validateDemoReport(
  id: string,
  action: "confirm_ai" | "override" | "reject",
  note?: string,
  severityFinal?: Severity
) {
  const report = getReportById(id);
  if (!report) return null;
  const now = new Date().toISOString();
  if (action === "reject") {
    report.status = "rejected";
    report.rejectedAt = now;
  } else {
    report.status = "validated";
    report.validatedAt = now;
    report.severityFinal = action === "override" && severityFinal ? severityFinal : report.aiPrediction?.severity ?? report.severity;
    report.severity = report.severityFinal;
  }
  report.validationNote = note;
  report.updatedAt = now;
  return report;
}
