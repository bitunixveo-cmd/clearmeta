import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { CleanResult } from "@/lib/metadata/types";
import type { ProvenanceCheckResult } from "@/lib/provenance/types";

const REPORTS_DIR = path.join(process.cwd(), "uploads", "reports");
const REPORT_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type ReportType = "clean" | "verify" | "deep-clean";

export interface ShareReport {
  id: string;
  type: ReportType;
  title: string;
  createdAt: string;
  expiresAt: string;
  originalFilename: string;
  before: CleanResult["before"];
  after?: CleanResult["after"];
  clean?: Pick<
    CleanResult,
    "removedTags" | "originalSize" | "cleanedSize" | "downloadUrl"
  >;
  provenance?: ProvenanceCheckResult;
  deepClean?: {
    stepsApplied: string[];
    synthIdBefore?: string;
    synthIdAfter?: string;
    downloadUrl?: string;
  };
}

export async function ensureReportsDir(): Promise<void> {
  await fs.mkdir(REPORTS_DIR, { recursive: true });
}

export async function saveReport(
  data: Omit<ShareReport, "id" | "createdAt" | "expiresAt">
): Promise<ShareReport> {
  await ensureReportsDir();
  const id = uuidv4().slice(0, 12);
  const now = new Date();
  const report: ShareReport = {
    ...data,
    id,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + REPORT_TTL_MS).toISOString(),
  };
  await fs.writeFile(
    path.join(REPORTS_DIR, `${id}.json`),
    JSON.stringify(report, null, 2)
  );
  return report;
}

export async function getReport(id: string): Promise<ShareReport | null> {
  try {
    const raw = await fs.readFile(
      path.join(REPORTS_DIR, `${id}.json`),
      "utf-8"
    );
    const report = JSON.parse(raw) as ShareReport;
    if (new Date(report.expiresAt).getTime() < Date.now()) {
      await fs.unlink(path.join(REPORTS_DIR, `${id}.json`)).catch(() => {});
      return null;
    }
    return report;
  } catch {
    return null;
  }
}
