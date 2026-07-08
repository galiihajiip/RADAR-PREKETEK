"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogOut, Radio, User } from "lucide-react";
import { AppShell } from "@/components/shell";
import { RoleBadge, SectionHeader } from "@/components/ui";
import { clearDemoUser, getDemoUser, type DemoUser } from "@/lib/demo-auth";
import { getQueueCounts } from "@/lib/offline-queue";

export default function SettingsPage() {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [counts, setCounts] = useState({ total: 0, pending: 0, synced: 0, failed: 0 });

  useEffect(() => {
    setUser(getDemoUser());
    setCounts(getQueueCounts());
  }, []);

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <SectionHeader title="Pengaturan" description="Profil demo, mode aplikasi, dan status antrean offline." />

        <div className="panel">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-radar-navy text-radar-cyan">
              <User className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              {user ? (
                <>
                  <p className="font-black text-radar-navy">{user.name}</p>
                  <p className="text-sm text-radar-muted">{user.email}</p>
                </>
              ) : (
                <p className="font-bold text-radar-muted">Belum login</p>
              )}
            </div>
            {user && <RoleBadge role={user.role} />}
          </div>

          {!user && (
            <Link className="btn-primary mt-5 w-full" href="/login">
              Pilih role demo
            </Link>
          )}
        </div>

        <div className="panel mt-5">
          <h2 className="flex items-center gap-2 font-black text-radar-navy">
            <Radio className="h-4 w-4 text-radar-cyan" aria-hidden="true" /> Mode Aplikasi
          </h2>
          <p className="mt-2 text-sm text-radar-muted">
            RADAR Demo Mode aktif — sebagian data dan layanan menggunakan simulasi untuk kebutuhan MVP hackathon.
          </p>
        </div>

        <div className="panel mt-5">
          <h2 className="font-black text-radar-navy">Antrean Offline</h2>
          <div className="mt-3 grid grid-cols-4 gap-2 text-center text-sm">
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs font-black text-radar-muted">Total</p><p className="text-xl font-black">{counts.total}</p></div>
            <div className="rounded-xl bg-orange-50 p-3"><p className="text-xs font-black text-radar-muted">Pending</p><p className="text-xl font-black">{counts.pending}</p></div>
            <div className="rounded-xl bg-green-50 p-3"><p className="text-xs font-black text-radar-muted">Synced</p><p className="text-xl font-black">{counts.synced}</p></div>
            <div className="rounded-xl bg-red-50 p-3"><p className="text-xs font-black text-radar-muted">Failed</p><p className="text-xl font-black">{counts.failed}</p></div>
          </div>
          <Link className="btn-primary mt-4 w-full" href="/offline">
            Buka antrean offline
          </Link>
        </div>

        {user && (
          <button
            className="btn-danger mt-5 w-full"
            onClick={() => {
              clearDemoUser();
              window.location.href = "/login";
            }}
          >
            <LogOut className="h-4 w-4" aria-hidden="true" /> Keluar
          </button>
        )}
      </div>
    </AppShell>
  );
}
