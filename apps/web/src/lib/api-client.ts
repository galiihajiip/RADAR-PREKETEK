import type { ApiResponse, DamageReport, ReportStatus, Severity } from "@radar/shared";

export type ReportPayload = {
  localId?: string;
  local_id?: string;
  reporterName: string;
  address: string;
  description: string;
  latitude: number | string;
  longitude: number | string;
  imagePreview?: string;
  imageContentType?: string;
};

export type ReportFilters = {
  q?: string;
  severity?: Severity | "";
  status?: ReportStatus | "";
  minConfidence?: number | "";
};

async function readResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as ApiResponse<T>;
  if (!payload.success) throw new Error(payload.error.message);
  return payload.data;
}

export async function createReport(payload: ReportPayload) {
  const response = await fetch("/api/reports", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return readResponse<DamageReport>(response);
}

export async function getReports(filters: ReportFilters = {}) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.severity) params.set("severity", filters.severity);
  if (filters.status) params.set("status", filters.status);
  if (filters.minConfidence !== "" && filters.minConfidence !== undefined) {
    params.set("min_confidence", String(filters.minConfidence));
  }
  const response = await fetch(`/api/reports${params.toString() ? `?${params}` : ""}`, { cache: "no-store" });
  return readResponse<DamageReport[]>(response);
}

export async function getReportById(id: string) {
  const response = await fetch(`/api/reports/${encodeURIComponent(id)}`, { cache: "no-store" });
  return readResponse<DamageReport>(response);
}

export async function validateReport(id: string, body: { action?: "confirm_ai" | "override"; severityFinal?: Severity; note?: string }) {
  const response = await fetch("/api/reports/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-demo-role": "operator" },
    body: JSON.stringify({ reportId: id, ...body })
  });
  return readResponse<DamageReport>(response);
}

export async function rejectReport(id: string, body: { note: string }) {
  const response = await fetch("/api/reports/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-demo-role": "operator" },
    body: JSON.stringify({ reportId: id, action: "reject", ...body })
  });
  return readResponse<DamageReport>(response);
}

export async function getAnalyticsSummary() {
  const response = await fetch("/api/analytics/summary", { cache: "no-store" });
  return readResponse<unknown>(response);
}
