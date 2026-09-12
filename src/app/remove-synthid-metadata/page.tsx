import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import { ExpandedLandingContent } from "@/components/seo/expanded-landing-content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "SynthID Detection & Removal",
  description:
    "Detect Google SynthID watermarks with Pro Verify. Learn limitations of metadata removal and try the experimental Deep Clean beta for SynthID disruption.",
  path: "/remove-synthid-metadata",
  keywords: ["synthid remover", "synthid detector", "google watermark ai"],
});

export default function RemoveSynthidMetadataPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-sm font-medium text-stone-500">ClearMeta</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-950">
          SynthID detection & experimental removal
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-600">
          SynthID is Google&apos;s invisible watermark embedded in pixel data —
          not removable via standard metadata stripping. ClearMeta offers
          detection via Pro Verify and an experimental Deep Clean beta.
        </p>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            SynthID lives in image pixels, not metadata. No tool guarantees
            complete removal. Deep Clean is beta software with variable results.
          </p>
        </div>

        <ul className="mt-8 space-y-3">
          {[
            "Pro Verify: OpenAI Content Provenance API for SynthID + C2PA detection",
            "Deep Clean beta: re-encode, resize cycle, and noise injection",
            "Before/after metadata comparison",
            "Shareable verification reports",
          ].map((bullet) => (
            <li key={bullet} className="flex items-start gap-3 text-stone-700">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              {bullet}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/verify"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-950 px-8 py-3.5 text-base font-semibold text-white hover:bg-stone-800"
          >
            Detect with Pro Verify
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/app/deep-clean"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 px-8 py-3.5 text-base font-semibold text-stone-700 hover:bg-stone-50"
          >
            Deep Clean beta
          </Link>
        </div>

        <ExpandedLandingContent topic="synthid" />
      </div>
    </div>
  );
}
