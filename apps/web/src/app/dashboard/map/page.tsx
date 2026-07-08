"use client";

import dynamic from "next/dynamic";
import { Radio, Shield } from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { AppShell } from "@/components/shell";
import { EmptyState, LoadingState, SectionHeader } from "@/components/ui";
import { useLiveReports } from "@/lib/use-live-reports";

const MapClient = dynamic(() => import("./map-client").then((mod) => mod.MapClient), {
  ssr: false,
  loading: () => <LoadingState />
});

export default function DashboardMapPage() {
  const { reports, live } = useLiveReports();

  return (
    <AppShell>
      <AuthGuard allowed={["operator", "admin"]}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <SectionHeader title="Peta Krisis" description="Sebaran geospasial laporan kerusakan pascabencana." />
          {live ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-xs font-black text-radar-green">
              <Radio className="h-4 w-4 animate-pulse" aria-hidden="true" />
              Live (Realtime)
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-xs font-black text-radar-cyan">
              <Shield className="h-4 w-4" aria-hidden="true" />
              RADAR Demo Mode
            </span>
          )}
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
            {live
              ? "Peta memakai Leaflet dengan tile OpenStreetMap dan data PostGIS live via Supabase Realtime - titik baru muncul otomatis tanpa reload."
              : "Peta memakai Leaflet dengan tile OpenStreetMap dan data demo in-memory. Realtime aktif otomatis saat DEMO_MODE=false."}
          </p>
        </div>
      </AuthGuard>
    </AppShell>
  );
}
