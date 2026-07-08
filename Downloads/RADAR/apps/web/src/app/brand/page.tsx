import { SEVERITY } from "@radar/shared";
import { AppShell } from "@/components/shell";
import { EmptyState, ErrorState, LoadingState, MetricCard, OnlineStatusBadge, RoleBadge, SectionHeader, SeverityBadge } from "@/components/ui";

export default function BrandPage() {
  return (
    <AppShell>
      <SectionHeader title="RADAR Design System" description="Living style guide for tokens and reusable UI." />
      <div className="panel flex flex-wrap gap-3">
        {SEVERITY.map((severity) => <SeverityBadge key={severity} severity={severity} />)}
        <OnlineStatusBadge online />
        <OnlineStatusBadge online={false} />
        <RoleBadge role="citizen" />
        <RoleBadge role="operator" />
        <RoleBadge role="admin" />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <MetricCard label="Metric" value="128" delta="+12%" />
        <LoadingState />
        <ErrorState message="Example recoverable error" />
      </div>
      <div className="mt-6"><EmptyState title="Empty state" description="Clear, calm, and actionable." /></div>
    </AppShell>
  );
}
