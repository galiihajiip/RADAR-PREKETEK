import { NextResponse } from "next/server";
import { reports } from "@/lib/demo-data";

export function GET() {
  return NextResponse.json({
    type: "FeatureCollection",
    features: reports.map((report) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [report.longitude, report.latitude] },
      properties: {
        id: report.id,
        address: report.address,
        severity: report.severity,
        status: report.status,
        confidence: report.confidence
      }
    }))
  });
}
