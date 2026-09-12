import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import { getDeepCleanFile } from "@/lib/deep-clean/pipeline";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const file = await getDeepCleanFile(id);

    if (!file) {
      return NextResponse.json(
        { error: "File not found or expired" },
        { status: 404 }
      );
    }

    const buffer = await fs.readFile(file.filePath);
    const mimeMap: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
    };

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": mimeMap[file.ext.toLowerCase()] || "application/octet-stream",
        "Content-Disposition": `attachment; filename="deep-clean${file.ext}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Deep clean download error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Download failed" },
      { status: 500 }
    );
  }
}
