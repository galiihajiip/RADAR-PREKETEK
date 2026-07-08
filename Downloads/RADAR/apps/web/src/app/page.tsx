import Link from "next/link";
import { ArrowRight, Database } from "lucide-react";
import { AppShell } from "@/components/shell";
import { MetricCard, OnlineStatusBadge, SeverityBadge } from "@/components/ui";
import { reports, summary } from "@/lib/demo-data";

export default function HomePage() {
  const data = summary();
  const priorityReports = reports.filter((report) => report.severity === "destroyed").slice(0, 4);

  return (
    <AppShell>
      <section className="grid min-h-[calc(100vh-120px)] gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div className="py-6">
          <div className="flex flex-wrap items-center gap-3">
            <OnlineStatusBadge online />
            <span className="inline-flex items-center gap-2 rounded-full border border-radar-border bg-white px-3 py-1 text-xs font-black text-radar-navy">
              <Database className="h-3.5 w-3.5 text-radar-cyan" /> 10.000 demo reports loaded
            </span>
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight text-radar-navy sm:text-6xl">
            Rapid damage intelligence for disaster response.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-radar-muted">
            RADAR menggabungkan laporan warga offline-first, klasifikasi AI lokal, dan dashboard operator untuk memprioritaskan bantuan pascabencana dengan cepat.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link className="btn-primary px-5" href="/dashboard">Open command center <ArrowRight className="h-4 w-4" /></Link>
            <Link className="btn-warning px-5" href="/report">Submit citizen report</Link>
          </div>
          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            <div className="rounded-2xl border border-radar-border bg-white p-4">
              <p className="text-xs font-black uppercase text-radar-muted">Reports</p>
              <p className="mt-2 text-2xl font-black tabular text-radar-navy">{data.total.toLocaleString("id-ID")}</p>
            </div>
            <div className="rounded-2xl border border-radar-border bg-white p-4">
              <p className="text-xs font-black uppercase text-radar-muted">Destroyed</p>
              <p className="mt-2 text-2xl font-black tabular text-radar-red">{data.destroyed.toLocaleString("id-ID")}</p>
            </div>
            <div className="rounded-2xl border border-radar-border bg-white p-4">
              <p className="text-xs font-black uppercase text-radar-muted">Avg AI</p>
              <p className="mt-2 text-2xl font-black tabular text-radar-green">{Math.round(data.avgConfidence * 100)}%</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="dark-surface overflow-hidden rounded-2xl border border-white/10 p-5 shadow-soft">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-radar-cyan">Live response board</p>
                <h2 className="mt-1 text-2xl font-black">Gempa Cianjur</h2>
              </div>
              <span className="rounded-full bg-radar-red px-3 py-1 text-xs font-black">Priority</span>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_250px]">
              <div className="map-grid relative min-h-[360px] overflow-hidden rounded-2xl border border-white/10">
                <div className="absolute left-[18%] top-[22%] h-24 w-24 rounded-full border border-radar-cyan/60" />
                <div className="absolute left-[11%] top-[14%] h-40 w-40 rounded-full border border-radar-cyan/30" />
                <div className="absolute left-[38%] top-[32%] h-56 w-56 rounded-full border border-radar-cyan/20" />
                {priorityReports.map((report, index) => (
                  <div
                    key={report.id}
                    className="absolute rounded-full border-4 border-white bg-radar-red shadow-lg"
                    style={{ left: `${20 + index * 16}%`, top: `${20 + (index % 3) * 20}%`, width: 18, height: 18 }}
                    title={report.address}
                  />
                ))}
                <div className="absolute bottom-4 left-4 rounded-xl bg-white/95 p-3 text-radar-navy shadow-soft">
                  <p className="text-xs font-black uppercase text-radar-muted">AI triage zone</p>
                  <p className="mt-1 font-black">Cugenang - Pacet Corridor</p>
                </div>
              </div>
              <div className="grid gap-3">
                {priorityReports.map((report) => (
                  <div key={report.id} className="rounded-xl border border-white/10 bg-white/10 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-black">{report.address.split(",")[1]?.trim() ?? "Cianjur"}</p>
                      <SeverityBadge severity={report.severity} />
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs text-slate-300">{report.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="grid gap-4 py-8 md:grid-cols-3">
        <MetricCard label="Offline ready" value="PWA" delta="Queue survives reload" />
        <MetricCard label="Data sovereignty" value="Local AI" delta="No third-party vision API" tone="green" />
        <MetricCard label="Failure mode" value="Safe" delta="Supabase optional" tone="orange" />
      </section>
    </AppShell>
  );
}
