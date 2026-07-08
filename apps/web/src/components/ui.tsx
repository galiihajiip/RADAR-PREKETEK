import { Activity, AlertTriangle, CheckCircle2, Clock, Radio, Shield, TrendingUp, Wifi, WifiOff } from "lucide-react";
import { ROLES, SEVERITY_COLORS, SEVERITY_LABEL_ID, type Role, type Severity } from "@radar/shared";
import { cn } from "@/lib/utils";

export function RadarLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-12 w-12 place-items-center rounded-full border border-blue-100 bg-white text-radar-blue shadow-sm">
        <Shield aria-hidden className="h-6 w-6" />
      </div>
      {!compact && (
        <div>
          <div className="text-lg font-black tracking-tight text-radar-navy">RADAR</div>
          <div className="max-w-[220px] text-xs font-bold uppercase leading-5 text-radar-navy">
            Sistem Asesmen Kerusakan Pascabencana
          </div>
        </div>
      )}
    </div>
  );
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span
      className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-black"
      style={{ borderColor: SEVERITY_COLORS[severity], color: SEVERITY_COLORS[severity], backgroundColor: `${SEVERITY_COLORS[severity]}14` }}
    >
      {SEVERITY_LABEL_ID[severity]}
    </span>
  );
}

export function OnlineStatusBadge({ online }: { online: boolean }) {
  const Icon = online ? Wifi : WifiOff;
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${online ? "bg-green-50 text-radar-green" : "bg-orange-50 text-radar-orange"}`}>
      <Icon className="h-3.5 w-3.5" /> {online ? "Online" : "Offline queued"}
    </span>
  );
}

export function RoleBadge({ role }: { role: Role }) {
  return <span className="rounded-full border border-radar-border bg-slate-50 px-3 py-1 text-xs font-black capitalize text-radar-navy">{ROLES.includes(role) ? role : "citizen"}</span>;
}

export function MetricCard({ label, value, delta, tone = "blue" }: { label: string; value: string | number; delta?: string; tone?: "blue" | "red" | "green" | "orange" }) {
  const color = tone === "red" ? "text-radar-red" : tone === "green" ? "text-radar-green" : tone === "orange" ? "text-radar-orange" : "text-radar-blue";
  const bg = tone === "red" ? "bg-red-50" : tone === "green" ? "bg-green-50" : tone === "orange" ? "bg-orange-50" : "bg-cyan-50";
  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-radar-muted">{label}</p>
        <span className={`grid h-9 w-9 place-items-center rounded-xl ${bg}`}>
          <Activity className={`h-5 w-5 ${color}`} />
        </span>
      </div>
      <div className="mt-4 text-3xl font-black tabular-nums text-radar-navy">{value}</div>
      {delta && <p className="mt-2 flex items-center gap-1 text-sm font-bold text-radar-muted"><TrendingUp className="h-3.5 w-3.5" />{delta}</p>}
    </div>
  );
}

export function SectionHeader({ title, description, eyebrow }: { title: string; description?: string; eyebrow?: string }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div>
        {eyebrow && <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-radar-cyan">{eyebrow}</p>}
        <h1 className="text-2xl font-black tracking-tight text-radar-navy sm:text-3xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-radar-muted">{description}</p>}
      </div>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="panel text-center">
      <Radio className="mx-auto h-9 w-9 text-radar-cyan" />
      <h2 className="mt-3 font-bold">{title}</h2>
      <p className="mt-1 text-sm text-radar-muted">{description}</p>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="panel animate-pulse">
      <Clock className="h-6 w-6 text-radar-cyan" />
      <div className="mt-4 h-4 w-2/3 rounded bg-slate-200" />
      <div className="mt-2 h-4 w-1/2 rounded bg-slate-200" />
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className={cn("panel border-red-200 bg-red-50 text-radar-red")}>
      <AlertTriangle className="h-6 w-6" />
      <p className="mt-2 font-semibold">{message}</p>
    </div>
  );
}

export function SuccessLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-sm font-semibold text-radar-green">
      <CheckCircle2 className="h-4 w-4" /> {children}
    </p>
  );
}
