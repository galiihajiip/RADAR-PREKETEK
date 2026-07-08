"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Role } from "@radar/shared";
import { getDemoUser } from "@/lib/demo-auth";
import { requireRole } from "@/lib/utils";
import { RoleBadge } from "./ui";

export function AuthGuard({ allowed, children }: { allowed: Role[]; children: React.ReactNode }) {
  const [state, setState] = useState<"loading" | "allowed" | "denied">("loading");
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    const user = getDemoUser();
    setRole(user?.role ?? null);
    setState(user && requireRole(user.role, allowed) ? "allowed" : "denied");
  }, [allowed]);

  if (state === "loading") {
    return <div className="panel min-h-48 animate-pulse" />;
  }

  if (state === "denied") {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="panel text-center">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-radar-muted">Access control</p>
          <h1 className="mt-2 text-3xl font-black text-radar-navy">Login role diperlukan</h1>
          <p className="mt-2 text-radar-muted">
            Halaman ini hanya untuk role {allowed.join(" / ")}. Role aktif: {role ? <RoleBadge role={role} /> : "belum login"}.
          </p>
          <Link className="btn-primary mt-5" href="/login">Pilih role demo</Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
