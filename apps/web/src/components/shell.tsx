"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Radio, ShieldCheck, Wifi, WifiOff, X } from "lucide-react";
import { RadarLogo } from "./ui";
import { SessionPill } from "./session-pill";
import { getDemoUser } from "@/lib/demo-auth";
import { requireRole } from "@/lib/utils";
import type { Role } from "@radar/shared";

const links: Array<[string, string, Role[]]> = [
  ["/", "Beranda", ["citizen", "operator", "admin"]],
  ["/report", "Lapor Kerusakan", ["citizen", "operator", "admin"]],
  ["/dashboard/map", "Peta Krisis", ["operator", "admin"]],
  ["/dashboard", "Dashboard", ["operator", "admin"]],
  ["/dashboard/analytics", "Data & Ekspor", ["operator", "admin"]],
  ["/offline", "Antrean Offline", ["citizen", "operator", "admin"]]
];

function formatDate(date: Date) {
  return date
    .toLocaleDateString("id-ID", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })
    .toUpperCase();
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("id-ID", { hour12: false });
}

function TopStatusBar() {
  const [now, setNow] = useState<Date | null>(null);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setNow(new Date());
    setOnline(typeof navigator !== "undefined" ? navigator.onLine : true);
    const timer = setInterval(() => setNow(new Date()), 1000);
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      clearInterval(timer);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="dark-surface border-b border-white/10 text-[11px] font-bold tracking-wide text-slate-200">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-1.5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>{now ? formatDate(now) : "MEMUAT TANGGAL..."}</span>
          <span className="hidden text-radar-cyan sm:inline">
            WAKTU SISTEM {now ? formatTime(now) : "--:--:--"}
          </span>
          <span className="hidden text-slate-400 md:inline">LAST SYNC DEMO 07:20 UTC</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 ${online ? "text-radar-green" : "text-radar-orange"}`}>
            {online ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {online ? "ONLINE" : "OFFLINE"}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2 py-0.5 text-radar-cyan">
            <Radio className="h-3 w-3" /> RADAR DEMO MODE
          </span>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const user = getDemoUser();
    setRole(user?.role ?? null);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const activeRole = role ?? "citizen";
  const visibleLinks = links.filter(([, , allowed]) => requireRole(activeRole, allowed));

  return (
    <main className="min-h-screen overflow-x-hidden bg-radar-bg">
      <TopStatusBar />
      <header className="sticky top-0 z-20 border-b border-radar-border bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link href="/" aria-label="RADAR beranda">
            <RadarLogo />
          </Link>

          <nav aria-label="Navigasi utama" className="hidden items-center gap-1 rounded-xl border border-radar-border bg-slate-50 p-1 text-sm font-bold lg:flex">
            {visibleLinks.map(([href, label]) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  className={`rounded-lg px-3 py-2 transition ${
                    active ? "bg-radar-navy text-white shadow-sm" : "text-radar-muted hover:bg-white hover:text-radar-navy hover:shadow-sm"
                  }`}
                  href={href}
                  aria-current={active ? "page" : undefined}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link href="/report" className="btn-warning">
              Laporkan Kerusakan
            </Link>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-radar-navy text-radar-cyan" aria-hidden="true">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <SessionPill />
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-radar-border text-radar-navy lg:hidden"
            aria-label={menuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {menuOpen && (
          <nav aria-label="Navigasi mobile" className="border-t border-radar-border bg-white px-4 py-4 lg:hidden">
            <div className="grid gap-1 text-sm font-bold">
              {visibleLinks.map(([href, label]) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    className={`min-h-11 rounded-lg px-3 py-3 ${active ? "bg-radar-navy text-white" : "text-radar-muted hover:bg-slate-50"}`}
                    href={href}
                    aria-current={active ? "page" : undefined}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Link href="/report" className="btn-warning flex-1 justify-center">
                Laporkan Kerusakan
              </Link>
              <SessionPill />
            </div>
          </nav>
        )}
      </header>
      <div className="mx-auto max-w-7xl px-4 py-8">{children}</div>
      <footer className="border-t border-radar-border bg-white px-4 py-6 text-center text-xs text-radar-muted">
        RADAR — Rapid Artificial Intelligence Damage Assessment and Response. Sistem demo hackathon; data dan sebagian layanan menggunakan simulasi.
      </footer>
    </main>
  );
}
