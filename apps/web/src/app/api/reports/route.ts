import { NextRequest, NextResponse } from "next/server";
import type { ReportStatus, Severity } from "@radar/shared";
import { createReport, getReports } from "@/lib/reports-repo";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const severity = (searchParams.get("severity") || undefined) as Severity | undefined;
  const status = (searchParams.get("status") || undefined) as ReportStatus | undefined;
  const min = searchParams.get("min_confidence");
  const requestedLimit = Number(searchParams.get("limit") ?? 80);
  const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 250) : 80;
  const q = searchParams.get("q") ?? undefined;
  const data = await getReports({ severity, status, minConfidence: min ? Number(min) : undefined, q, limit });
  return NextResponse.json({ success: true, data });
}

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const body: Record<string, unknown> = {};
    for (const [key, value] of form.entries()) {
      if (key !== "image" && typeof value === "string") body[key] = value;
    }
    const file = form.get("image");
    const image =
      file instanceof File && file.size > 0
        ? { buffer: Buffer.from(await file.arrayBuffer()), contentType: file.type || "application/octet-stream" }
        : undefined;
    const created = await createReport(body, image);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  }

  const body = await request.json().catch(() => ({}));
  const created = await createReport(body);
  return NextResponse.json({ success: true, data: created }, { status: 201 });
}
