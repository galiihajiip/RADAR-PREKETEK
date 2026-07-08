import Link from "next/link";
import { AuthGuard } from "@/components/auth-guard";
import { AppShell } from "@/components/shell";
import { MetricCard, SectionHeader, SeverityBadge } from "@/components/ui";
import { getFullSummary, getReports } from "@/lib/reports-repo";
import { AlertTriangle, BarChart3, ClipboardList, FileText, Settings, Shield } from "lucide-react";

// These pages read live per-request data (Supabase or demo), so they must
// never be prerendered/cached as static HTML at build time.
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [stats, reports] = await Promise.all([getFullSummary(), getReports({ limit: 250 })]);
  const latestReports = reports.slice(0, 12);
  const destroyedHighConf = reports.filter(
    (r) => r.severity === "destroyed" && r.confidence >= 0.85
  );
  const hasCritical = destroyedHighConf.length > 0;

  return (
    <AppShell>
      <AuthGuard allowed={["operator", "admin"]}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <SectionHeader
            title="Command Dashboard"
            description="Pusat kendali operasi penanggulangan bencana RADAR."
          />
          <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-xs font-black text-radar-cyan">
            <Shield className="h-4 w-4" aria-hidden />
            RADAR Demo Mode
          </span>
        </div>

        {/* Critical escalation banner */}
        {hasCritical && (
          <div className="mb-6 flex items-start gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-radar-red text-white">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-black text-radar-red">Eskalasi Kritis</h2>
              <p className="mt-1 text-sm text-radar-red/80">
                Terdapat <strong>{destroyedHighConf.length}</strong> laporan berstatus{" "}
                <strong>Hancur Total</strong> dengan confidence AI ≥85%.
                Prioritaskan validasi laporan ini segera.
              </p>
              <Link
                href="/dashboard/reports?severity=destroyed"
                className="btn-danger mt-3 inline-flex"
              >
                Lihat Laporan Kritis
              </Link>
            </div>
          </div>
        )}

        {/* Metric cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <MetricCard label="Total Laporan" value={stats.total.toLocaleString("id-ID")} />
          <MetricCard
            label="Hancur Total"
            value={stats.destroyed.toLocaleString("id-ID")}
            tone="red"
          />
          <MetricCard
            label="Rata-rata Confidence AI"
            value={`${Math.round(stats.avgConfidence * 100)}%`}
          />
          <MetricCard
            label="Menunggu Validasi"
            value={stats.pendingValidation.toLocaleString("id-ID")}
            tone="orange"
          />
          <MetricCard
            label="Tersinkron Offline"
            value={stats.offlineSynced.toLocaleString("id-ID")}
            tone="green"
          />
        </div>

        {/* Main content: Latest reports + Incident feed */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Latest reports panel */}
          <div className="panel p-0">
            <div className="border-b border-radar-border p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-radar-muted">
                Laporan Terbaru
              </p>
              <h2 className="mt-1 text-xl font-black text-radar-navy">
                Prioritas Validasi
              </h2>
            </div>
            <div className="max-h-[520px] overflow-y-auto">
              {latestReports.map((report) => (
                <Link
                  key={report.id}
                  href={`/dashboard/reports/${report.id}`}
                  className="block border-b border-radar-border p-4 transition hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-black leading-tight text-radar-navy">
                        {report.address}
                      </h3>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-radar-muted">
                        {report.status.replace(/_/g, " ")}
                      </p>
                    </div>
                    <SeverityBadge severity={report.severity} />
                  </div>
                  <p className="mt-2 line-clamp-1 text-sm text-radar-muted">
                    {report.description}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-radar-cyan"
                        style={{ width: `${Math.round(report.confidence * 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-black tabular text-radar-navy">
                      {Math.round(report.confidence * 100)}%
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right sidebar: Quick links + live incident feed */}
          <div className="grid gap-6 content-start">
            {/* CTA navigation cards */}
            <div className="grid gap-3">
              {[
                {
                  href: "/dashboard/reports",
                  icon: ClipboardList,
                  label: "Daftar Laporan",
                  desc: "Semua laporan dan filter",
                },
                {
                  href: "/dashboard/analytics",
                  icon: BarChart3,
                  label: "Analytics & Export",
                  desc: "Ringkasan data dan ekspor",
                },
                {
                  href: "/dashboard/admin",
                  icon: Settings,
                  label: "Admin Console",
                  desc: "Pengaturan sistem dan demo tools",
                },
                {
                  href: "/dashboard/audit",
                  icon: FileText,
                  label: "Audit Log",
                  desc: "Riwayat aktivitas sistem",
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="panel flex items-center gap-4 transition hover:border-radar-cyan hover:bg-slate-50"
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cyan-50">
                    <item.icon className="h-5 w-5 text-radar-cyan" />
                  </div>
                  <div>
                    <p className="font-black text-radar-navy">{item.label}</p>
                    <p className="text-xs text-radar-muted">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Live incident feed */}
            <div className="panel p-0">
              <div className="border-b border-radar-border p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-radar-muted">
                  Live Incident Feed
                </p>
                <h2 className="mt-1 text-lg font-black text-radar-navy">
                  Aktivitas Terakhir
                </h2>
              </div>
              <div className="max-h-[280px] overflow-y-auto">
                {reports.slice(0, 8).map((r) => (
                  <div
                    key={`feed-${r.id}`}
                    className="flex items-start gap-3 border-b border-radar-border p-3 last:border-0"
                  >
                    <div
                      className="mt-1 h-3 w-3 shrink-0 rounded-full"
                      style={{
                        backgroundColor:
                          r.severity === "destroyed"
                            ? "#D62828"
                            : r.severity === "major_damage"
                              ? "#F77F00"
                              : r.severity === "minor_damage"
                                ? "#F4D35E"
                                : "#2A9D8F",
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-radar-navy">
                        {r.address}
                      </p>
                      <p className="text-xs text-radar-muted">
                        {r.status.replace(/_/g, " ")} &middot;{" "}
                        {Math.round(r.confidence * 100)}% conf
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Demo mode notice */}
            <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-sm">
              <p className="font-black text-radar-navy">RADAR Demo Mode</p>
              <p className="mt-1 text-radar-muted">
                Data dan sebagian layanan menggunakan simulasi untuk kebutuhan MVP.
                AI prediction menggunakan fallback deterministik.
              </p>
            </div>
          </div>
        </div>
      </AuthGuard>
    </AppShell>
  );
}
