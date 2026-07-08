import { NextRequest, NextResponse } from "next/server";
import type { ReportStatus, Severity } from "@radar/shared";
import { createReport, getReports } from "@/lib/reports-repo";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const severity = (searchParams.get("severity") || undefined) as Severity | undefined;
  const status = (searchParams.get("status") || undefined) as ReportStatus | undefined;
  const min = searchParams.get("min_confidence");
  const q = searchParams.get("q") ?? undefined;
  const data = await getReports({ severity, status, minConfidence: min ? Number(min) : undefined, q });
  return NextResponse.json({ success: true, data });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const created = await createReport(body);
  return NextResponse.json({ success: true, data: created }, { status: 201 });
}
