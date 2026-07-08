"use client";

import { useEffect, useState } from "react";
import { RotateCw, ServerCrash, Trash2 } from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { AppShell } from "@/components/shell";
import { EmptyState, OnlineStatusBadge, SectionHeader } from "@/components/ui";
import {
  deleteQueueItem,
  getQueue,
  getQueueCounts,
  retryQueueItem,
  syncPendingReports,
  type QueueItem
} from "@/lib/offline-queue";

export default function OfflinePage() {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setItems(getQueue());
  }, []);

  const counts = getQueueCounts();

  async function syncAll() {
    setIsSyncing(true);
    const queue = await syncPendingReports();
    setItems(queue);
    setIsSyncing(false);
  }

  async function retry(id: string) {
    setIsSyncing(true);
    const queue = await retryQueueItem(id);
    setItems(queue);
    setIsSyncing(false);
  }

  function remove(id: string) {
    setItems(deleteQueueItem(id));
  }

  return (
    <AppShell>
      <AuthGuard allowed={["citizen", "operator", "admin"]}>
      <SectionHeader title="Antrean Offline" description="Data laporan tetap aman di perangkat ini sampai berhasil disinkronkan." />
      {items.length ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="panel">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <OnlineStatusBadge online={counts.pending + counts.failed === 0} />
              <button className="btn-success" onClick={syncAll} disabled={isSyncing}>
                <RotateCw className="h-4 w-4" aria-hidden="true" /> {isSyncing ? "Menyinkronkan..." : "Sinkronkan Sekarang"}
              </button>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs font-black text-radar-muted">Total</p><p className="text-2xl font-black">{counts.total}</p></div>
              <div className="rounded-xl bg-orange-50 p-3"><p className="text-xs font-black text-radar-muted">Pending</p><p className="text-2xl font-black">{counts.pending}</p></div>
              <div className="rounded-xl bg-green-50 p-3"><p className="text-xs font-black text-radar-muted">Synced</p><p className="text-2xl font-black">{counts.synced}</p></div>
              <div className="rounded-xl bg-red-50 p-3"><p className="text-xs font-black text-radar-muted">Failed</p><p className="text-2xl font-black">{counts.failed}</p></div>
            </div>
            <div className="mt-5 grid gap-3">
              {items.map((item) => (
                <article
                  key={item.id}
                  className={`rounded-2xl border bg-white p-4 ${item.status === "failed" ? "border-radar-red bg-red-50/40" : "border-radar-border"}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-black text-radar-navy">{item.payload.address}</h2>
                      <p className="mt-1 text-sm text-radar-muted">{item.payload.description}</p>
                      <p className="mt-2 font-mono text-xs text-radar-muted">{item.local_id}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black uppercase ${
                        item.status === "failed"
                          ? "bg-red-100 text-radar-red"
                          : item.status === "synced"
                            ? "bg-green-50 text-radar-green"
                            : "bg-slate-100 text-radar-navy"
                      }`}
                    >
                      {item.status === "pending" ? "menunggu" : item.status === "syncing" ? "menyinkronkan" : item.status === "synced" ? "tersinkron" : "gagal"}
                    </span>
                  </div>
                  {item.last_error && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-bold text-radar-red">{item.last_error}</p>}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button className="btn-primary" onClick={() => retry(item.id)} disabled={isSyncing || item.status === "synced"}>
                      <RotateCw className="h-4 w-4" aria-hidden="true" /> Coba Lagi
                    </button>
                    <button className="btn-danger" onClick={() => remove(item.id)} aria-label={`Hapus laporan ${item.payload.address} dari antrean`}>
                      <Trash2 className="h-4 w-4" aria-hidden="true" /> Hapus
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="panel h-fit border-radar-orange bg-orange-50">
            <ServerCrash className="h-8 w-8 text-radar-orange" />
            <h3 className="mt-3 font-black text-radar-navy">Failure becomes a workflow</h3>
            <p className="mt-2 text-sm text-radar-muted">Block 2 masih memakai localStorage. Target produksi proposal adalah Service Worker dan IndexedDB.</p>
          </div>
        </div>
      ) : (
        <EmptyState title="Queue kosong" description="Buat laporan di /report untuk melihat item pending." />
      )}
      </AuthGuard>
    </AppShell>
  );
}
