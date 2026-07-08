import { AuthGuard } from "@/components/auth-guard";
import { AppShell } from "@/components/shell";
import { RoleBadge, SectionHeader } from "@/components/ui";

export default function AdminPage() {
  return (
    <AppShell>
      <AuthGuard allowed={["admin"]}>
      <SectionHeader title="Admin Console" description="Akun demo, simulasi eskalasi, dan batas operasional RADAR." />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="panel"><RoleBadge role="citizen" /><p className="mt-3 font-bold text-radar-navy">citizen@radar.demo</p><p className="mt-1 text-sm text-radar-muted">Membuat laporan dan mengelola antrean offline.</p></div>
        <div className="panel"><RoleBadge role="operator" /><p className="mt-3 font-bold text-radar-navy">operator@radar.demo</p><p className="mt-1 text-sm text-radar-muted">Dashboard, validasi, peta, dan ekspor data.</p></div>
        <div className="panel"><RoleBadge role="admin" /><p className="mt-3 font-bold text-radar-navy">admin@radar.demo</p><p className="mt-1 text-sm text-radar-muted">Kontrol eskalasi dan audit sistem.</p></div>
      </div>
      <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-6 shadow-sm">
        <h2 className="text-xl font-black text-radar-navy">Simulasi Eskalasi</h2>
        <p className="mt-2 text-sm leading-6 text-radar-muted">Admin dapat menyiapkan simulasi notifikasi prioritas tinggi tanpa bergantung pada infrastruktur realtime eksternal.</p>
        <button className="btn-danger mt-4">Simulasikan eskalasi kritis</button>
      </div>
      </AuthGuard>
    </AppShell>
  );
}
