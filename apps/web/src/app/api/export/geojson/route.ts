import { NextResponse } from "next/server";
import { getReports } from "@/lib/reports-repo";

export async function GET() {
  const reports = await getReports({ limit: 5000 });
  return NextResponse.json({
    type: "FeatureCollection",
    features: reports.map((report) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [report.longitude, report.latitude] },
      properties: {
        id: report.id,
        address: report.address,
        description: report.description,
        severity: report.severity,
        severityFinal: report.severityFinal ?? report.severity,
        status: report.status,
        confidence: report.confidence,
        reporterName: report.reporterName,
        createdAt: report.createdAt,
      },
    })),
  });
}
