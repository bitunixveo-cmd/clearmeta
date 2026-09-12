import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const CLEANED_DIR = path.join(process.cwd(), "uploads", "cleaned");
const BATCH_DIR = path.join(process.cwd(), "uploads", "batches");
const REPORTS_DIR = path.join(process.cwd(), "uploads", "reports");
const DEEP_CLEAN_DIR = path.join(process.cwd(), "uploads", "deep-clean");

export async function ensureStorageDirs(): Promise<void> {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.mkdir(CLEANED_DIR, { recursive: true });
  await fs.mkdir(BATCH_DIR, { recursive: true });
  await fs.mkdir(REPORTS_DIR, { recursive: true });
  await fs.mkdir(DEEP_CLEAN_DIR, { recursive: true });
}

export async function saveUpload(
  buffer: Buffer,
  originalFilename: string
): Promise<{ id: string; filePath: string; mimeType: string }> {
  await ensureStorageDirs();
  const id = uuidv4();
  const ext = path.extname(originalFilename) || ".jpg";
  const safeName = `${id}${ext}`;
  const filePath = path.join(UPLOAD_DIR, safeName);
  await fs.writeFile(filePath, buffer);
  await fs.writeFile(
    path.join(UPLOAD_DIR, `${id}.meta.json`),
    JSON.stringify({ originalFilename, mimeType: getMimeFromExt(ext) })
  );
  return { id, filePath, mimeType: getMimeFromExt(ext) };
}

export async function getUploadMeta(id: string): Promise<{
  originalFilename: string;
  mimeType: string;
} | null> {
  try {
    const raw = await fs.readFile(
      path.join(UPLOAD_DIR, `${id}.meta.json`),
      "utf-8"
    );
    return JSON.parse(raw) as { originalFilename: string; mimeType: string };
  } catch {
    return null;
  }
}

const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".tif",
  ".tiff",
  ".avif",
  ".heic",
  ".heif",
]);

export async function getUploadFilePath(id: string): Promise<string | null> {
  await ensureStorageDirs();
  const files = await fs.readdir(UPLOAD_DIR);
  const match = files.find((f) => {
    if (f.endsWith(".meta.json")) return false;
    if (!f.startsWith(id)) return false;
    return IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase());
  });

  if (!match) return null;
  return path.join(UPLOAD_DIR, match);
}

export function getCleanedPath(id: string, ext: string): string {
  return path.join(CLEANED_DIR, `${id}_clean${ext}`);
}

export async function getCleanedFile(id: string): Promise<{
  filePath: string;
  filename: string;
} | null> {
  await ensureStorageDirs();
  const files = await fs.readdir(CLEANED_DIR);
  const match = files.find((f) => f.startsWith(`${id}_clean`));
  if (!match) return null;
  return {
    filePath: path.join(CLEANED_DIR, match),
    filename: match.replace(`${id}_clean`, "clean"),
  };
}

export async function cleanupOldFiles(maxAgeMs = 60 * 60 * 1000): Promise<void> {
  await ensureStorageDirs();
  const now = Date.now();
  for (const dir of [UPLOAD_DIR, CLEANED_DIR, BATCH_DIR, DEEP_CLEAN_DIR]) {
    const files = await fs.readdir(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = await fs.stat(filePath);
      if (now - stat.mtimeMs > maxAgeMs) {
        await fs.unlink(filePath).catch(() => {});
      }
    }
  }
}

function getMimeFromExt(ext: string): string {
  const map: Record<string, string> = {
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
  return map[ext.toLowerCase()] || "application/octet-stream";
}

export { UPLOAD_DIR, CLEANED_DIR };
