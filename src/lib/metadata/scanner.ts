import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs/promises";
import {
  AI_KEYWORDS,
  type C2PASignal,
  type MetadataSignal,
  type ScanResult,
} from "./types";

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

function detectFormat(filename: string, mimeType: string): string {
  const ext = path.extname(filename).toLowerCase().replace(".", "");
  if (ext) return ext;
  return mimeType.split("/")[1] || "unknown";
}

function isAiRelated(value: string): boolean {
  const lower = value.toLowerCase();
  return AI_KEYWORDS.some((keyword) => lower.includes(keyword));
}

function parseExiftoolJson(data: Record<string, unknown>): {
  c2pa: C2PASignal;
  aiTags: MetadataSignal[];
} {
  const aiTags: MetadataSignal[] = [];
  const c2pa: C2PASignal = { present: false };

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;
    const strValue = String(value);
    const group = key.split(":")[0] || "Other";

    if (
      key.toLowerCase().includes("jumbf") ||
      key.toLowerCase().includes("c2pa") ||
      group.toLowerCase() === "jumbf"
    ) {
      c2pa.present = true;
    }

    if (key.includes("SoftwareAgent") && strValue) {
      c2pa.softwareAgent = strValue;
      c2pa.present = true;
    }

    if (
      (key.endsWith(":Software") || key.endsWith(":CreatorTool")) &&
      isAiRelated(strValue)
    ) {
      c2pa.softwareAgent = strValue;
      if (strValue.toLowerCase().includes("dall")) {
        c2pa.model = "DALL·E";
      }
    }

    if (key.includes("DigitalSourceType") && strValue) {
      c2pa.digitalSourceType = strValue;
      c2pa.present = true;
    }

    if (key.includes("ActionsAction") && strValue.includes("c2pa")) {
      c2pa.action = strValue;
      c2pa.present = true;
    }

    if (
      (key.includes("ClaimGenerator") || key.includes("Issuer")) &&
      strValue
    ) {
      if (strValue.toLowerCase().includes("openai")) {
        c2pa.issuer = "OpenAI";
      } else {
        c2pa.issuer = strValue;
      }
      c2pa.present = true;
    }

    if (isAiRelated(key) || isAiRelated(strValue)) {
      aiTags.push({ group, tag: key, value: strValue });
    }
  }

  if (c2pa.digitalSourceType?.includes("trainedAlgorithmicMedia")) {
    c2pa.action = c2pa.action || "c2pa.created";
  }

  if (c2pa.softwareAgent?.toLowerCase().includes("dall")) {
    c2pa.model = "DALL·E";
  } else if (c2pa.softwareAgent?.toLowerCase().includes("firefly")) {
    c2pa.model = "Adobe Firefly";
  }

  if (c2pa.present && !c2pa.validationState) {
    c2pa.validationState = "detected";
  }

  return { c2pa, aiTags };
}

export async function scanImage(
  filePath: string,
  filename: string,
  mimeType: string,
  fileSize: number
): Promise<ScanResult> {
  const warnings: string[] = [];
  const format = detectFormat(filename, mimeType);

  if (!(await exiftoolExists())) {
    warnings.push(
      "ExifTool not found — using basic scan only. Install ExifTool for full C2PA detection."
    );
    return {
      filename,
      format,
      fileSize,
      mimeType,
      c2pa: { present: false },
      aiTags: [],
      hasAiMetadata: false,
      removableByStrip: true,
      warnings,
    };
  }

  try {
    const exiftool = await resolveExiftoolPath();
    if (!exiftool) throw new Error("ExifTool not found");

    const { stdout } = await execFileAsync(exiftool, [
      "-j",
      "-G3",
      "-a",
      "-s",
      "-u",
      "-struct",
      filePath,
    ]);

    const parsed = JSON.parse(stdout) as Record<string, unknown>[];
    const data = parsed[0] || {};
    const { c2pa, aiTags } = parseExiftoolJson(data);

    const hasAiMetadata =
      c2pa.present ||
      aiTags.length > 0 ||
      Boolean(c2pa.softwareAgent);

    if (hasAiMetadata && !c2pa.present && aiTags.length > 0) {
      warnings.push(
        "AI-related XMP/EXIF tags detected. Metadata strip will remove these."
      );
    }

    if (hasAiMetadata && c2pa.present) {
      warnings.push(
        "C2PA Content Credentials detected. These will be fully removed."
      );
    }

    if (!hasAiMetadata) {
      warnings.push(
        "No AI metadata found. Image may still contain invisible watermarks (SynthID) that metadata removal cannot detect."
      );
    }

    return {
      filename,
      format,
      fileSize,
      mimeType,
      c2pa,
      aiTags,
      hasAiMetadata,
      removableByStrip: true,
      warnings,
    };
  } catch (error) {
    warnings.push(
      `Scan error: ${error instanceof Error ? error.message : "Unknown error"}`
    );
    return {
      filename,
      format,
      fileSize,
      mimeType,
      c2pa: { present: false },
      aiTags: [],
      hasAiMetadata: false,
      removableByStrip: true,
      warnings,
    };
  }
}

export async function countMetadataTags(filePath: string): Promise<number> {
  if (!(await exiftoolExists())) return 0;

  try {
    const exiftool = await resolveExiftoolPath();
    if (!exiftool) return 0;

    const { stdout } = await execFileAsync(exiftool, [
      "-j",
      "-G3",
      "-a",
      "-s",
      filePath,
    ]);
    const parsed = JSON.parse(stdout) as Record<string, unknown>[];
    return Object.keys(parsed[0] || {}).length;
  } catch {
    return 0;
  }
}
