import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const role = request.headers.get("x-demo-role") ?? "citizen";
  if (!["operator", "admin"].includes(role)) {
    return NextResponse.json({ success: false, error: { code: "forbidden", message: "Operator role required." } }, { status: 403 });
  }
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({
    success: true,
    data: {
      reportId: body.reportId,
      action: body.action ?? "confirm_ai",
      reviewerRole: role,
      status: "validated",
      reviewedAt: new Date().toISOString()
    }
  });
}
