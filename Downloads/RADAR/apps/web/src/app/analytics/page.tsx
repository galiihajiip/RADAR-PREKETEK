import { AuthGuard } from "@/components/auth-guard";
import { AppShell } from "@/components/shell";
import { MetricCard, SectionHeader } from "@/components/ui";
import { reports, summary } from "@/lib/demo-data";

export default function AnalyticsPage() {
  const data = summary();
  const rows = [
    ["No damage", reports.filter((report) => report.severity === "no_damage").length, "bg-radar-green"],
    ["Minor", reports.filter((report) => report.severity === "minor_damage").length, "bg-radar-yellow"],
    ["Major", reports.filter((report) => report.severity === "major_damage").length, "bg-radar-orange"],
    ["Destroyed", reports.filter((report) => report.severity === "destroyed").length, "bg-radar-red"]
  ] as const;
  return (
    <AppShell>
      <AuthGuard allowed={["operator", "admin"]}>
      <SectionHeader title="Analytics & Export" description="Ringkasan dampak untuk posko dan jalur ekspor terbuka." />
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Total" value={data.total} />
        <MetricCard label="Destroyed" value={data.destroyed} tone="red" />
        <MetricCard label="Validated" value={data.validated} tone="green" />
        <MetricCard label="Avg confidence" value={`${Math.round(data.avgConfidence * 100)}%`} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="panel">
          <h2 className="text-xl font-black text-radar-navy">Severity distribution</h2>
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
          <h2 className="text-xl font-black text-radar-navy">Exports</h2>
          <p className="mt-2 text-sm text-radar-muted">Data dummy 10.000 baris siap diuji di GIS atau spreadsheet.</p>
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
