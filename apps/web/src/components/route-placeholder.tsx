import { Info } from "lucide-react";
import { AppShell } from "@/components/shell";
import { SectionHeader } from "@/components/ui";

type RoutePlaceholderProps = {
  route: string;
  title?: string;
  description?: string;
};

export function RoutePlaceholder({ route, title, description }: RoutePlaceholderProps) {
  return (
    <AppShell>
      <SectionHeader title={title ?? "Halaman Demo"} description={description ?? "Halaman ini disiapkan untuk MVP demo RADAR."} />
      <div className="panel">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-cyan-50 text-radar-cyan">
          <Info className="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-xl font-black text-radar-navy">Fitur ini belum lengkap di demo ini</h2>
        <p className="mt-2 max-w-2xl text-sm text-radar-muted">
          Halaman <span className="font-mono text-radar-navy">{route}</span> belum mengimplementasikan fitur penuh.
          Lihat <span className="font-mono">docs/LIMITATIONS.md</span> untuk roadmap produksi.
        </p>
      </div>
    </AppShell>
  );
}
