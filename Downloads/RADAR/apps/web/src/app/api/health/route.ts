import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "radar-web",
    demoMode: process.env.DEMO_MODE !== "false",
    aiServiceUrl: process.env.AI_SERVICE_URL ?? "http://localhost:5001"
  });
}
