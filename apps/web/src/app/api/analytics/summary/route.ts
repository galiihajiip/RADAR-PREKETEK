import { NextResponse } from "next/server";
import { getFullSummary } from "@/lib/reports-repo";

export async function GET() {
  return NextResponse.json({ success: true, data: await getFullSummary() });
}
