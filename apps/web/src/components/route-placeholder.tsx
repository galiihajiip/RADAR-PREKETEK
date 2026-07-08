import { MapPinned } from "lucide-react";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth-guard";
import { SectionHeader } from "@/components/ui";

type RoutePlaceholderProps = {
  route: string;
};

export function RoutePlaceholder({ route }: RoutePlaceholderProps) {
  return (
    <AppShell>
      <AuthGuard allowed={["operator", "admin"]}>
        <SectionHeader title="Peta Krisis" description="Peta geospasial sebaran laporan kerusakan." />
        <div className="panel">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-cyan-50 text-radar-cyan">
            <MapPinned className="h-6 w-6" aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-xl font-black text-radar-navy">Peta belum tersedia di demo ini</h2>
          <p className="mt-2 max-w-2xl text-sm text-radar-muted">
            Halaman <span className="font-mono text-radar-navy">{route}</span> disiapkan untuk MVP demo. Integrasi peta
            interaktif (Leaflet/OpenStreetMap) direncanakan pada iterasi berikutnya sesuai roadmap di
            <span className="font-mono"> docs/LIMITATIONS.md</span>. Untuk saat ini, gunakan{" "}
            <a className="font-bold text-radar-blue hover:underline" href="/dashboard/reports">
              Daftar Laporan
            </a>{" "}
            untuk melihat lokasi tiap laporan.
          </p>
        </div>
      </AuthGuard>
    </AppShell>
  );
}
