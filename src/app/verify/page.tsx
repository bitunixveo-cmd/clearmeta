import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { ProvenanceVerifier } from "@/components/app/provenance-verifier";
import { ProVerifyUpgrade } from "@/components/app/pro-verify-upgrade";
import { ProSubscriptionWelcome } from "@/components/app/pro-subscription-welcome";
import { isClerkEnabled } from "@/lib/auth";
import { PRO_VERIFY_PLAN_SLUG } from "@/lib/provenance/billing";

export default async function VerifyPage() {
  if (isClerkEnabled()) {
    const { has } = await auth();
    if (!has({ plan: PRO_VERIFY_PLAN_SLUG })) {
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
