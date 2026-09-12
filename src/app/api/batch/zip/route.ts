import { NextRequest, NextResponse } from "next/server";
import { createZipFromIds } from "@/lib/batch";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { ok } = rateLimit(`batch-zip:${ip}`, 10, 60_000);
  if (!ok) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again in a minute." },
      { status: 429 }
    );
  }

  try {
    const body = (await request.json()) as { ids?: string[] };
    const ids = body.ids?.filter(Boolean) ?? [];

    if (ids.length === 0) {
      return NextResponse.json(
        { error: "No file IDs provided" },
        { status: 400 }
      );
    }

    if (ids.length > 50) {
      return NextResponse.json(
        { error: "Maximum 50 files per ZIP" },
        { status: 400 }
      );
    }

    const { jobId, fileCount } = await createZipFromIds(ids);

    return NextResponse.json({
      jobId,
      fileCount,
      downloadUrl: `/api/batch/${jobId}/zip`,
    });
  } catch (error) {
    console.error("Batch zip error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create ZIP",
      },
      { status: 500 }
    );
  }
}
