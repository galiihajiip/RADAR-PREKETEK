import { NextResponse } from "next/server";
import { reports } from "@/lib/demo-data";

export function GET() {
  return NextResponse.json({
    success: true,
    data: reports.map((r) => ({
      id: r.id,
      localId: r.localId,
      reporterName: r.reporterName,
      address: r.address,
      description: r.description,
      latitude: r.latitude,
      longitude: r.longitude,
      severity: r.severity,
      severityFinal: r.severityFinal ?? null,
      confidence: r.confidence,
      status: r.status,
      syncStatus: r.syncStatus,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      validatedAt: r.validatedAt ?? null,
      rejectedAt: r.rejectedAt ?? null,
      validationNote: r.validationNote ?? null,
    })),
  });
}
