import { SUPPORTED_MIME_TYPES } from "@/lib/metadata/types";

const EXT_TO_MIME: Record<string, string> = {
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

export function getMimeFromExt(ext: string): string {
  return EXT_TO_MIME[ext.toLowerCase()] || "application/octet-stream";
}

export function inferMimeType(filename: string, fileType: string): string | null {
  if (fileType && SUPPORTED_MIME_TYPES.includes(fileType)) {
    return fileType;
  }

  const ext = filename.includes(".")
    ? `.${filename.split(".").pop()?.toLowerCase()}`
    : "";

  const fromExt = getMimeFromExt(ext);
  if (SUPPORTED_MIME_TYPES.includes(fromExt)) {
    return fromExt;
  }

  return null;
}

export function isSupportedImage(filename: string, fileType: string): boolean {
  return inferMimeType(filename, fileType) !== null;
}
