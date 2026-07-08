import generatedReports from "@/data/demo-reports.generated.json";
import type { DamageReport, ReportStatus, Severity } from "@radar/shared";
import { fallbackPrediction } from "@/lib/ai-fallback";

export const reports: DamageReport[] = generatedReports as DamageReport[];

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

export function getReportById(id: string) {
  return reports.find((report) => report.id === id || report.localId === id || report.local_id === id);
}

export function createDemoReport(payload: Record<string, unknown>) {
  const localId = String(payload.localId ?? payload.local_id ?? `local-${Date.now()}`);
  const existing = reports.find((report) => report.localId === localId || report.local_id === localId);
  if (existing) return existing;

  const aiPrediction = fallbackPrediction({ ...payload, localId });
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

export interface AnalyticsSummary {
  total: number;
  destroyed: number;
  majorDamage: number;
  minorDamage: number;
  noDamage: number;
  unknown: number;
  avgConfidence: number;
  pendingValidation: number;
  validated: number;
  rejected: number;
  escalated: number;
  offlineSynced: number;
}

export function fullSummary(): AnalyticsSummary {
  const total = reports.length;
  const destroyed = reports.filter((r) => r.severity === "destroyed").length;
  const majorDamage = reports.filter((r) => r.severity === "major_damage").length;
  const minorDamage = reports.filter((r) => r.severity === "minor_damage").length;
  const noDamage = reports.filter((r) => r.severity === "no_damage").length;
  const unknown = reports.filter((r) => r.severity === "unknown").length;
  const avgConfidence = total > 0 ? reports.reduce((sum, r) => sum + r.confidence, 0) / total : 0;
  const pendingValidation = reports.filter((r) => !["validated", "rejected"].includes(r.status)).length;
  const validated = reports.filter((r) => r.status === "validated").length;
  const rejected = reports.filter((r) => r.status === "rejected").length;
  const escalated = reports.filter((r) => r.status === "escalated").length;
  const offlineSynced = reports.filter((r) => r.syncStatus === "synced").length;
  return {
    total,
    destroyed,
    majorDamage,
    minorDamage,
    noDamage,
    unknown,
    avgConfidence: Number(avgConfidence.toFixed(4)),
    pendingValidation,
    validated,
    rejected,
    escalated,
    offlineSynced,
  };
}

export interface AuditEntry {
  id: string;
  action: string;
  actionLabel: string;
  actor: string;
  role: string;
  reportId?: string;
  reportTitle?: string;
  timestamp: string;
  note?: string;
}

export function generateAuditLog(): AuditEntry[] {
  const entries: AuditEntry[] = [];
  for (const r of reports.slice(0, 200)) {
    entries.push({
      id: `audit-created-${r.id}`,
      action: "report_created",
      actionLabel: "Laporan Dibuat",
      actor: r.reporterName || "Warga",
      role: "citizen",
      reportId: r.id,
      reportTitle: r.address,
      timestamp: r.createdAt,
      note: r.description?.slice(0, 80),
    });
    if (r.aiPrediction || r.status !== "draft") {
      const aiTime = new Date(new Date(r.createdAt).getTime() + 2000).toISOString();
      entries.push({
        id: `audit-ai-${r.id}`,
        action: "ai_completed",
        actionLabel: "AI Selesai",
        actor: "RADAR AI",
        role: "system",
        reportId: r.id,
        reportTitle: r.address,
        timestamp: aiTime,
        note: `Severity: ${r.aiPrediction?.severity ?? r.severity}, Confidence: ${Math.round((r.aiPrediction?.confidence ?? r.confidence) * 100)}%`,
      });
    }
    if (r.status === "validated" && r.validatedAt) {
      entries.push({
        id: `audit-validated-${r.id}`,
        action: "validated",
        actionLabel: "Tervalidasi",
        actor: "Demo Operator",
        role: "operator",
        reportId: r.id,
        reportTitle: r.address,
        timestamp: r.validatedAt,
        note: r.validationNote || "Dikonfirmasi oleh operator.",
      });
    }
    if (r.severityFinal && r.severityFinal !== r.aiPrediction?.severity && r.validatedAt) {
      entries.push({
        id: `audit-overridden-${r.id}`,
        action: "overridden",
        actionLabel: "Override Severity",
        actor: "Demo Operator",
        role: "operator",
        reportId: r.id,
        reportTitle: r.address,
        timestamp: r.validatedAt,
        note: `Final severity: ${r.severityFinal}`,
      });
    }
    if (r.status === "rejected" && r.rejectedAt) {
      entries.push({
        id: `audit-rejected-${r.id}`,
        action: "rejected",
        actionLabel: "Ditolak",
        actor: "Demo Operator",
        role: "operator",
        reportId: r.id,
        reportTitle: r.address,
        timestamp: r.rejectedAt,
        note: r.validationNote || "Laporan ditolak.",
      });
    }
    if (r.status === "escalated") {
      entries.push({
        id: `audit-escalated-${r.id}`,
        action: "escalated",
        actionLabel: "Eskalasi",
        actor: "RADAR System",
        role: "system",
        reportId: r.id,
        reportTitle: r.address,
        timestamp: r.updatedAt,
        note: "Laporan kritis di-eskalasi otomatis.",
      });
    }
  }
  entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return entries;
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
