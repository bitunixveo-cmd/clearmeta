import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { ProvenanceVerifier } from "@/components/app/provenance-verifier";
import { ProVerifyUpgrade } from "@/components/app/pro-verify-upgrade";
import { ProSubscriptionWelcome } from "@/components/app/pro-subscription-welcome";
import { isClerkEnabled } from "@/lib/auth";
import { PRO_VERIFY_PLAN_SLUG } from "@/lib/provenance/billing";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Pro Verify — SynthID & C2PA Detection",
  description:
    "Detect SynthID watermarks and C2PA Content Credentials in AI-generated images. Pro Verify uses OpenAI's Content Provenance API. Plans from $9/mo.",
  path: "/verify",
});

export default async function VerifyPage() {
  if (isClerkEnabled()) {
    const { userId, has } = await auth();
    if (!userId || !has({ plan: PRO_VERIFY_PLAN_SLUG })) {
      return (
        <div className="min-h-[calc(100vh-8rem)] bg-neutral-50">
          <ProVerifyUpgrade />
        </div>
      );
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-neutral-50">
      <Suspense fallback={null}>
        <ProSubscriptionWelcome />
      </Suspense>
      <ProvenanceVerifier />
    </div>
  );
}
