"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock, ImageIcon, Info, RotateCw, XCircle } from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { AppShell } from "@/components/shell";
import { ErrorState, LoadingState, SectionHeader, SeverityBadge } from "@/components/ui";
import { getReportById, rejectReport, validateReport } from "@/lib/api-client";
import { SEVERITY, SEVERITY_LABEL_ID, type DamageReport, type ReportStatus, type Severity } from "@radar/shared";

function StatusBadge({ status }: { status: ReportStatus }) {
  const tone =
    status === "validated" ? "bg-green-50 text-radar-green" :
    status === "rejected" ? "bg-red-50 text-radar-red" :
    status === "escalated" ? "bg-orange-50 text-radar-orange" :
    "bg-slate-100 text-radar-navy";
  return <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${tone}`}>{status.replace("_", " ")}</span>;
}

export function ReportDetailClient({ reportId }: { reportId: string }) {
  const [report, setReport] = useState<DamageReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [success, setSuccess] = useState("");
  const [isActing, setIsActing] = useState(false);
  const [overrideSeverity, setOverrideSeverity] = useState<Severity>("major_damage");
  const [overrideNote, setOverrideNote] = useState("");
  const [rejectNote, setRejectNote] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      setReport(await getReportById(reportId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengambil detail laporan.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [reportId]);

  const prediction = useMemo(() => {
    if (!report) return null;
    return report.aiPrediction ?? {
      severity: report.severity,
      confidence: report.confidence,
      probabilities: {
        no_damage: report.severity === "no_damage" ? report.confidence : 0.08,
        minor_damage: report.severity === "minor_damage" ? report.confidence : 0.12,
        major_damage: report.severity === "major_damage" ? report.confidence : 0.18,
        destroyed: report.severity === "destroyed" ? report.confidence : 0.22,
        unknown: 0
      },
      modelVersion: "demo-fallback",
      inferenceMs: 24
    };
  }, [report]);

  async function runAction(action: () => Promise<DamageReport>, message: string) {
    setIsActing(true);
    setActionError("");
    setSuccess("");
    try {
      const updated = await action();
      setReport(updated);
      setSuccess(message);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Aksi validasi gagal.");
    } finally {
      setIsActing(false);
    }
  }

  if (loading) {
    return (
      <AppShell>
        <AuthGuard allowed={["operator", "admin"]}><LoadingState /></AuthGuard>
      </AppShell>
    );
  }

  if (error || !report || !prediction) {
    return (
      <AppShell>
        <AuthGuard allowed={["operator", "admin"]}><ErrorState message={error || "Laporan tidak ditemukan."} /></AuthGuard>
      </AppShell>
    );
  }

  const imageSrc = report.image?.url && report.image.url.startsWith("/") ? report.image.url : "/radar-mark.svg";

  return (
    <AppShell>
      <AuthGuard allowed={["operator", "admin"]}>
        <SectionHeader title="Detail Laporan" description="Panel validasi manusia untuk memastikan AI fallback tidak menjadi keputusan final otomatis." />
        <div className="mb-5 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm font-semibold leading-6 text-radar-orange">
          AI membantu triase awal. Keputusan akhir tetap melalui validasi operator.
        </div>
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <Link className="btn-primary" href="/dashboard/reports">Kembali ke daftar</Link>
          <button className="btn-warning" onClick={load}><RotateCw className="h-4 w-4" /> Refresh</button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_390px]">
          <div className="grid gap-6">
            <section className="panel">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-radar-muted">Report ID {report.id}</p>
                  <h1 className="mt-2 text-3xl font-black text-radar-navy">{report.address}</h1>
                  <p className="mt-2 max-w-3xl text-radar-muted">{report.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <SeverityBadge severity={report.severity} />
                  <StatusBadge status={report.status} />
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs font-black text-radar-muted">Confidence</p><p className="text-2xl font-black">{Math.round(prediction.confidence * 100)}%</p></div>
                <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs font-black text-radar-muted">Latitude</p><p className="font-black tabular">{report.latitude}</p></div>
                <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs font-black text-radar-muted">Longitude</p><p className="font-black tabular">{report.longitude}</p></div>
              </div>
            </section>

            <section className="panel">
              <h2 className="flex items-center gap-2 text-xl font-black text-radar-navy"><ImageIcon className="h-5 w-5 text-radar-cyan" /> Bukti & Lokasi</h2>
              <div className="mt-4 grid gap-5 md:grid-cols-[260px_1fr]">
                <div className="grid aspect-video place-items-center overflow-hidden rounded-2xl border border-radar-border bg-slate-50">
                  <img src={imageSrc} alt="Bukti kerusakan demo" className="max-h-full max-w-full object-contain p-8" />
                </div>
                <div className="grid gap-3 text-sm">
                  <p><span className="font-black">Pelapor:</span> {report.reporterName}</p>
                  <p><span className="font-black">Koordinat:</span> {report.latitude}, {report.longitude}</p>
                  <p><span className="font-black">Foto:</span> {report.image?.url?.startsWith("mock://") ? "Mock image path; upload biner belum aktif." : "Aset demo."}</p>
                  <p className="rounded-xl bg-cyan-50 p-3 font-bold text-radar-blue">Produksi proposal menargetkan upload storage dan validasi kualitas gambar. Block 2 menjaga bukti foto sebagai mock agar flow validasi tetap berjalan.</p>
                </div>
              </div>
            </section>

            <section className="panel">
              <h2 className="text-xl font-black text-radar-navy">Panel Analisis AI</h2>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <SeverityBadge severity={prediction.severity} />
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-radar-navy">{prediction.modelVersion}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-radar-navy">{prediction.inferenceMs} ms</span>
              </div>
              <div className="mt-5 grid gap-4">
                {SEVERITY.filter((severity) => severity !== "unknown").map((severity) => {
                  const value = prediction.probabilities[severity] ?? 0;
                  return (
                    <div key={severity}>
                      <div className="mb-2 flex justify-between text-sm font-bold">
                        <span>{SEVERITY_LABEL_ID[severity]}</span>
                        <span>{Math.round(value * 100)}%</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-radar-cyan" style={{ width: `${Math.round(value * 100)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm font-bold text-radar-muted">
                Diproses melalui RADAR AI fallback/lokal. Produksi menargetkan MobileNetV3-Small lokal tanpa API vision pihak ketiga.
              </p>
            </section>
          </div>

          <aside className="grid h-fit gap-6">
            <section className="panel">
              <h2 className="text-xl font-black text-radar-navy">Panel Validasi Operator</h2>
              {success && <p className="mt-3 rounded-xl bg-green-50 p-3 text-sm font-bold text-radar-green">{success}</p>}
              {actionError && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-bold text-radar-red">{actionError}</p>}
              <button
                className="btn-success mt-4 w-full"
                disabled={isActing}
                onClick={() => runAction(() => validateReport(report.id, { action: "confirm_ai", note: "AI dikonfirmasi oleh operator demo." }), "AI berhasil dikonfirmasi.")}
              >
                <CheckCircle2 className="h-4 w-4" /> Confirm AI
              </button>

              <div className="mt-5 rounded-2xl border border-radar-border p-4">
                <h3 className="font-black text-radar-navy">Override Severity</h3>
                <select className="field mt-3 w-full" value={overrideSeverity} onChange={(event) => setOverrideSeverity(event.target.value as Severity)}>
                  {SEVERITY.filter((severity) => severity !== "unknown").map((severity) => <option key={severity} value={severity}>{SEVERITY_LABEL_ID[severity]}</option>)}
                </select>
                <textarea className="field mt-3 w-full resize-none" rows={3} placeholder="Catatan wajib override" value={overrideNote} onChange={(event) => setOverrideNote(event.target.value)} />
                <button
                  className="btn-warning mt-3 w-full"
                  disabled={isActing || overrideNote.trim().length < 3}
                  onClick={() => runAction(() => validateReport(report.id, { action: "override", severityFinal: overrideSeverity, note: overrideNote }), "Severity berhasil dioverride.")}
                >
                  Override Severity
                </button>
              </div>

              <div className="mt-5 rounded-2xl border border-radar-border p-4">
                <h3 className="font-black text-radar-navy">Reject Report</h3>
                <textarea className="field mt-3 w-full resize-none" rows={3} placeholder="Catatan wajib reject" value={rejectNote} onChange={(event) => setRejectNote(event.target.value)} />
                <button
                  className="btn-danger mt-3 w-full"
                  disabled={isActing || rejectNote.trim().length < 3}
                  onClick={() => runAction(() => rejectReport(report.id, { note: rejectNote }), "Laporan ditolak.")}
                >
                  <XCircle className="h-4 w-4" /> Reject Report
                </button>
              </div>
              <button className="btn mt-4 w-full border border-radar-border bg-white text-radar-navy" disabled>
                <Info className="h-4 w-4" /> Request More Info (visual)
              </button>
            </section>

            <section className="panel">
              <h2 className="text-xl font-black text-radar-navy">Timeline</h2>
              <div className="mt-4 grid gap-3 text-sm">
                <p className="flex gap-2"><Clock className="h-4 w-4 text-radar-cyan" /> Dibuat: {new Date(report.createdAt).toLocaleString("id-ID")}</p>
                <p className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-radar-green" /> AI: {report.aiPrediction ? "completed fallback" : "pending/demo data"}</p>
                {report.status === "escalated" && <p className="flex gap-2"><AlertTriangle className="h-4 w-4 text-radar-orange" /> Eskalasi demo aktif</p>}
                {report.validatedAt && <p className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-radar-green" /> Validasi: {new Date(report.validatedAt).toLocaleString("id-ID")}</p>}
                {report.rejectedAt && <p className="flex gap-2"><XCircle className="h-4 w-4 text-radar-red" /> Ditolak: {new Date(report.rejectedAt).toLocaleString("id-ID")}</p>}
                {report.validationNote && <p className="rounded-xl bg-slate-50 p-3 font-bold text-radar-muted">{report.validationNote}</p>}
              </div>
            </section>
          </aside>
        </div>
      </AuthGuard>
    </AppShell>
  );
}
