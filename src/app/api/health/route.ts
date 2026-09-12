import { NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";

const execFileAsync = promisify(execFile);

export const runtime = "nodejs";

export async function GET() {
  let exiftool = false;
  let exiftoolVersion: string | null = null;

  try {
    const { stdout } = await execFileAsync("exiftool", ["-ver"]);
    exiftool = true;
    exiftoolVersion = stdout.trim();
  } catch {
    try {
      await fs.access("/opt/homebrew/bin/exiftool");
      const { stdout } = await execFileAsync("/opt/homebrew/bin/exiftool", ["-ver"]);
      exiftool = true;
      exiftoolVersion = stdout.trim();
    } catch {
      exiftool = false;
    }
  }

  return NextResponse.json({
    ok: exiftool,
    exiftool,
    exiftoolVersion,
  });
}
