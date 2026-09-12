import { NextResponse } from "next/server";
import {
  isAccessCodeRequired,
  isProvenanceConfigured,
} from "@/lib/provenance/openai";
import { PROVENANCE_PRICING } from "@/lib/provenance/pricing";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    enabled: isProvenanceConfigured(),
    requiresAccessCode: isAccessCodeRequired(),
    pricing: PROVENANCE_PRICING,
  });
}
