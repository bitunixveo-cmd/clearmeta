import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { scanImage } from "@/lib/metadata/scanner";
import { cleanImage } from "@/lib/metadata/cleaner";
import { getCleanedPath, saveUpload } from "@/lib/storage";
import { inferMimeType } from "@/lib/mime";

export interface DeepCleanResult {
  id: string;
  originalFilename: string;
  stepsApplied: string[];
  before: Awaited<ReturnType<typeof scanImage>>;
  after: Awaited<ReturnType<typeof scanImage>>;
  downloadUrl: string;
  warnings: string[];
}

const DEEP_CLEAN_DIR = path.join(process.cwd(), "uploads", "deep-clean");

async function ensureDeepCleanDir(): Promise<void> {
  await fs.mkdir(DEEP_CLEAN_DIR, { recursive: true });
}

/**
 * Experimental SynthID disruption via pixel-level re-encoding and noise injection.
 * This does NOT guarantee SynthID removal — it disrupts frequency-domain patterns
 * that watermark detectors may rely on. Results vary by image and model.
 */
export async function deepCleanImage(
  inputPath: string,
  filename: string,
  mimeType: string
): Promise<DeepCleanResult> {
  await ensureDeepCleanDir();
  const stepsApplied: string[] = [];
  const warnings = [
    "Deep Clean is experimental beta software.",
    "SynthID is embedded in pixel data, not metadata — removal is not guaranteed.",
    "Output may show slight quality loss or color shifts.",
    "Re-verify with Pro Verify after processing to check results.",
  ];

  const stats = await fs.stat(inputPath);
  const before = await scanImage(inputPath, filename, mimeType, stats.size);

  const id = uuidv4();
  const ext = path.extname(filename) || ".jpg";
  let currentPath = inputPath;
  const tempPaths: string[] = [];

  // Step 1: Strip all metadata first
  const metaCleanPath = getCleanedPath(id, ext);
  await cleanImage(inputPath, metaCleanPath, filename, mimeType, id);
  currentPath = metaCleanPath;
  stepsApplied.push("Metadata strip (C2PA, EXIF, XMP)");

  // Step 2: Re-encode with quality perturbation
  const reencodePath = path.join(DEEP_CLEAN_DIR, `${id}_reencode${ext}`);
  tempPaths.push(reencodePath);
  const image = sharp(currentPath, { failOn: "none" });
  const meta = await image.metadata();

  if (mimeType === "image/jpeg" || ext.match(/\.jpe?g$/i)) {
    await sharp(currentPath)
      .jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: "4:2:0" })
      .toFile(reencodePath);
  } else if (mimeType === "image/png") {
    await sharp(currentPath)
      .png({ compressionLevel: 8, palette: false })
      .toFile(reencodePath);
  } else if (mimeType === "image/webp") {
    await sharp(currentPath)
      .webp({ quality: 88, effort: 6 })
      .toFile(reencodePath);
  } else {
    await sharp(currentPath).toFile(reencodePath);
  }
  currentPath = reencodePath;
  stepsApplied.push("Lossy re-encode (quality perturbation)");

  // Step 3: Subtle resize cycle (disrupts fixed-grid patterns)
  const resizePath = path.join(DEEP_CLEAN_DIR, `${id}_resize${ext}`);
  tempPaths.push(resizePath);
  const w = meta.width || 1024;
  const h = meta.height || 1024;
  const scaleFactor = 0.997;
  const newW = Math.max(64, Math.round(w * scaleFactor));
  const newH = Math.max(64, Math.round(h * scaleFactor));

  await sharp(currentPath)
    .resize(newW, newH, { kernel: sharp.kernel.lanczos3 })
    .resize(w, h, { kernel: sharp.kernel.lanczos3 })
    .toFile(resizePath);
  currentPath = resizePath;
  stepsApplied.push("Micro resize cycle (pattern disruption)");

  // Step 4: Add imperceptible noise layer
  const noisePath = path.join(DEEP_CLEAN_DIR, `${id}_noise${ext}`);
  tempPaths.push(noisePath);
  const { data, info } = await sharp(currentPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = Buffer.from(data);
  for (let i = 0; i < pixels.length; i += 4) {
    const noise = (Math.random() - 0.5) * 4;
    pixels[i] = clamp(pixels[i] + noise);
    pixels[i + 1] = clamp(pixels[i + 1] + noise);
    pixels[i + 2] = clamp(pixels[i + 2] + noise);
  }

  const noiseSharp = sharp(pixels, {
    raw: { width: info.width, height: info.height, channels: 4 },
  });

  if (mimeType === "image/jpeg" || ext.match(/\.jpe?g$/i)) {
    await noiseSharp.jpeg({ quality: 90, mozjpeg: true }).toFile(noisePath);
  } else if (mimeType === "image/png") {
    await noiseSharp.png({ compressionLevel: 6 }).toFile(noisePath);
  } else if (mimeType === "image/webp") {
    await noiseSharp.webp({ quality: 90 }).toFile(noisePath);
  } else {
    await noiseSharp.toFile(noisePath);
  }
  currentPath = noisePath;
  stepsApplied.push("Imperceptible noise injection");

  // Final output
  const finalPath = path.join(DEEP_CLEAN_DIR, `${id}_deep${ext}`);
  await fs.copyFile(currentPath, finalPath);

  const finalStats = await fs.stat(finalPath);
  const after = await scanImage(
    finalPath,
    filename.replace(ext, `_deep${ext}`),
    mimeType,
    finalStats.size
  );

  // Cleanup temp files
  for (const temp of tempPaths) {
    await fs.unlink(temp).catch(() => {});
  }

  return {
    id,
    originalFilename: filename,
    stepsApplied,
    before,
    after,
    downloadUrl: `/api/deep-clean/download/${id}`,
    warnings,
  };
}

export async function deepCleanFromBuffer(
  buffer: Buffer,
  filename: string
): Promise<DeepCleanResult> {
  const mimeType = inferMimeType(filename, "") || "image/jpeg";
  const { filePath } = await saveUpload(buffer, filename);
  return deepCleanImage(filePath, filename, mimeType);
}

export async function getDeepCleanFile(id: string): Promise<{
  filePath: string;
  ext: string;
} | null> {
  await ensureDeepCleanDir();
  const files = await fs.readdir(DEEP_CLEAN_DIR);
  const match = files.find((f) => f.startsWith(`${id}_deep`));
  if (!match) return null;
  return {
    filePath: path.join(DEEP_CLEAN_DIR, match),
    ext: path.extname(match),
  };
}

function clamp(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}
