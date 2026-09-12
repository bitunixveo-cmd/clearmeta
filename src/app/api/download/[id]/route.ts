import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getCleanedFile } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cleaned = await getCleanedFile(id);

    if (!cleaned) {
      return NextResponse.json({ error: "File not found or expired" }, { status: 404 });
    }

    const buffer = await fs.readFile(cleaned.filePath);
    const ext = path.extname(cleaned.filePath).toLowerCase();
    const mimeMap: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".tif": "image/tiff",
      ".tiff": "image/tiff",
      ".avif": "image/avif",
      ".heic": "image/heic",
      ".heif": "image/heif",
    };

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": mimeMap[ext] || "application/octet-stream",
        "Content-Disposition": `attachment; filename="cleaned${ext}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Download failed" },
      { status: 500 }
    );
  }
}
