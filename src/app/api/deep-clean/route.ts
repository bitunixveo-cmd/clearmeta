import { NextRequest, NextResponse } from "next/server";
import { deepCleanFromBuffer, getDeepCleanFile } from "@/lib/deep-clean/pipeline";
import { inferMimeType } from "@/lib/mime";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { cleanupOldFiles } from "@/lib/storage";

export const runtime = "nodejs";
export const maxDuration = 180;

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { ok } = rateLimit(`deep-clean:${ip}`, 5, 60_000);
  if (!ok) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Deep Clean is limited to 5 requests per minute." },
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
        { error: "Unsupported file type" },
        { status: 400 }
      );
    }

    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size for Deep Clean is 25MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await deepCleanFromBuffer(buffer, file.name);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Deep clean error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Deep Clean failed. Check that ExifTool and Sharp are available.",
      },
      { status: 500 }
    );
  }
}
