import { NextResponse } from "next/server";
import { summary } from "@/lib/demo-data";

export function GET() {
  return NextResponse.json({ success: true, data: summary() });
}
