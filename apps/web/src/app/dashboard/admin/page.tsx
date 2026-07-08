import { AuthGuard } from "@/components/auth-guard";
import { AppShell } from "@/components/shell";
import { RoleBadge, SectionHeader } from "@/components/ui";
import { getFullSummary } from "@/lib/reports-repo";
import {
  Activity,
  AlertOctagon,
  ClipboardList,
  Database,
  FileText,
  Globe,
  Lock,
  Server,
  Settings,
  Shield,
  Siren,
  Sliders,
  Users,
} from "lucide-react";
import Link from "next/link";

// Live per-request data (Supabase or demo); must not be statically cached.
export const dynamic = "force-dynamic";

export default async function DashboardAdminPage() {
  const stats = await getFullSummary();

  return (
    <AppShell>
      <AuthGuard allowed={["admin"]}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <SectionHeader
            title="Admin Console"
            description="Pengaturan sistem, alat demo, dan tinjauan operasional RADAR."
          />
          <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-xs font-black text-radar-cyan">
            <Shield className="h-4 w-4" aria-hidden />
            RADAR Demo Mode
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* AI Service Status */}
          <div className="panel">
            <div className="flex items-start gap-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-green-50">
                <Activity className="h-5 w-5 text-radar-green" />
              </div>
              <div>
                <h2 className="font-black text-radar-navy">Status AI Service</h2>
                <p className="mt-1 text-sm text-radar-muted">
                  Layanan AI inference untuk klasifikasi kerusakan bangunan.
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-3">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
                <span className="font-bold text-radar-muted">Status</span>
                <span className="inline-flex items-center gap-2 font-black text-radar-green">
                  <Activity className="h-3.5 w-3.5" />
                  Demo Fallback Aktif
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
                <span className="font-bold text-radar-muted">Model Version</span>
                <span className="font-black text-radar-navy">mock-fallback-v1</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
                <span className="font-bold text-radar-muted">Target Produksi</span>
                <span className="font-black text-radar-navy">MobileNetV3-Small (lokal)</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
                <span className="font-bold text-radar-muted">Kelas Output</span>
                <span className="font-black text-radar-navy">4 kelas severity</span>
              </div>
            </div>
            <p className="mt-3 rounded-lg border border-orange-200 bg-orange-50 p-3 text-xs text-radar-orange">
              Mode demo: prediksi menggunakan fallback deterministik. Target produksi menggunakan inferensi lokal MobileNetV3-Small.
            </p>
          </div>

          {/* Data Sovereignty */}
          <div className="panel">
            <div className="flex items-start gap-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cyan-50">
                <Lock className="h-5 w-5 text-radar-cyan" />
              </div>
              <div>
                <h2 className="font-black text-radar-navy">Kedaulatan Data</h2>
                <p className="mt-1 text-sm text-radar-muted">
                  Prinsip pengelolaan data laporan kebencanaan RADAR.
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 text-sm">
              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                <Server className="mt-0.5 h-4 w-4 shrink-0 text-radar-cyan" />
                <p className="text-radar-muted">
                  <strong className="text-radar-navy">Inferensi Lokal:</strong> AI berjalan di server lokal, bukan API vision eksternal pihak ketiga.
                </p>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                <Database className="mt-0.5 h-4 w-4 shrink-0 text-radar-cyan" />
                <p className="text-radar-muted">
                  <strong className="text-radar-navy">Database Lokal:</strong> Target produksi PostgreSQL/PostGIS di infrastruktur yang dikelola sendiri.
                </p>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                <Globe className="mt-0.5 h-4 w-4 shrink-0 text-radar-cyan" />
                <p className="text-radar-muted">
                  <strong className="text-radar-navy">Ekspor Terbuka:</strong> Data dapat diekspor dalam format CSV dan GeoJSON untuk interoperabilitas.
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs text-radar-muted">
              Target produksi RADAR menggunakan inferensi lokal dan database yang dikelola sendiri agar data laporan kebencanaan tetap berada dalam kendali sistem.
            </p>
          </div>
        </div>

        {/* System Settings Preview */}
        <div className="mt-6 panel">
          <div className="flex items-start gap-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cyan-50">
              <Sliders className="h-5 w-5 text-radar-cyan" />
            </div>
            <div>
              <h2 className="font-black text-radar-navy">Pengaturan Sistem</h2>
              <p className="mt-1 text-sm text-radar-muted">
                Parameter operasional RADAR. Nilai ditampilkan sebagai preview demo.
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-radar-border p-4">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-radar-muted">AI Confidence Threshold</p>
              <p className="mt-2 text-2xl font-black tabular text-radar-navy">0.70</p>
              <p className="mt-1 text-xs text-radar-muted">Batas minimum confidence untuk klasifikasi otomatis.</p>
            </div>
            <div className="rounded-xl border border-radar-border p-4">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-radar-muted">Destroyed Escalation</p>
              <p className="mt-2 text-2xl font-black tabular text-radar-navy">0.85</p>
              <p className="mt-1 text-xs text-radar-muted">Threshold eskalasi otomatis untuk severity &quot;Hancur&quot;.</p>
            </div>
            <div className="rounded-xl border border-radar-border p-4">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-radar-muted">Escalation Radius</p>
              <p className="mt-2 text-2xl font-black tabular text-radar-navy">500m</p>
              <p className="mt-1 text-xs text-radar-muted">Radius cluster untuk deteksi eskalasi area.</p>
            </div>
            <div className="rounded-xl border border-radar-border p-4">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-radar-muted">Validation SLA</p>
              <p className="mt-2 text-2xl font-black tabular text-radar-navy">2 jam</p>
              <p className="mt-1 text-xs text-radar-muted">Target waktu maksimum validasi operator.</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-radar-red">
                <Siren className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-black text-radar-navy">Eskalasi Kritis</h2>
                <p className="mt-1 text-sm leading-6 text-radar-muted">
                  Live sebagai deteksi laporan hancur/confidence tinggi dan filter laporan prioritas. Notifikasi push belum diimplementasikan.
                </p>
                <Link className="btn-danger mt-4 w-full" href="/dashboard/reports?severity=destroyed">
                  Buka laporan kritis
                </Link>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-radar-cyan">
                <FileText className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-black text-radar-navy">Audit Trail</h2>
                <p className="mt-1 text-sm leading-6 text-radar-muted">
                  Sudah tampil sebagai log aktivitas laporan, AI, validasi, override, reject, dan eskalasi demo.
                </p>
                <Link className="btn-primary mt-4 w-full" href="/dashboard/audit">
                  Buka audit trail
                </Link>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-50 text-radar-blue">
                <ClipboardList className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-black text-radar-navy">Bedanya Admin</h2>
                <p className="mt-1 text-sm leading-6 text-radar-muted">
                  Admin bisa membuka console sistem dan audit. Operator fokus ke peta, daftar laporan, dan validasi.
                </p>
                <Link className="btn mt-4 w-full border border-radar-border bg-white text-radar-navy" href="/dashboard">
                  Lihat command center
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Tools */}
        <div className="mt-6 rounded-2xl border border-radar-border bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cyan-50">
              <Settings className="h-5 w-5 text-radar-cyan" />
            </div>
            <div>
              <h2 className="text-xl font-black text-radar-navy">Alat Demo</h2>
              <p className="mt-1 text-sm text-radar-muted">
                Simulasi dan pengaturan khusus untuk kebutuhan presentasi MVP.
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              className="btn flex items-center justify-center gap-2 bg-radar-red text-white opacity-60 cursor-not-allowed"
              disabled
              aria-label="Simulasi laporan hancur (belum tersedia)"
            >
              <AlertOctagon className="h-4 w-4" />
              Simulasi Push Eskalasi
              <span className="ml-1 rounded bg-white/20 px-2 py-0.5 text-[10px] font-bold">PLANNED</span>
            </button>
            <button
              className="btn flex items-center justify-center gap-2 bg-slate-600 text-white opacity-60 cursor-not-allowed"
              disabled
              aria-label="Reset demo seed (belum tersedia)"
            >
              <Database className="h-4 w-4" />
              Reset Demo Seed
              <span className="ml-1 rounded bg-white/20 px-2 py-0.5 text-[10px] font-bold">PLANNED</span>
            </button>
          </div>
          <p className="mt-3 text-xs text-radar-muted">
            Tombol di atas disiapkan sebagai placeholder untuk alat demo. Deteksi laporan kritis dan audit trail sudah ada; simulasi push eskalasi dan reset seed belum diimplementasikan di MVP ini.
          </p>
        </div>

        {/* User Role Overview */}
        <div className="mt-6">
          <h2 className="mb-4 text-xl font-black text-radar-navy">
            <Users className="mb-1 inline-block h-5 w-5 text-radar-cyan" /> Tinjauan User &amp; Role
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="panel">
              <RoleBadge role="citizen" />
              <p className="mt-3 font-bold text-radar-navy">citizen@radar.demo</p>
              <p className="mt-1 text-sm text-radar-muted">
                Membuat laporan kerusakan, mengelola offline queue, dan melihat status laporan.
              </p>
            </div>
            <div className="panel">
              <RoleBadge role="operator" />
              <p className="mt-3 font-bold text-radar-navy">operator@radar.demo</p>
              <p className="mt-1 text-sm text-radar-muted">
                Dashboard, validasi AI, override severity, export data, dan monitoring eskalasi.
              </p>
            </div>
            <div className="panel">
              <RoleBadge role="admin" />
              <p className="mt-3 font-bold text-radar-navy">admin@radar.demo</p>
              <p className="mt-1 text-sm text-radar-muted">
                Pengaturan sistem, audit log, demo tools, dan tinjauan operasional penuh.
              </p>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="mt-6 rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-sm">
          <p className="font-black text-radar-navy">Ringkasan Sistem Demo</p>
          <p className="mt-1 text-radar-muted">
            Total {stats.total.toLocaleString("id-ID")} laporan &middot;{" "}
            {stats.validated.toLocaleString("id-ID")} tervalidasi &middot;{" "}
            {stats.destroyed.toLocaleString("id-ID")} hancur total &middot;{" "}
            Data in-memory, tidak persisten antar restart.
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
