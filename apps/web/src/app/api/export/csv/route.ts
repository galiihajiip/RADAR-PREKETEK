import { NextResponse } from "next/server";
import { getReports } from "@/lib/reports-repo";

function esc(value: string) {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  const reports = await getReports({ limit: 5000 });
  const header = "report_id,title,severity_ai,severity_final,confidence,status,lat,lng,address,reported_at";
  const rows = reports.map((r) =>
    [
      r.id,
      esc(r.description?.slice(0, 80) ?? ""),
      r.severity,
      r.severityFinal ?? r.severity,
      r.confidence,
      r.status,
      r.latitude,
      r.longitude,
      esc(r.address),
      r.createdAt,
    ].join(",")
  );
  return new NextResponse([header, ...rows].join("\n"), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": "attachment; filename=radar-reports.csv",
    },
  });
}
