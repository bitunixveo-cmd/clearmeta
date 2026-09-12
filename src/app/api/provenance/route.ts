import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { isClerkEnabled } from "@/lib/auth";
import {
  checkOpenAIProvenance,
  isProvenanceConfigured,
  validateAccessCode,
} from "@/lib/provenance/openai";
import { PRO_VERIFY_PLAN_SLUG } from "@/lib/provenance/billing";
import { inferMimeType } from "@/lib/mime";
import { PROVENANCE_PRICING } from "@/lib/provenance/pricing";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    if (!isProvenanceConfigured()) {
      return NextResponse.json(
        {
          error:
            "Pro Verify is not configured. Add OPENAI_API_KEY to .env.local on the server.",
        },
        { status: 503 }
      );
    }

    const formData = await request.formData();

    if (isClerkEnabled()) {
      const { userId, has } = await auth();
      if (!userId) {
        return NextResponse.json({ error: "Sign in required." }, { status: 401 });
      }
      if (!has({ plan: PRO_VERIFY_PLAN_SLUG })) {
        return NextResponse.json(
          {
            error:
              "Pro Verify subscription required. Subscribe at /pricing to run checks.",
          },
          { status: 403 }
        );
      }
    } else {
      const accessCode = formData.get("accessCode") as string | null;
      if (!validateAccessCode(accessCode)) {
        return NextResponse.json(
          {
            error: "Invalid Pro access code. Purchase a plan to get your code.",
          },
          { status: 403 }
        );
      }
    }

    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const mimeType = inferMimeType(file.name, file.type);
    if (!mimeType || !mimeType.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are supported for provenance checks." },
        { status: 400 }
      );
    }

    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 20MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await checkOpenAIProvenance(buffer, file.name, mimeType);

    return NextResponse.json({
      result,
      pricing: {
        costPerCheck: PROVENANCE_PRICING.perCheck,
        currency: PROVENANCE_PRICING.currency,
      },
    });
  } catch (error) {
    console.error("Provenance check error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Provenance check failed",
      },
      { status: 500 }
    );
  }
}
