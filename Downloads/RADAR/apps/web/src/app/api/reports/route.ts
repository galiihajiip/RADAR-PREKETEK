import { NextRequest, NextResponse } from "next/server";
import { filterReports, reports } from "@/lib/demo-data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const severity = searchParams.get("severity") as never;
  const min = searchParams.get("min_confidence");
  const q = searchParams.get("q") ?? undefined;
  return NextResponse.json({ success: true, data: filterReports(severity, min ? Number(min) : undefined, q) });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const existing = reports.find((report) => report.localId === body.localId);
  if (existing) return NextResponse.json({ success: true, data: existing }, { status: 200 });

  const created = {
    ...reports[0],
    id: `rpt-${Date.now()}`,
    localId: body.localId ?? `local-${Date.now()}`,
    reporterName: body.reporterName ?? "Demo Citizen",
    address: body.address ?? "Cianjur",
    description: body.description ?? "Demo report created in fallback mode.",
    status: "ai_pending" as const,
    syncStatus: "synced" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return NextResponse.json({ success: true, data: created }, { status: 201 });
}
