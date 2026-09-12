import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ExpandedLandingContent } from "@/components/seo/expanded-landing-content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Remove C2PA Content Credentials",
  description:
    "Remove C2PA and JUMBF Content Credentials from AI-generated images. Free online C2PA stripper with batch processing and shareable reports.",
  path: "/remove-c2pa-metadata",
  keywords: ["C2PA remover", "content credentials remover", "JUMBF stripper"],
});

export default function RemoveC2paMetadataPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-sm font-medium text-stone-500">ClearMeta</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-950">
          Remove C2PA Content Credentials
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-600">
          C2PA (Coalition for Content Provenance and Authenticity) embeds signed
          credentials in JUMBF blocks inside your image file. ClearMeta removes
          C2PA manifests, assertions, and related metadata using ExifTool.
        </p>

        <ul className="mt-8 space-y-3">
          {[
            "Detects C2PA issuer, validation state, and software agent",
            "Removes JUMBF blocks and Content Credentials",
            "Works on JPEG, PNG, WebP, and more",
            "Shareable before/after reports",
          ].map((bullet) => (
            <li key={bullet} className="flex items-start gap-3 text-stone-700">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              {bullet}
            </li>
          ))}
        </ul>

        <Link
          href="/app"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-stone-950 px-8 py-3.5 text-base font-semibold text-white hover:bg-stone-800"
        >
          Strip C2PA now
          <ArrowRight className="h-5 w-5" />
        </Link>

        <ExpandedLandingContent topic="c2pa" />
      </div>
    </div>
  );
}
