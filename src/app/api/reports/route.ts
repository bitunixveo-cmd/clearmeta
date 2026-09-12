import { NextRequest, NextResponse } from "next/server";
import { saveReport } from "@/lib/reports";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import type { ShareReport } from "@/lib/reports";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { ok } = rateLimit(`reports:${ip}`, 20, 60_000);
  if (!ok) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again in a minute." },
      { status: 429 }
    );
  }

  try {
    const body = (await request.json()) as Omit<
      ShareReport,
      "id" | "createdAt" | "expiresAt"
    >;

    if (!body.type || !body.title || !body.originalFilename || !body.before) {
      return NextResponse.json(
        { error: "Missing required report fields" },
        { status: 400 }
      );
    }

    const report = await saveReport(body);

    return NextResponse.json({
      id: report.id,
      shareUrl: `/report/${report.id}`,
      expiresAt: report.expiresAt,
    });
  } catch (error) {
    console.error("Report create error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create report" },
      { status: 500 }
    );
  }
}
