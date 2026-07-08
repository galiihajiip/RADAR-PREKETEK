"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Database, Menu, Phone, Radio, ShieldCheck, Wifi, WifiOff, X } from "lucide-react";
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
  ["/offline", "Offline", ["citizen", "operator", "admin"]]
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
    <div className="border-b border-slate-200 bg-slate-100 text-[11px] font-bold tracking-wide text-slate-600">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>{now ? formatDate(now) : "MEMUAT TANGGAL..."}</span>
          <span className="hidden text-radar-blue sm:inline">STANDAR WAKTU INDONESIA</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-sm font-black text-green-700 sm:inline">
            {now ? formatTime(now).split(".").join(" : ") : "-- : -- : --"}
          </span>
          <span className="hidden text-radar-navy sm:inline">/</span>
          <span className="hidden font-mono text-sm font-black text-green-700 sm:inline">
            {now ? now.toLocaleTimeString("id-ID", { timeZone: "UTC", hour12: false }).split(".").join(" : ") : "-- : -- : --"} UTC
          </span>
          <span className={`inline-flex items-center gap-1.5 ${online ? "text-radar-green" : "text-radar-orange"}`}>
            {online ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {online ? "ONLINE" : "OFFLINE"}
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
      <header className="sticky top-0 z-20 border-b border-radar-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-4 py-5">
          <Link href="/" aria-label="RADAR beranda">
            <RadarLogo />
          </Link>

          <nav aria-label="Navigasi utama" className="hidden items-center gap-8 text-base font-bold lg:flex">
            {visibleLinks.map(([href, label]) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  className={`transition ${
                    active ? "text-radar-blue" : "text-slate-600 hover:text-radar-blue"
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
            <Link href="/report" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-sm font-bold text-radar-navy shadow-sm transition hover:border-radar-blue hover:text-radar-blue">
              <Phone className="h-4 w-4" />
              Posko RADAR 112
            </Link>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-radar-border bg-slate-50 text-radar-cyan" aria-hidden="true">
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
                const active = pathname === href || (href !== "/" && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    className={`min-h-11 rounded-xl px-3 py-3 ${active ? "bg-slate-100 text-radar-navy" : "text-radar-muted hover:bg-slate-50"}`}
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
      <footer className="border-t border-radar-border bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 text-sm text-radar-muted md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <RadarLogo />
            <p className="mt-3 max-w-xl leading-6">
              RADAR adalah MVP hackathon untuk pelaporan, pemetaan, validasi, dan ekspor data kerusakan pascabencana.
              Demo ini transparan: sebagian layanan masih simulasi dan AI memakai fallback saat model lokal belum aktif.
            </p>
          </div>
          <div>
            <p className="font-black text-radar-navy">Akses Cepat</p>
            <div className="mt-3 grid gap-2">
              <Link className="hover:text-radar-navy" href="/report">Laporkan Kerusakan</Link>
              <Link className="hover:text-radar-navy" href="/dashboard/map">Peta Krisis</Link>
              <Link className="hover:text-radar-navy" href="/dashboard/analytics">Data & Ekspor</Link>
            </div>
          </div>
          <div>
            <p className="font-black text-radar-navy">Status Sistem</p>
            <div className="mt-3 grid gap-2">
              <span className="inline-flex items-center gap-2"><Database className="h-4 w-4 text-radar-cyan" /> Supabase/demo data siap</span>
              <span className="inline-flex items-center gap-2"><Radio className="h-4 w-4 text-radar-cyan" /> Mode demo aktif</span>
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-radar-cyan" /> Validasi operator wajib</span>
            </div>
          </div>
        </div>
        <div className="border-t border-radar-border px-4 py-4 text-center text-xs text-radar-muted">
          RADAR PREKETEK - Rapid Artificial Intelligence Damage Assessment and Response.
        </div>
      </footer>
    </main>
  );
}
