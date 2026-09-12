import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { cleanImage } from "@/lib/metadata/cleaner";
import { scanImage } from "@/lib/metadata/scanner";
import { saveUpload, getCleanedPath, cleanupOldFiles } from "@/lib/storage";
import { inferMimeType } from "@/lib/mime";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { ok } = rateLimit(`process:${ip}`, 30, 60_000);
  if (!ok) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again in a minute." },
      { status: 429 }
    );
  }

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
    const ext = path.extname(file.name) || ".jpg";
    const outputPath = getCleanedPath(id, ext);

    const result = await cleanImage(
      filePath,
      outputPath,
      file.name,
      mimeType,
      id
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Process error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to process image. Check that ExifTool is installed.",
      },
      { status: 500 }
    );
  }
}
