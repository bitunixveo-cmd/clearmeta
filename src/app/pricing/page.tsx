import type { Metadata } from "next";
import Link from "next/link";
import { ProVerifyPricingTable } from "@/components/app/pro-verify-pricing-table";
import { PROVENANCE_PRICING } from "@/lib/provenance/pricing";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Pro Verify Pricing",
  description: `Subscribe to ClearMeta Pro Verify for SynthID and C2PA detection. $${PROVENANCE_PRICING.monthly}/mo includes ${PROVENANCE_PRICING.checksIncluded} checks, then $${PROVENANCE_PRICING.perCheck} per additional check. Cancel anytime.`,
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-neutral-50">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
            Pro Verify pricing
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-neutral-600">
            ${PROVENANCE_PRICING.monthly}/mo with{" "}
            {PROVENANCE_PRICING.checksIncluded} checks included, then $
            {PROVENANCE_PRICING.perCheck} per additional check.
          </p>
        </div>

        <div className="mb-8 rounded-xl border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
          <h2 className="text-base font-semibold text-neutral-950">
            What is included
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>SynthID invisible watermark detection via OpenAI verification</li>
            <li>C2PA Content Credentials and provenance scanning</li>
            <li>Shareable verification reports with before/after metadata</li>
            <li>Optional metadata strip after verification on supported files</li>
          </ul>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-6">
          <ProVerifyPricingTable />
        </div>

        <p className="mt-6 text-center text-sm text-neutral-500">
          <Link href="/verify" className="font-medium text-neutral-900 underline">
            Back to Pro Verify
          </Link>
        </p>
      </div>
    </div>
  );
}
