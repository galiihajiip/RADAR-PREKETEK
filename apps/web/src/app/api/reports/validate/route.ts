import { NextRequest, NextResponse } from "next/server";
import type { Severity } from "@radar/shared";
import { validateDemoReport } from "@/lib/demo-data";

export async function POST(request: NextRequest) {
  const role = request.headers.get("x-demo-role") ?? "citizen";
  if (!["operator", "admin"].includes(role)) {
    return NextResponse.json({ success: false, error: { code: "forbidden", message: "Operator role required." } }, { status: 403 });
  }
  const body = await request.json().catch(() => ({}));
  const reportId = String(body.reportId ?? body.id ?? "");
  const action = body.action === "reject" ? "reject" : body.action === "override" ? "override" : "confirm_ai";
  const note = typeof body.note === "string" ? body.note : undefined;
  const severityFinal = typeof body.severityFinal === "string" ? (body.severityFinal as Severity) : undefined;
  const report = validateDemoReport(reportId, action, note, severityFinal);
  if (!report) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: "Laporan tidak ditemukan." } },
      { status: 404 }
    );
  }
  return NextResponse.json({
    success: true,
    data: report
  });
}
