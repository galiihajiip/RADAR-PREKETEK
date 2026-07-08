import generatedReports from "@/data/demo-reports.generated.json";
import type { DamageReport, Severity } from "@radar/shared";

export const reports: DamageReport[] = generatedReports as DamageReport[];

export function summary() {
  const total = reports.length;
  const destroyed = reports.filter((report) => report.severity === "destroyed").length;
  const validated = reports.filter((report) => report.status === "validated").length;
  const confidence = reports.reduce((sum, report) => sum + report.confidence, 0) / total;
  return { total, destroyed, validated, avgConfidence: Number(confidence.toFixed(2)) };
}

export function filterReports(severity?: Severity, minConfidence?: number, q?: string) {
  return reports.filter((report) => {
    if (severity && report.severity !== severity) return false;
    if (minConfidence && report.confidence < minConfidence) return false;
    if (q && !`${report.address} ${report.description}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
}
