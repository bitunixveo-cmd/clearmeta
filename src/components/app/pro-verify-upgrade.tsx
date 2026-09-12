import Link from "next/link";
import { ProVerifyPricingTable } from "@/components/app/pro-verify-pricing-table";
import { PROVENANCE_PRICING } from "@/lib/provenance/pricing";

export function ProVerifyUpgrade() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8 text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
          Pro Verify subscription required
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
          Subscribe to run SynthID & C2PA checks
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-neutral-600">
          ${PROVENANCE_PRICING.monthly}/mo includes{" "}
          {PROVENANCE_PRICING.checksIncluded} checks. Additional checks are $
          {PROVENANCE_PRICING.perCheck} each (tracked separately — see billing
          notes below).
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <p className="text-sm font-medium text-neutral-500">Pay per check</p>
          <p className="mt-2 text-3xl font-bold text-neutral-950">
            ${PROVENANCE_PRICING.perCheck}
            <span className="text-base font-normal text-neutral-500">
              {" "}
              / image
            </span>
          </p>
          <p className="mt-2 text-sm text-neutral-600">
            Requires an active Pro Verify subscription
          </p>
        </div>
        <div className="rounded-xl border border-neutral-900 bg-neutral-900 p-6 text-white">
          <p className="text-sm font-medium text-neutral-400">Pro Verify plan</p>
          <p className="mt-2 text-3xl font-bold">
            ${PROVENANCE_PRICING.monthly}
            <span className="text-base font-normal text-neutral-400">/mo</span>
          </p>
          <p className="mt-2 text-sm text-neutral-300">
            {PROVENANCE_PRICING.checksIncluded} checks included, then $
            {PROVENANCE_PRICING.perCheck} each
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-6">
        <ProVerifyPricingTable />
      </div>

      <p className="mt-6 text-center text-sm text-neutral-500">
        Already subscribed?{" "}
        <Link href="/verify" className="font-medium text-neutral-900 underline">
          Refresh and open Pro Verify
        </Link>
      </p>
    </div>
  );
}
