import type {
  C2PAResult,
  ProvenanceCheckResult,
  SynthIDResult,
} from "./types";

interface OpenAIProvenanceResponse {
  object: string;
  created_at: number;
  results: Array<Record<string, unknown>>;
}

function parseC2PA(raw: Record<string, unknown>): C2PAResult {
  return {
    type: "c2pa",
    outcome: (raw.outcome as C2PAResult["outcome"]) || "not_detected",
    validationState: raw.validation_state as C2PAResult["validationState"],
    issuer: (raw.issuer as string) || null,
    model: (raw.model as string) || null,
    generatedAt: (raw.generated_at as string) || null,
  };
}

function parseSynthID(raw: Record<string, unknown>): SynthIDResult {
  return {
    type: "synthid",
    outcome: (raw.outcome as SynthIDResult["outcome"]) || "not_detected",
    model: (raw.model as string) || null,
    generatedAt: (raw.generated_at as string) || null,
  };
}

function buildSummary(c2pa?: C2PAResult, synthid?: SynthIDResult): string {
  const parts: string[] = [];

  if (c2pa?.outcome === "detected") {
    parts.push(
      `C2PA detected${c2pa.issuer ? ` (${c2pa.issuer})` : ""}${
        c2pa.model ? ` — ${c2pa.model}` : ""
      }`
    );
  } else if (c2pa) {
    parts.push("C2PA not detected");
  }

  if (synthid?.outcome === "detected") {
    parts.push("SynthID watermark detected");
  } else if (synthid) {
    parts.push("SynthID not detected");
  }

  if (parts.length === 0) {
    return "No OpenAI provenance signals found for this file type.";
  }

  return parts.join(". ") + ".";
}

export function isProvenanceConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export function isAccessCodeRequired(): boolean {
  return Boolean(process.env.PRO_VERIFY_ACCESS_CODE?.trim());
}

export function validateAccessCode(code: string | null): boolean {
  const required = process.env.PRO_VERIFY_ACCESS_CODE?.trim();
  if (!required) return true;
  return code?.trim() === required;
}

export async function checkOpenAIProvenance(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<ProvenanceCheckResult> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      "OpenAI API key not configured. Add OPENAI_API_KEY to .env.local"
    );
  }

  const formData = new FormData();
  const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });
  formData.append("file", blob, filename);

  const response = await fetch(
    "https://api.openai.com/v1/content_provenance_checks",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    }
  );

  const data = (await response.json()) as OpenAIProvenanceResponse & {
    error?: { message?: string };
  };

  if (!response.ok) {
    throw new Error(
      data.error?.message ||
        `OpenAI provenance check failed (${response.status})`
    );
  }

  let c2pa: C2PAResult | undefined;
  let synthid: SynthIDResult | undefined;

  for (const item of data.results || []) {
    if (item.type === "c2pa") c2pa = parseC2PA(item);
    if (item.type === "synthid") synthid = parseSynthID(item);
  }

  const hasAnySignal =
    c2pa?.outcome === "detected" || synthid?.outcome === "detected";

  return {
    filename,
    fileSize: buffer.length,
    mimeType,
    checkedAt: new Date().toISOString(),
    c2pa,
    synthid,
    hasAnySignal,
    summary: buildSummary(c2pa, synthid),
  };
}
