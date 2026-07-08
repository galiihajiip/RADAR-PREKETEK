"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Activity, Bell, ShieldCheck } from "lucide-react";
import { RadarLogo } from "./ui";
import { SessionPill } from "./session-pill";
import { getDemoUser } from "@/lib/demo-auth";
import { requireRole } from "@/lib/utils";
import type { Role } from "@radar/shared";

const links: Array<[string, string, Role[]]> = [
  ["/login", "Login", ["citizen", "operator", "admin"]],
  ["/report", "Citizen", ["citizen", "operator", "admin"]],
  ["/offline", "Queue", ["citizen", "operator", "admin"]],
  ["/dashboard", "Dashboard", ["operator", "admin"]],
  ["/analytics", "Analytics", ["operator", "admin"]],
  ["/admin", "Admin", ["admin"]]
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    const user = getDemoUser();
    setRole(user?.role ?? null);
  }, []);

  // Use "citizen" as fallback during initial render if not logged in
  // or only show login if not logged in? It's fine to let AuthGuard handle blocks.
  const activeRole = role ?? "citizen";

  return (
    <main className="min-h-screen overflow-x-hidden">
      <header className="sticky top-0 z-20 border-b border-radar-border bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link href="/" aria-label="RADAR home">
            <RadarLogo />
          </Link>
          <nav className="flex flex-wrap items-center gap-1 rounded-xl border border-radar-border bg-slate-50 p-1 text-sm font-bold">
            {links.filter(([_, __, allowed]) => requireRole(activeRole, allowed)).map(([href, label]) => (
              <Link key={href} className="rounded-lg px-3 py-2 text-radar-muted hover:bg-white hover:text-radar-navy hover:shadow-sm" href={href}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-2 text-xs font-black text-radar-green">
              <Activity className="h-3.5 w-3.5" /> Demo Live
            </span>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-radar-border bg-white text-radar-navy">
              <Bell className="h-4 w-4" />
            </span>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-radar-navy text-radar-cyan">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <SessionPill />
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-8">{children}</div>
    </main>
  );
}
