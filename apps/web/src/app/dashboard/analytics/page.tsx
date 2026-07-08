import Link from "next/link";
import { AuthGuard } from "@/components/auth-guard";
import { AppShell } from "@/components/shell";
import { MetricCard, SectionHeader } from "@/components/ui";
import { getFullSummary } from "@/lib/reports-repo";
import { Download, FileJson, FileSpreadsheet, Map, Shield } from "lucide-react";

// Live per-request data (Supabase or demo); must not be statically cached.
export const dynamic = "force-dynamic";

export default async function DashboardAnalyticsPage() {
  const s = await getFullSummary();

  const severityRows: Array<[string, number, string]> = [
    ["Tidak Rusak", s.noDamage, "bg-radar-green"],
    ["Rusak Ringan", s.minorDamage, "bg-radar-yellow"],
    ["Rusak Berat", s.majorDamage, "bg-radar-orange"],
    ["Hancur Total", s.destroyed, "bg-radar-red"],
  ];

  const statusRows: Array<[string, number, string]> = [
    ["Menunggu Validasi", s.pendingValidation, "bg-radar-orange"],
    ["Tervalidasi", s.validated, "bg-radar-green"],
    ["Ditolak", s.rejected, "bg-radar-red"],
    ["Tereskalasi", s.escalated, "bg-radar-cyan"],
  ];

  return (
    <AppShell>
      <AuthGuard allowed={["operator", "admin"]}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <SectionHeader
            title="Analytics & Export"
            description="Ringkasan dampak, distribusi severity, dan jalur ekspor data terbuka."
          />
          <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-xs font-black text-radar-cyan">
            <Shield className="h-4 w-4" aria-hidden />
            Demo Mode
          </span>
        </div>

        {/* Summary metric cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Total Laporan" value={s.total.toLocaleString("id-ID")} />
          <MetricCard
            label="Hancur Total"
            value={s.destroyed.toLocaleString("id-ID")}
            tone="red"
          />
          <MetricCard
            label="Tervalidasi"
            value={s.validated.toLocaleString("id-ID")}
            tone="green"
          />
          <MetricCard
            label="Rata-rata Confidence AI"
            value={`${Math.round(s.avgConfidence * 100)}%`}
          />
        </div>

        {/* Charts and exports */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Severity distribution */}
          <div className="panel">
            <h2 className="text-xl font-black text-radar-navy">Distribusi Severity</h2>
            <p className="mt-1 text-sm text-radar-muted">
              Berdasarkan prediksi AI dan validasi operator.
            </p>
            <div className="mt-5 grid gap-4">
              {severityRows.map(([label, value, color]) => (
                <div key={label}>
                  <div className="mb-2 flex items-center justify-between text-sm font-bold">
                    <span>{label}</span>
                    <span className="tabular">{value.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${color}`}
                      style={{ width: `${s.total > 0 ? (value / s.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status distribution */}
          <div className="panel">
            <h2 className="text-xl font-black text-radar-navy">Status Validasi</h2>
            <p className="mt-1 text-sm text-radar-muted">
              Progres validasi operator terhadap laporan masuk.
            </p>
            <div className="mt-5 grid gap-4">
              {statusRows.map(([label, value, color]) => (
                <div key={label}>
                  <div className="mb-2 flex items-center justify-between text-sm font-bold">
                    <span>{label}</span>
                    <span className="tabular">{value.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${color}`}
                      style={{ width: `${s.total > 0 ? (value / s.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional metrics row */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Menunggu Validasi"
            value={s.pendingValidation.toLocaleString("id-ID")}
            tone="orange"
          />
          <MetricCard
            label="Ditolak"
            value={s.rejected.toLocaleString("id-ID")}
            tone="red"
          />
          <MetricCard
            label="Tereskalasi"
            value={s.escalated.toLocaleString("id-ID")}
            tone="orange"
          />
          <MetricCard
            label="Tersinkron Offline"
            value={s.offlineSynced.toLocaleString("id-ID")}
            tone="green"
          />
        </div>

        {/* Export panel */}
        <div className="mt-6 panel">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-radar-navy">Ekspor Data</h2>
              <p className="mt-1 text-sm text-radar-muted">
                Data demo {s.total.toLocaleString("id-ID")} laporan siap diuji di GIS, spreadsheet, atau sistem lain.
              </p>
            </div>
            <Download className="h-6 w-6 text-radar-cyan" />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <a className="btn-primary flex items-center justify-center gap-2" href="/api/export/csv">
              <FileSpreadsheet className="h-4 w-4" />
              Export CSV
            </a>
            <a className="btn-success flex items-center justify-center gap-2" href="/api/export/geojson">
              <Map className="h-4 w-4" />
              Export GeoJSON
            </a>
            <a className="btn-warning flex items-center justify-center gap-2" href="/api/export/json">
              <FileJson className="h-4 w-4" />
              Export JSON
            </a>
          </div>
          <div className="mt-4 grid gap-2 text-xs text-radar-muted sm:grid-cols-3">
            <p><strong>CSV</strong> — format tabel untuk spreadsheet dan analisis data posko.</p>
            <p><strong>GeoJSON</strong> — format geospasial untuk impor ke QGIS, ArcGIS, atau peta lain.</p>
            <p><strong>JSON</strong> — format lengkap untuk integrasi dengan sistem respons bencana.</p>
          </div>
        </div>

        {/* Demo limitation notice */}
        <div className="mt-6 rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-sm">
          <p className="font-black text-radar-navy">Catatan Demo</p>
          <p className="mt-1 text-radar-muted">
            Analytics menggunakan data demo in-memory. Target produksi akan terhubung ke PostgreSQL/PostGIS
            untuk real-time analytics yang persisten.
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link href="/dashboard" className="btn-primary">
            ← Kembali ke Dashboard
          </Link>
        </div>
      </AuthGuard>
    </AppShell>
  );
}
