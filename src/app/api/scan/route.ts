import { NextRequest, NextResponse } from "next/server";
import { scanImage } from "@/lib/metadata/scanner";
import { saveUpload, cleanupOldFiles } from "@/lib/storage";
import { inferMimeType } from "@/lib/mime";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    await cleanupOldFiles();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const mimeType = inferMimeType(file.name, file.type);
    if (!mimeType) {
      return NextResponse.json(
        {
          error: `Unsupported file type. Supported: JPEG, PNG, WebP, TIFF, AVIF, HEIC`,
        },
        { status: 400 }
      );
    }

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 50MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { id, filePath } = await saveUpload(buffer, file.name);
    const result = await scanImage(filePath, file.name, mimeType, file.size);

    return NextResponse.json({ id, scan: result });
  } catch (error) {
    console.error("Scan error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Scan failed" },
      { status: 500 }
    );
  }
}
