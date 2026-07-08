import Link from "next/link";
import { AuthGuard } from "@/components/auth-guard";
import { AppShell } from "@/components/shell";
import { EmptyState, SectionHeader } from "@/components/ui";
import { getAuditLog } from "@/lib/reports-repo";
import type { AuditEntry } from "@/lib/demo-data";
import {
  CheckCircle2,
  FileText,
  AlertTriangle,
  Bot,
  Shield,
  XCircle,
  Siren,
  RefreshCw,
} from "lucide-react";

// Live per-request data (Supabase or demo); must not be statically cached.
export const dynamic = "force-dynamic";

const ACTION_ICONS: Record<string, React.ElementType> = {
  report_created: FileText,
  ai_completed: Bot,
  validated: CheckCircle2,
  overridden: RefreshCw,
  rejected: XCircle,
  escalated: Siren,
  settings_changed: AlertTriangle,
};

const ACTION_COLORS: Record<string, string> = {
  report_created: "bg-cyan-50 text-radar-cyan",
  ai_completed: "bg-blue-50 text-radar-blue",
  validated: "bg-green-50 text-radar-green",
  overridden: "bg-orange-50 text-radar-orange",
  rejected: "bg-red-50 text-radar-red",
  escalated: "bg-red-50 text-radar-red",
  settings_changed: "bg-yellow-50 text-yellow-700",
};

function AuditIcon({ action }: { action: string }) {
  const Icon = ACTION_ICONS[action] ?? FileText;
  const color = ACTION_COLORS[action] ?? "bg-slate-100 text-radar-muted";
  return (
    <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${color}`}>
      <Icon className="h-4 w-4" />
    </div>
  );
}

function RolePill({ role }: { role: string }) {
  const color =
    role === "operator"
      ? "bg-blue-50 text-radar-blue"
      : role === "admin"
        ? "bg-radar-navy text-white"
        : role === "system"
          ? "bg-cyan-50 text-radar-cyan"
          : "bg-slate-100 text-radar-navy";
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${color}`}>
      {role}
    </span>
  );
}

export default async function DashboardAuditPage() {
  const auditLog = (await getAuditLog()).slice(0, 150);

  if (auditLog.length === 0) {
    return (
      <AppShell>
        <AuthGuard allowed={["operator", "admin"]}>
          <SectionHeader title="Audit Log" description="Riwayat aktivitas sistem RADAR." />
          <EmptyState title="Belum ada aktivitas audit" description="Audit log akan terisi seiring laporan dibuat dan divalidasi." />
        </AuthGuard>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <AuthGuard allowed={["operator", "admin"]}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <SectionHeader
            title="Audit Log"
            description="Riwayat aktivitas sistem RADAR — demo audit trail dari laporan dan validasi."
          />
          <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-xs font-black text-radar-cyan">
            <Shield className="h-4 w-4" aria-hidden />
            Demo Audit
          </span>
        </div>

        {/* Summary counts */}
        <div className="mb-6 flex flex-wrap gap-3">
          {Object.entries(
            auditLog.reduce<Record<string, number>>((acc, entry) => {
              acc[entry.action] = (acc[entry.action] ?? 0) + 1;
              return acc;
            }, {})
          ).map(([action, count]) => (
            <span
              key={action}
              className="inline-flex items-center gap-2 rounded-full border border-radar-border px-3 py-1.5 text-xs font-bold text-radar-navy"
            >
              <AuditIcon action={action} />
              {action.replace(/_/g, " ")}
              <span className="tabular font-black">{count}</span>
            </span>
          ))}
        </div>

        {/* Desktop table view */}
        <div className="hidden overflow-hidden rounded-2xl border border-radar-border bg-white shadow-sm lg:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-radar-muted">
              <tr>
                <th className="px-4 py-3">Waktu</th>
                <th className="px-4 py-3">Aksi</th>
                <th className="px-4 py-3">Aktor</th>
                <th className="px-4 py-3">Laporan</th>
                <th className="px-4 py-3">Catatan</th>
              </tr>
            </thead>
            <tbody>
              {auditLog.map((entry: AuditEntry) => (
                <tr key={entry.id} className="border-t border-radar-border">
                  <td className="whitespace-nowrap px-4 py-3 text-xs tabular text-radar-muted">
                    {new Date(entry.timestamp).toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <AuditIcon action={entry.action} />
                      <span className="font-bold text-radar-navy">{entry.actionLabel}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-radar-navy">{entry.actor}</span>
                      <RolePill role={entry.role} />
                    </div>
                  </td>
                  <td className="max-w-[180px] px-4 py-3">
                    {entry.reportId ? (
                      <Link
                        href={`/dashboard/reports/${entry.reportId}`}
                        className="text-sm font-bold text-radar-blue hover:underline"
                      >
                        {entry.reportTitle ?? entry.reportId}
                      </Link>
                    ) : (
                      <span className="text-radar-muted">—</span>
                    )}
                  </td>
                  <td className="max-w-[240px] px-4 py-3">
                    <p className="line-clamp-2 text-xs text-radar-muted">{entry.note ?? "—"}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card view */}
        <div className="grid gap-3 lg:hidden">
          {auditLog.map((entry: AuditEntry) => (
            <div key={entry.id} className="panel">
              <div className="flex items-start gap-3">
                <AuditIcon action={entry.action} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-black text-radar-navy">{entry.actionLabel}</span>
                    <RolePill role={entry.role} />
                  </div>
                  <p className="mt-1 text-xs text-radar-muted">{entry.actor}</p>
                </div>
                <p className="shrink-0 text-xs tabular text-radar-muted">
                  {new Date(entry.timestamp).toLocaleDateString("id-ID")}
                </p>
              </div>
              {entry.reportTitle && (
                <Link
                  href={`/dashboard/reports/${entry.reportId}`}
                  className="mt-2 block text-sm font-bold text-radar-blue hover:underline"
                >
                  {entry.reportTitle}
                </Link>
              )}
              {entry.note && (
                <p className="mt-1 line-clamp-2 text-xs text-radar-muted">{entry.note}</p>
              )}
            </div>
          ))}
        </div>

        {/* Demo notice */}
        <div className="mt-6 rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-sm">
          <p className="font-black text-radar-navy">Catatan Audit Demo</p>
          <p className="mt-1 text-radar-muted">
            Audit log ini diturunkan dari data laporan demo. Pada produksi, setiap aksi akan dicatat ke tabel audit yang persisten di database.
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link href="/dashboard" className="btn-primary">
            ← Kembali ke Dashboard
          </Link>
        </div>
      </AuthGuard>
    </AppShell>
  );
}
