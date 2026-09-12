import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { cleanImage } from "@/lib/metadata/cleaner";
import {
  saveUpload,
  getCleanedPath,
  cleanupOldFiles,
  getUploadMeta,
  getUploadFilePath,
} from "@/lib/storage";
import { inferMimeType } from "@/lib/mime";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    await cleanupOldFiles();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const existingId = formData.get("id") as string | null;

    if (!file && !existingId) {
      return NextResponse.json(
        { error: "No file or id provided" },
        { status: 400 }
      );
    }

    let id: string;
    let filePath: string;
    let filename: string;
    let mimeType: string;

    if (existingId) {
      const uploadPath = await getUploadFilePath(existingId);
      if (!uploadPath) {
        return NextResponse.json(
          { error: "Upload session expired. Please re-upload." },
          { status: 404 }
        );
      }
      id = existingId;
      filePath = uploadPath;
      const meta = await getUploadMeta(existingId);
      filename =
        file?.name ||
        meta?.originalFilename ||
        `image${path.extname(uploadPath)}`;
      mimeType =
        inferMimeType(filename, file?.type || "") ||
        meta?.mimeType ||
        "image/jpeg";
    } else if (file) {
      const resolved = inferMimeType(file.name, file.type);
      if (!resolved) {
        return NextResponse.json(
          { error: "Unsupported file type" },
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
      const saved = await saveUpload(buffer, file.name);
      id = saved.id;
      filePath = saved.filePath;
      filename = file.name;
      mimeType = resolved;
    } else {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const ext = path.extname(filename) || ".jpg";
    const outputPath = getCleanedPath(id, ext);
    const result = await cleanImage(filePath, outputPath, filename, mimeType, id);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Clean error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Clean failed" },
      { status: 500 }
    );
  }
}
