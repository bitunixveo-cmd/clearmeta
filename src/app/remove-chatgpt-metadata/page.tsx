import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ExpandedLandingContent } from "@/components/seo/expanded-landing-content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Remove ChatGPT & DALL·E Metadata",
  description:
    "Strip C2PA, EXIF, and XMP tags from ChatGPT and DALL·E generated images. Free automatic metadata removal with batch ZIP download.",
  path: "/remove-chatgpt-metadata",
  keywords: [
    "remove chatgpt metadata",
    "dalle metadata remover",
    "gpt-image metadata",
    "openai image metadata",
  ],
});

export default function RemoveChatgptMetadataPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-sm font-medium text-stone-500">ClearMeta</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-950">
          Remove ChatGPT & DALL·E image metadata
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-600">
          Images from ChatGPT and DALL·E embed C2PA Content Credentials and XMP
          tags that identify them as AI-generated. ClearMeta strips these
          automatically on upload.
        </p>

        <ul className="mt-8 space-y-3">
          {[
            "Removes C2PA issuer, software agent, and model tags",
            "Strips EXIF and XMP AI markers",
            "Before/after comparison on every file",
            "Batch upload with ZIP download",
            "Files auto-deleted after 1 hour",
          ].map((bullet) => (
            <li key={bullet} className="flex items-start gap-3 text-stone-700">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              {bullet}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/app"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-950 px-8 py-3.5 text-base font-semibold text-white hover:bg-stone-800"
          >
            Remove metadata free
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/verify"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 px-8 py-3.5 text-base font-semibold text-stone-700 hover:bg-stone-50"
          >
            Pro Verify
          </Link>
        </div>

        <ExpandedLandingContent topic="chatgpt" />
      </div>
    </div>
  );
}
