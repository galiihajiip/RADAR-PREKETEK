import { NextResponse } from "next/server";
import { reports } from "@/lib/demo-data";

export function GET() {
  const header = "id,address,severity,status,confidence,longitude,latitude";
  const rows = reports.map((r) => [r.id, `"${r.address}"`, r.severity, r.status, r.confidence, r.longitude, r.latitude].join(","));
  return new NextResponse([header, ...rows].join("\n"), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": "attachment; filename=radar-demo-reports.csv"
    }
  });
}
