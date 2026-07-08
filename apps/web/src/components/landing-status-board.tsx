"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, ArrowLeft, ArrowRight, CloudRain, Home, Loader2, Sun } from "lucide-react";
import { SEVERITY_LABEL_ID, type ApiResponse, type DamageReport, type Severity } from "@radar/shared";
import { SeverityBadge } from "@/components/ui";

const FALLBACK_REPORTS: Array<Pick<DamageReport, "id" | "address" | "createdAt" | "confidence" | "severity" | "description">> = [
  {
    id: "landing-fallback-1",
    address: "Cugenang, Cianjur",
    createdAt: "2026-07-08T08:20:00.000Z",
    confidence: 0.87,
    severity: "major_damage",
    description: "Rumah retak berat dan akses jalan terbatas."
  },
  {
    id: "landing-fallback-2",
    address: "Pacet, Cianjur",
    createdAt: "2026-07-08T08:10:00.000Z",
    confidence: 0.91,
    severity: "destroyed",
    description: "Bangunan roboh sebagian, perlu verifikasi cepat."
  },
  {
    id: "landing-fallback-3",
    address: "Warungkondang, Cianjur",
    createdAt: "2026-07-08T07:55:00.000Z",
    confidence: 0.72,
    severity: "minor_damage",
    description: "Kerusakan ringan dan kebutuhan logistik warga."
  }
];

const PERIODS = ["Saat ini", "Hari ini", "Besok", "Lusa"] as const;

function areaName(address: string) {
  return address.split(",")[0]?.trim() || "Cianjur";
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
}

function iconForSeverity(severity: Severity) {
  if (severity === "destroyed") return AlertTriangle;
  if (severity === "major_damage") return CloudRain;
  if (severity === "minor_damage") return Home;
  return Sun;
}

function warningFromReport(report: Pick<DamageReport, "address" | "createdAt" | "confidence" | "severity" | "description">, index: number) {
  return {
    id: `${report.address}-${index}`,
    title: `Peringatan Dini Kerusakan ${areaName(report.address)}`,
    href: `/dashboard/reports?severity=${report.severity}`,
    text: `${formatTime(report.createdAt)}: ${SEVERITY_LABEL_ID[report.severity]} terdeteksi dengan confidence ${Math.round(report.confidence * 100)}%. ${report.description}`
  };
}

export function LandingStatusBoard() {
  const [reports, setReports] = useState(FALLBACK_REPORTS);
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>("Saat ini");
  const [warningIndex, setWarningIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/reports?min_confidence=0.5&limit=12", { cache: "no-store" })
      .then(async (response) => {
        const payload = (await response.json()) as ApiResponse<DamageReport[]>;
        if (!payload.success) throw new Error(payload.error.message);
        if (active && payload.data.length > 0) {
          setReports(payload.data.slice(0, 12));
        }
      })
      .catch(() => {
        if (active) setReports(FALLBACK_REPORTS);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const warnings = useMemo(() => {
    const priority = reports
      .filter((report) => report.severity === "destroyed" || report.severity === "major_damage")
      .slice(0, 5);
    return (priority.length ? priority : reports.slice(0, 3)).map(warningFromReport);
  }, [reports]);

  const activeWarning = warnings[warningIndex % warnings.length];

  function moveWarning(direction: -1 | 1) {
    setWarningIndex((current) => (current + direction + warnings.length) % warnings.length);
  }

  function scrollCards(direction: -1 | 1) {
    scrollerRef.current?.scrollBy({ left: direction * 310, behavior: "smooth" });
  }

  return (
    <>
      <div className="mt-10 flex flex-wrap items-center justify-start gap-3 lg:justify-end">
        {PERIODS.map((label) => (
          <button
            key={label}
            className={`min-h-12 rounded-xl border px-6 text-sm font-bold transition ${
              period === label
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700"
            }`}
            onClick={() => setPeriod(label)}
            type="button"
          >
            {label}
          </button>
        ))}
        <Link className="inline-flex min-h-12 items-center gap-2 px-2 text-sm font-black text-blue-700" href="/dashboard/map">
          Lihat Semuanya <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      <div className="mt-12 overflow-hidden rounded-2xl border border-orange-400 bg-orange-50">
        <div className="grid grid-cols-[50px_1fr_50px] items-stretch">
          <button className="grid place-items-center border-r border-orange-300 text-orange-600" onClick={() => moveWarning(-1)} type="button" aria-label="Peringatan sebelumnya">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex flex-col gap-3 px-6 py-7 sm:flex-row sm:items-start">
            <AlertTriangle className="mt-1 h-8 w-8 shrink-0 text-orange-500" aria-hidden="true" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-black text-slate-950">{activeWarning.title}</h2>
                {loading && <Loader2 className="h-4 w-4 animate-spin text-orange-500" aria-label="Memuat data laporan" />}
              </div>
              <p className="mt-3 text-base font-semibold leading-7 text-slate-600">
                {period === "Saat ini" || period === "Hari ini"
                  ? activeWarning.text
                  : `${period}: belum ada prakiraan otomatis. Demo menampilkan data laporan terkini sebagai acuan operator.`}
              </p>
              <Link className="mt-2 inline-flex font-black text-blue-700" href={activeWarning.href}>
                Selengkapnya -&gt;
              </Link>
            </div>
          </div>
          <button className="grid place-items-center border-l border-orange-300 text-orange-600" onClick={() => moveWarning(1)} type="button" aria-label="Peringatan berikutnya">
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="relative mt-12">
        <button
          className="absolute -left-5 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm lg:grid"
          onClick={() => scrollCards(-1)}
          type="button"
          aria-label="Geser kartu ke kiri"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div ref={scrollerRef} className="flex snap-x gap-6 overflow-x-auto scroll-smooth pb-3">
          {reports.map((report) => {
            const Icon = iconForSeverity(report.severity);
            return (
              <article key={report.id} className="relative min-h-[300px] w-[268px] shrink-0 snap-start overflow-hidden rounded-2xl border border-blue-100 bg-blue-50 p-6 text-center shadow-sm">
                <div className="absolute -right-12 bottom-0 h-36 w-36 rounded-full border border-white/70" />
                <div className="absolute -right-4 top-24 h-28 w-28 rounded-full border border-white/70" />
                <h2 className="text-xl font-black text-slate-950">{areaName(report.address)}</h2>
                <p className="mt-2 text-sm font-bold text-slate-500">{formatTime(report.createdAt)}</p>
                <div className="mt-8 grid place-items-center text-radar-blue">
                  <Icon className="h-14 w-14" strokeWidth={1.8} />
                </div>
                <p className="mt-7 text-4xl font-black tracking-tight text-slate-950">{Math.round(report.confidence * 100)}%</p>
                <p className="mt-4 text-sm font-bold text-slate-700">{SEVERITY_LABEL_ID[report.severity]}</p>
                <div className="mt-4 flex justify-center">
                  <SeverityBadge severity={report.severity} />
                </div>
              </article>
            );
          })}
        </div>
        <button
          className="absolute -right-5 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm lg:grid"
          onClick={() => scrollCards(1)}
          type="button"
          aria-label="Geser kartu ke kanan"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </>
  );
}
