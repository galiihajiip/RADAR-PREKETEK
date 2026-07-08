import type { AnalyticsSummary, AuditEntry } from "@/lib/demo-data";
import * as demo from "@/lib/demo-data";
import * as live from "@/lib/supabase-reports";
import type { DamageReport, ReportStatus, Severity } from "@radar/shared";

// Single switch point: DEMO_MODE follows the same convention as
// api/health/route.ts ("unset or anything but 'false'" = demo). Every page
// and API route should go through this module instead of importing
// demo-data or supabase-reports directly, so there's exactly one place
// that decides which backend is live.
function isDemoMode() {
  return process.env.DEMO_MODE !== "false";
}

export type ReportListOptions = {
  severity?: Severity;
  status?: ReportStatus;
  minConfidence?: number;
  q?: string;
  limit?: number;
};

export async function getReports(options: ReportListOptions = {}): Promise<DamageReport[]> {
  const { severity, status, minConfidence, q, limit = 250 } = options;
  if (isDemoMode()) {
    return demo.filterReports(severity, minConfidence, q, status).slice(0, limit);
  }
  return live.filterReports(severity, minConfidence, q, status, limit);
}

export async function getReportById(id: string): Promise<DamageReport | null> {
  if (isDemoMode()) return demo.getReportById(id) ?? null;
  return live.getReportById(id);
}

export async function createReport(payload: Record<string, unknown>): Promise<DamageReport> {
  if (isDemoMode()) return demo.createDemoReport(payload);
  return live.createReport(payload);
}

export async function validateReport(
  id: string,
  action: "confirm_ai" | "override" | "reject",
  note?: string,
  severityFinal?: Severity
): Promise<DamageReport | null> {
  if (isDemoMode()) return demo.validateDemoReport(id, action, note, severityFinal) ?? null;
  return live.validateReport(id, action, note, severityFinal);
}

export async function getFullSummary(): Promise<AnalyticsSummary> {
  if (isDemoMode()) return demo.fullSummary();
  return live.fullSummary();
}

export async function getSimpleSummary() {
  if (isDemoMode()) return demo.summary();
  const s = await live.fullSummary();
  return { total: s.total, destroyed: s.destroyed, validated: s.validated, avgConfidence: s.avgConfidence };
}

export async function getAuditLog(): Promise<AuditEntry[]> {
  if (isDemoMode()) return demo.generateAuditLog();
  return live.generateAuditLog();
}
