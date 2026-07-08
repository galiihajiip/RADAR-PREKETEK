"use client";

import { useEffect, useState } from "react";
import { RotateCw, ServerCrash } from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { AppShell } from "@/components/shell";
import { EmptyState, OnlineStatusBadge, SectionHeader } from "@/components/ui";

export default function OfflinePage() {
  const [item, setItem] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("radar-last-report");
    setItem(raw ? JSON.parse(raw) : null);
  }, []);

  return (
    <AppShell>
      <AuthGuard allowed={["citizen", "operator", "admin"]}>
      <SectionHeader title="Offline Queue" description="Queue demo membuktikan laporan tidak hilang saat koneksi putus atau halaman direload." />
      {item ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="panel">
            <OnlineStatusBadge online={item.status === "synced"} />
            <h2 className="mt-4 text-2xl font-black text-radar-navy">{item.address}</h2>
            <p className="mt-2 text-radar-muted">{item.description}</p>
            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-radar-muted">Local queue payload</p>
              <p className="mt-2 font-mono text-sm text-radar-navy">{item.localId}</p>
            </div>
            <button className="btn-success mt-5" onClick={() => setItem({ ...item, status: "synced" })}><RotateCw className="h-4 w-4" /> Sinkronkan</button>
          </div>
          <div className="panel h-fit border-radar-orange bg-orange-50">
            <ServerCrash className="h-8 w-8 text-radar-orange" />
            <h3 className="mt-3 font-black text-radar-navy">Failure becomes a workflow</h3>
            <p className="mt-2 text-sm text-radar-muted">Saat jaringan atau Flask AI mati, laporan tetap aman dan bisa lanjut sebagai `ai_pending`.</p>
          </div>
        </div>
      ) : (
        <EmptyState title="Queue kosong" description="Buat laporan di /report untuk melihat item pending." />
      )}
      </AuthGuard>
    </AppShell>
  );
}
