"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { AppShell } from "@/components/shell";
import { EmptyState, ErrorState, LoadingState, SectionHeader, SeverityBadge } from "@/components/ui";
import { getReports, type ReportFilters } from "@/lib/api-client";
import { REPORT_STATUS, SEVERITY, type DamageReport, type ReportStatus, type Severity } from "@radar/shared";

function StatusBadge({ status }: { status: ReportStatus }) {
  const tone =
    status === "validated" ? "bg-green-50 text-radar-green" :
    status === "rejected" ? "bg-red-50 text-radar-red" :
    status === "escalated" ? "bg-orange-50 text-radar-orange" :
    "bg-slate-100 text-radar-navy";
  return <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${tone}`}>{status.replace("_", " ")}</span>;
}

export default function DashboardReportsPage() {
  const [reports, setReports] = useState<DamageReport[]>([]);
  const [filters, setFilters] = useState<ReportFilters>({ q: "", severity: "", status: "", minConfidence: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    getReports(filters)
      .then((data) => {
        if (active) setReports(data);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "Gagal mengambil laporan.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [filters]);

  return (
    <AppShell>
      <AuthGuard allowed={["operator", "admin"]}>
        <SectionHeader title="Daftar Laporan" description="Laporan real dari API demo, siap dibuka untuk validasi operator." />
        <div className="panel mb-6 grid gap-3 md:grid-cols-[1fr_180px_180px_180px]">
          <input
            className="field"
            placeholder="Cari alamat atau deskripsi"
            value={filters.q}
            onChange={(event) => setFilters((current) => ({ ...current, q: event.target.value }))}
          />
          <select className="field" value={filters.severity} onChange={(event) => setFilters((current) => ({ ...current, severity: event.target.value as Severity | "" }))}>
            <option value="">Semua severity</option>
            {SEVERITY.filter((severity) => severity !== "unknown").map((severity) => <option key={severity} value={severity}>{severity.replace("_", " ")}</option>)}
          </select>
          <select className="field" value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value as ReportStatus | "" }))}>
            <option value="">Semua status</option>
            {REPORT_STATUS.map((status) => <option key={status} value={status}>{status.replace("_", " ")}</option>)}
          </select>
          <input
            className="field"
            min={0}
            max={1}
            step={0.05}
            type="number"
            placeholder="Min confidence"
            value={filters.minConfidence}
            onChange={(event) => setFilters((current) => ({ ...current, minConfidence: event.target.value ? Number(event.target.value) : "" }))}
          />
        </div>

        {loading && <LoadingState />}
        {error && <ErrorState message={error} />}
        {!loading && !error && reports.length === 0 && <EmptyState title="Tidak ada laporan" description="Ubah filter atau buat laporan baru dari halaman warga." />}

        {!loading && !error && reports.length > 0 && (
          <>
            <div className="hidden overflow-hidden rounded-2xl border border-radar-border bg-white shadow-sm lg:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-radar-muted">
                  <tr>
                    <th className="px-4 py-3">Lokasi</th>
                    <th className="px-4 py-3">Severity</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Confidence</th>
                    <th className="px-4 py-3">Waktu</th>
                    <th className="px-4 py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id} className="border-t border-radar-border transition hover:bg-slate-50">
                      <td className="px-4 py-4">
                        <p className="font-black text-radar-navy">{report.address}</p>
                        <p className="line-clamp-1 text-radar-muted">{report.description}</p>
                      </td>
                      <td className="px-4 py-4"><SeverityBadge severity={report.severity} /></td>
                      <td className="px-4 py-4"><StatusBadge status={report.status} /></td>
                      <td className="px-4 py-4 font-black tabular">{Math.round(report.confidence * 100)}%</td>
                      <td className="px-4 py-4 text-radar-muted">{new Date(report.createdAt).toLocaleString("id-ID")}</td>
                      <td className="px-4 py-4"><Link className="btn-primary" href={`/dashboard/reports/${report.id}`}>Detail</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 lg:hidden">
              {reports.map((report) => (
                <article className="panel" key={report.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-black text-radar-navy">{report.address}</h2>
                      <p className="mt-1 text-sm text-radar-muted">{new Date(report.createdAt).toLocaleString("id-ID")}</p>
                    </div>
                    <SeverityBadge severity={report.severity} />
                  </div>
                  <p className="mt-3 text-sm text-radar-muted">{report.description}</p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <StatusBadge status={report.status} />
                    <span className="font-black tabular text-radar-navy">{Math.round(report.confidence * 100)}%</span>
                  </div>
                  <Link className="btn-primary mt-4 w-full" href={`/dashboard/reports/${report.id}`}>Buka detail</Link>
                </article>
              ))}
            </div>
          </>
        )}
      </AuthGuard>
    </AppShell>
  );
}
