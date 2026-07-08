import Link from "next/link";
import {
  BadgeCheck,
  BrainCircuit,
  Database,
  Download,
  MapPinned,
  Radio,
  ShieldCheck,
  Smartphone,
  UserCheck
} from "lucide-react";
import { AppShell } from "@/components/shell";
import { LandingStatusBoard } from "@/components/landing-status-board";

const FEATURES = [
  ["PWA Offline-First", "Laporan tetap tersimpan di perangkat saat jaringan bermasalah.", Smartphone],
  ["AI Damage Assessment", "Estimasi awal severity untuk triase, bukan keputusan final.", BrainCircuit],
  ["Peta Krisis Leaflet", "Sebaran laporan ditampilkan di peta operator.", MapPinned],
  ["Validasi Operator", "Operator tetap menentukan keputusan akhir.", UserCheck],
  ["Supabase Realtime", "Struktur siap menuju penyimpanan laporan persisten.", Database],
  ["Ekspor CSV/GeoJSON", "Data bisa diuji di spreadsheet dan GIS.", Download]
] as const;

const FLOW_STEPS = [
  "Warga lapor",
  "Foto/GPS tersimpan",
  "AI memberi estimasi",
  "Operator validasi",
  "Bantuan diprioritaskan"
];

export default function HomePage() {
  return (
    <AppShell>
      <section className="py-4 sm:py-4">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-radar-blue">RADAR PREKETEK</p>
            <h1 className="mt-4 text-5xl font-black tracking-tight text-slate-950 sm:text-6xl">Kerusakan Saat Ini</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
              Sistem pelaporan dan pemetaan kerusakan pascabencana untuk membantu warga, relawan, dan operator posko
              memprioritaskan respons berdasarkan lokasi serta tingkat kerusakan.
            </p>
          </div>
        </div>

        <LandingStatusBoard />

        <div className="mt-10 flex flex-wrap gap-3">
          <Link className="btn-warning px-5" href="/report">
            Laporkan Kerusakan
          </Link>
          <Link className="btn-primary px-5" href="/dashboard">
            Buka Dashboard Operator
          </Link>
        </div>
      </section>

      <section className="grid gap-4 py-8 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border border-radar-border bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-radar-blue">Alur Utama</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">Dari laporan warga sampai prioritas bantuan</h2>
            </div>
            <ShieldCheck className="h-8 w-8 text-radar-blue" />
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-5">
            {FLOW_STEPS.map((step, index) => (
              <div key={step} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-700 text-sm font-black text-white">
                  {index + 1}
                </span>
                <p className="mt-3 text-sm font-bold leading-5 text-slate-800">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-radar-border bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-radar-blue">Status Sistem</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">Demo jujur, keputusan tetap manusia</h2>
            </div>
            <Radio className="h-8 w-8 text-radar-blue" />
          </div>
          <div className="mt-6 grid gap-3">
            <p className="rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-sm font-semibold leading-6 text-radar-blue">
              AI membantu triase awal. Keputusan akhir tetap melalui validasi operator.
            </p>
            <p className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm font-semibold leading-6 text-radar-orange">
              Mode demo dapat memakai fallback deterministik dan tidak diklaim sebagai model AI produksi.
            </p>
            <p className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold leading-6 text-radar-green">
              Struktur aplikasi siap untuk Supabase, peta Leaflet, export CSV/GeoJSON, dan audit trail.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-radar-blue">Kapabilitas MVP</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Layanan RADAR</h2>
          </div>
          <BadgeCheck className="h-8 w-8 text-radar-blue" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(([title, description, Icon]) => (
            <div key={title} className="rounded-2xl border border-radar-border bg-white p-5 shadow-sm">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-radar-blue">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-black text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
