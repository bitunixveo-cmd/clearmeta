import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import { getBatchZipPath } from "@/lib/batch";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;
    const zipPath = await getBatchZipPath(jobId);

    if (!zipPath) {
      return NextResponse.json(
        { error: "ZIP not found or expired" },
        { status: 404 }
      );
    }

    const buffer = await fs.readFile(zipPath);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="clearmeta-batch-${jobId}.zip"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Batch download error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Download failed" },
      { status: 500 }
    );
  }
}
