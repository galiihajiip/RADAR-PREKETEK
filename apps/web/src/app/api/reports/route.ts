import { NextRequest, NextResponse } from "next/server";
import type { ReportStatus, Severity } from "@radar/shared";
import { createDemoReport, filterReports } from "@/lib/demo-data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const severity = (searchParams.get("severity") || undefined) as Severity | undefined;
  const status = (searchParams.get("status") || undefined) as ReportStatus | undefined;
  const min = searchParams.get("min_confidence");
  const q = searchParams.get("q") ?? undefined;
  return NextResponse.json({ success: true, data: filterReports(severity, min ? Number(min) : undefined, q, status).slice(0, 250) });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const created = createDemoReport(body);
  return NextResponse.json({ success: true, data: created }, { status: 201 });
}
