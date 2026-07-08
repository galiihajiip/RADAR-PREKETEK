import { NextResponse } from "next/server";
import { fullSummary } from "@/lib/demo-data";

export function GET() {
  return NextResponse.json({ success: true, data: fullSummary() });
}
