import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { scanImage, countMetadataTags } from "./scanner";
import type { CleanResult } from "./types";

const execFileAsync = promisify(execFile);

const EXIFTOOL_PATH =
  process.env.EXIFTOOL_PATH ||
  "/opt/homebrew/bin/exiftool";

async function resolveExiftoolPath(): Promise<string | null> {
  try {
    await fs.access(EXIFTOOL_PATH);
    return EXIFTOOL_PATH;
  } catch {
    try {
      const { stdout } = await execFileAsync("which", ["exiftool"]);
      return stdout.trim() || null;
    } catch {
      return null;
    }
  }
}

async function exiftoolExists(): Promise<boolean> {
  return (await resolveExiftoolPath()) !== null;
}

async function stripWithExiftool(inputPath: string, outputPath: string): Promise<void> {
  const exiftool = await resolveExiftoolPath();
  if (!exiftool) throw new Error("ExifTool not found");

  // Write cleaned copy to outputPath; leave original upload untouched
  await execFileAsync(exiftool, [
    "-all=",
    "-jumbf:all=",
    "-o",
    outputPath,
    inputPath,
  ]);
}

async function stripWithSharp(
  inputPath: string,
  outputPath: string,
  mimeType: string
): Promise<void> {
  const image = sharp(inputPath, { failOn: "none" });

  if (mimeType === "image/jpeg") {
    await image.jpeg({ quality: 95, mozjpeg: true }).toFile(outputPath);
  } else if (mimeType === "image/png") {
    await image.png({ compressionLevel: 6 }).toFile(outputPath);
  } else if (mimeType === "image/webp") {
    await image.webp({ quality: 95 }).toFile(outputPath);
  } else if (mimeType === "image/tiff") {
    await image.tiff({ quality: 95 }).toFile(outputPath);
  } else if (mimeType === "image/avif") {
    await image.avif({ quality: 90 }).toFile(outputPath);
  } else {
    await image.toFile(outputPath);
  }
}

export async function cleanImage(
  inputPath: string,
  outputPath: string,
  filename: string,
  mimeType: string,
  id: string
): Promise<CleanResult> {
  const stats = await fs.stat(inputPath);
  const before = await scanImage(inputPath, filename, mimeType, stats.size);

  const beforeTagCount = await countMetadataTags(inputPath);

  const hasExiftool = await exiftoolExists();

  if (hasExiftool) {
    await stripWithExiftool(inputPath, outputPath);
  } else {
    await stripWithSharp(inputPath, outputPath, mimeType);
  }

  const cleanedStats = await fs.stat(outputPath);
  const ext = path.extname(filename) || ".jpg";
  const cleanedFilename = filename.replace(ext, `_clean${ext}`);

  const after = await scanImage(
    outputPath,
    cleanedFilename,
    mimeType,
    cleanedStats.size
  );

  const afterTagCount = await countMetadataTags(outputPath);
  const removedTags = Math.max(0, beforeTagCount - afterTagCount);

  return {
    id,
    originalFilename: filename,
    cleanedFilename,
    originalSize: stats.size,
    cleanedSize: cleanedStats.size,
    removedTags: removedTags || (before.hasAiMetadata ? before.aiTags.length + (before.c2pa.present ? 1 : 0) : 0),
    before,
    after,
    downloadUrl: `/api/download/${id}`,
  };
}
