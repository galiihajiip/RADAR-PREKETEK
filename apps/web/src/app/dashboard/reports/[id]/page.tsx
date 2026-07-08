import { ReportDetailClient } from "./report-detail-client";

export default async function DashboardReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ReportDetailClient reportId={id} />;
}
