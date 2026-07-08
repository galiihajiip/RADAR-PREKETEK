import { NextRequest, NextResponse } from "next/server";
import { getReportById } from "@/lib/reports-repo";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = await getReportById(id);
  if (!report) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: "Laporan tidak ditemukan." } },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true, data: report });
}
