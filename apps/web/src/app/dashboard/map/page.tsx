"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Shield } from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { AppShell } from "@/components/shell";
import { EmptyState, LoadingState, SectionHeader } from "@/components/ui";
import { getReports } from "@/lib/api-client";
import type { DamageReport } from "@radar/shared";

const MapClient = dynamic(() => import("./map-client").then((mod) => mod.MapClient), {
  ssr: false,
  loading: () => <LoadingState />
});

export default function DashboardMapPage() {
  const [reports, setReports] = useState<DamageReport[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    getReports().then((data) => {
      if (!cancelled) setReports(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppShell>
      <AuthGuard allowed={["operator", "admin"]}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <SectionHeader title="Peta Krisis" description="Sebaran geospasial laporan kerusakan pascabencana." />
          <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-xs font-black text-radar-cyan">
            <Shield className="h-4 w-4" aria-hidden="true" />
            RADAR Demo Mode
          </span>
        </div>

        {reports === null ? (
          <LoadingState />
        ) : reports.length === 0 ? (
          <EmptyState title="Belum ada laporan" description="Buat laporan demo dari halaman Lapor Kerusakan untuk melihat titik di peta." />
        ) : (
          <MapClient reports={reports} />
        )}

        <div className="mt-6 rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-sm">
          <p className="font-black text-radar-navy">Catatan Peta</p>
          <p className="mt-1 text-radar-muted">
            Peta memakai Leaflet dengan tile OpenStreetMap dan data demo in-memory. Target produksi menambahkan
            layer PostGIS, clustering, dan filter status/confidence/tanggal penuh.
          </p>
        </div>
      </AuthGuard>
    </AppShell>
  );
}
