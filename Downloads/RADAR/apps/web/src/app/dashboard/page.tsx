import { AuthGuard } from "@/components/auth-guard";
import { AppShell } from "@/components/shell";
import { MetricCard, SectionHeader, SeverityBadge } from "@/components/ui";
import { reports } from "@/lib/demo-data";

export default function DashboardPage() {
  const visibleReports = reports.slice(0, 100);
  const highConfidence = reports.filter((report) => report.confidence >= 0.85).length;
  const openCases = reports.filter((report) => !["validated", "rejected"].includes(report.status)).length;
  const severityColor = (severity: string) =>
    severity === "destroyed" ? "#D62828" : severity === "major_damage" ? "#F77F00" : severity === "minor_damage" ? "#F4D35E" : "#2A9D8F";

  return (
    <AppShell>
      <AuthGuard allowed={["operator", "admin"]}>
      <SectionHeader title="Operator Command Dashboard" description="Prioritas geospasial, confidence AI, dan validasi manusia dalam satu layar kerja." />
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Total laporan" value={reports.length.toLocaleString("id-ID")} />
        <MetricCard label="Destroyed" value={reports.filter((r) => r.severity === "destroyed").length.toLocaleString("id-ID")} tone="red" />
        <MetricCard label="Confidence >=85" value={highConfidence.toLocaleString("id-ID")} tone="green" />
        <MetricCard label="Open cases" value={openCases.toLocaleString("id-ID")} tone="orange" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_420px]">
        <div className="panel p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-radar-muted">Cianjur operational map</p>
              <h2 className="text-xl font-black text-radar-navy">Damage clusters</h2>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-black">
              <span className="rounded-full bg-red-50 px-3 py-1 text-radar-red">Destroyed</span>
              <span className="rounded-full bg-orange-50 px-3 py-1 text-radar-orange">Major</span>
              <span className="rounded-full bg-yellow-50 px-3 py-1 text-yellow-700">Minor</span>
            </div>
          </div>
          <div className="map-grid relative h-[520px] overflow-hidden rounded-2xl border border-radar-border">
            <div className="absolute left-[8%] top-[12%] h-64 w-64 rounded-full border border-radar-cyan/30" />
            <div className="absolute right-[12%] top-[28%] h-72 w-72 rounded-full border border-radar-blue/20" />
            <div className="absolute bottom-[10%] left-[28%] h-48 w-48 rounded-full border border-radar-red/20" />
            {visibleReports.slice(0, 70).map((report, index) => {
              const left = 8 + ((index * 17) % 82);
              const top = 10 + ((index * 29) % 76);
              const size = report.severity === "destroyed" ? 18 : report.severity === "major_damage" ? 15 : 12;
              return (
                <div key={report.id} className="group absolute" style={{ left: `${left}%`, top: `${top}%` }}>
                  <div
                    className="rounded-full border-4 border-white shadow-lg transition group-hover:scale-125"
                    style={{ backgroundColor: severityColor(report.severity), width: size, height: size }}
                  />
                  <div className="pointer-events-none absolute left-4 top-4 hidden w-48 rounded-xl bg-white p-3 text-xs shadow-soft group-hover:block">
                    <p className="font-black text-radar-navy">{report.address}</p>
                    <p className="mt-1 text-radar-muted">{Math.round(report.confidence * 100)}% confidence</p>
                  </div>
                </div>
              );
            })}
            <div className="absolute bottom-4 left-4 grid gap-2 rounded-2xl bg-white/95 p-4 shadow-soft">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-radar-muted">Current filter</p>
              <p className="font-black text-radar-navy">All reports - first 70 markers</p>
              <p className="text-xs text-radar-muted">Full dataset available in API/export.</p>
            </div>
          </div>
        </div>
        <div className="panel max-h-[640px] overflow-hidden p-0">
          <div className="border-b border-radar-border p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-radar-muted">Validation Queue</p>
            <h2 className="mt-1 text-xl font-black text-radar-navy">High-priority reports</h2>
          </div>
          <div className="grid max-h-[560px] gap-0 overflow-y-auto">
          {visibleReports.slice(0, 24).map((report) => (
            <article className="border-b border-radar-border p-4 transition hover:bg-slate-50" key={report.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-black leading-tight text-radar-navy">{report.address}</h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-radar-muted">{report.status.replace("_", " ")}</p>
                </div>
                <SeverityBadge severity={report.severity} />
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-radar-muted">{report.description}</p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-radar-cyan" style={{ width: `${Math.round(report.confidence * 100)}%` }} />
                </div>
                <p className="text-sm font-black tabular text-radar-navy">{Math.round(report.confidence * 100)}%</p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button className="btn-success">Confirm</button>
                <button className="btn-warning">Override</button>
              </div>
            </article>
          ))}
          </div>
        </div>
      </div>
      </AuthGuard>
    </AppShell>
  );
}
