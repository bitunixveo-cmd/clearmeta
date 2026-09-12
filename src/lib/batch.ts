import fs from "fs/promises";
import path from "path";
import { ZipArchive } from "archiver";
import { createWriteStream } from "fs";
import { v4 as uuidv4 } from "uuid";
import { getCleanedFile } from "@/lib/storage";

const BATCH_DIR = path.join(process.cwd(), "uploads", "batches");

export async function ensureBatchDir(): Promise<void> {
  await fs.mkdir(BATCH_DIR, { recursive: true });
}

export async function createZipFromIds(
  ids: string[]
): Promise<{ jobId: string; zipPath: string; fileCount: number }> {
  await ensureBatchDir();
  const jobId = uuidv4().slice(0, 12);
  const zipPath = path.join(BATCH_DIR, `${jobId}.zip`);

  const files: { path: string; name: string }[] = [];
  for (const id of ids) {
    const cleaned = await getCleanedFile(id);
    if (cleaned) {
      files.push({
        path: cleaned.filePath,
        name: cleaned.filename.startsWith("_")
          ? `clean${cleaned.filename}`
          : cleaned.filename,
      });
    }
  }

  if (files.length === 0) {
    throw new Error("No cleaned files found for the provided IDs");
  }

  await new Promise<void>((resolve, reject) => {
    const output = createWriteStream(zipPath);
    const archive = new ZipArchive({ zlib: { level: 9 } });

    output.on("close", () => resolve());
    archive.on("error", reject);

    archive.pipe(output);
    for (const file of files) {
      archive.file(file.path, { name: file.name });
    }
    void archive.finalize();
  });

  return { jobId, zipPath, fileCount: files.length };
}

export async function getBatchZipPath(jobId: string): Promise<string | null> {
  const zipPath = path.join(BATCH_DIR, `${jobId}.zip`);
  try {
    await fs.access(zipPath);
    return zipPath;
  } catch {
    return null;
  }
}
