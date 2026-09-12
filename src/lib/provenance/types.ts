export type ProvenanceOutcome = "detected" | "not_detected";
export type C2PAValidationState = "trusted" | "valid" | "invalid" | "not_present";

export interface C2PAResult {
  type: "c2pa";
  outcome: ProvenanceOutcome;
  validationState?: C2PAValidationState;
  issuer?: string | null;
  model?: string | null;
  generatedAt?: string | null;
}

export interface SynthIDResult {
  type: "synthid";
  outcome: ProvenanceOutcome;
  model?: string | null;
  generatedAt?: string | null;
}

export interface ProvenanceCheckResult {
  filename: string;
  fileSize: number;
  mimeType: string;
  checkedAt: string;
  c2pa?: C2PAResult;
  synthid?: SynthIDResult;
  hasAnySignal: boolean;
  summary: string;
}

export interface ProvenanceApiResponse {
  result: ProvenanceCheckResult;
  pricing: {
    costPerCheck: number;
    currency: string;
  };
}
