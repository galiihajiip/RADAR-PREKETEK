"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/shell";
import { RoleBadge } from "@/components/ui";
import { getDemoUser, type DemoUser } from "@/lib/demo-auth";

export default function UnauthorizedPage() {
  const [user, setUser] = useState<DemoUser | null>(null);

  useEffect(() => {
    setUser(getDemoUser());
  }, []);

  return (
    <AppShell>
      <div className="mx-auto max-w-xl">
        <div className="panel text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-orange-50 text-radar-orange">
            <ShieldAlert className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-2xl font-black text-radar-navy">Akses tidak tersedia untuk peran Anda</h1>
          <p className="mt-2 text-sm text-radar-muted">
            Silakan masuk dengan akun yang sesuai untuk membuka halaman ini.
          </p>
          {user && (
            <p className="mt-3 text-sm text-radar-muted">
              Role aktif saat ini: <RoleBadge role={user.role} />
            </p>
          )}
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link className="btn-primary" href="/login">Pilih role demo</Link>
            <Link className="btn-warning" href="/">Kembali ke beranda</Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
