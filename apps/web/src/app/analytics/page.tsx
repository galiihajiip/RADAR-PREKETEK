import { AuthGuard } from "@/components/auth-guard";
import { AppShell } from "@/components/shell";
import { MetricCard, SectionHeader } from "@/components/ui";
import { getFullSummary } from "@/lib/reports-repo";

// Live per-request data (Supabase or demo); must not be statically cached.
export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const data = await getFullSummary();
  const rows = [
    ["Tidak Rusak", data.noDamage, "bg-radar-green"],
    ["Rusak Ringan", data.minorDamage, "bg-radar-yellow"],
    ["Rusak Berat", data.majorDamage, "bg-radar-orange"],
    ["Hancur Total", data.destroyed, "bg-radar-red"]
  ] as const;
  return (
    <AppShell>
      <AuthGuard allowed={["operator", "admin"]}>
      <SectionHeader title="Analytics & Export" description="Ringkasan dampak untuk posko dan jalur ekspor terbuka." />
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Total Laporan" value={data.total} />
        <MetricCard label="Hancur Total" value={data.destroyed} tone="red" />
        <MetricCard label="Tervalidasi" value={data.validated} tone="green" />
        <MetricCard label="Rata-rata AI" value={`${Math.round(data.avgConfidence * 100)}%`} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="panel">
          <h2 className="text-xl font-black text-radar-navy">Distribusi Severity</h2>
          <div className="mt-5 grid gap-4">
            {rows.map(([label, value, color]) => (
              <div key={label}>
                <div className="mb-2 flex items-center justify-between text-sm font-bold">
                  <span>{label}</span>
                  <span className="tabular">{value.toLocaleString("id-ID")}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${(value / data.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <h2 className="text-xl font-black text-radar-navy">Ekspor Data</h2>
          <p className="mt-2 text-sm text-radar-muted">Data laporan siap diuji di GIS, spreadsheet, atau sistem respons lain.</p>
          <div className="mt-5 grid gap-3">
            <a className="btn-primary" href="/api/export/geojson">Export GeoJSON</a>
            <a className="btn-warning" href="/api/export/csv">Export CSV</a>
          </div>
        </div>
      </div>
      </AuthGuard>
    </AppShell>
  );
}
