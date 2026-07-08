import { AuthGuard } from "@/components/auth-guard";
import { AppShell } from "@/components/shell";
import { RoleBadge, SectionHeader } from "@/components/ui";

export default function AdminPage() {
  return (
    <AppShell>
      <AuthGuard allowed={["admin"]}>
      <SectionHeader title="Admin Console" description="Audit, demo credentials, escalation simulation, and operational guardrails." />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="panel"><RoleBadge role="citizen" /><p className="mt-3 font-bold text-radar-navy">citizen@radar.demo</p><p className="mt-1 text-sm text-radar-muted">Submit reports and offline queue.</p></div>
        <div className="panel"><RoleBadge role="operator" /><p className="mt-3 font-bold text-radar-navy">operator@radar.demo</p><p className="mt-1 text-sm text-radar-muted">Dashboard, validation, export.</p></div>
        <div className="panel"><RoleBadge role="admin" /><p className="mt-3 font-bold text-radar-navy">admin@radar.demo</p><p className="mt-1 text-sm text-radar-muted">Escalation and audit controls.</p></div>
      </div>
      <div className="dark-surface mt-6 rounded-2xl p-6 shadow-soft">
        <h2 className="text-xl font-black text-white">Escalation simulation</h2>
        <p className="mt-2 text-slate-300">Admin can simulate a high-priority notification to show operator response without depending on external realtime infrastructure.</p>
        <button className="btn-danger mt-4">Simulate critical escalation</button>
      </div>
      </AuthGuard>
    </AppShell>
  );
}
