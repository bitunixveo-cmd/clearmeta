import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface SeoLandingProps {
  title: string;
  description: string;
  h1: string;
  intro: string;
  bullets: string[];
  keywords: string[];
}

function SeoLanding({
  title,
  description,
  h1,
  intro,
  bullets,
}: SeoLandingProps) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-sm font-medium text-stone-500">ClearMeta</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-950">
          {h1}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-600">{intro}</p>

        <ul className="mt-8 space-y-3">
          {bullets.map((bullet) => (
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

        <div className="mt-16 border-t border-stone-200 pt-8">
          <h2 className="text-xl font-semibold text-stone-950">Related tools</h2>
          <ul className="mt-4 space-y-2 text-stone-600">
            <li>
              <Link href="/remove-c2pa-metadata" className="hover:text-stone-950">
                Remove C2PA Content Credentials
              </Link>
            </li>
            <li>
              <Link href="/remove-chatgpt-metadata" className="hover:text-stone-950">
                Remove ChatGPT / DALL·E metadata
              </Link>
            </li>
            <li>
              <Link href="/remove-synthid-metadata" className="hover:text-stone-950">
                SynthID detection & Deep Clean
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Remove ChatGPT & DALL·E Metadata — ClearMeta",
  description:
    "Strip C2PA, EXIF, and XMP tags from ChatGPT and DALL·E generated images. Free, automatic, private.",
  keywords: [
    "remove chatgpt metadata",
    "dalle metadata remover",
    "gpt-image metadata",
    "openai image metadata",
  ],
};

export default function RemoveChatgptMetadataPage() {
  return (
    <SeoLanding
      title="Remove ChatGPT Metadata"
      description=""
      h1="Remove ChatGPT & DALL·E image metadata"
      intro="Images from ChatGPT and DALL·E embed C2PA Content Credentials and XMP tags that identify them as AI-generated. ClearMeta strips these automatically on upload."
      bullets={[
        "Removes C2PA issuer, software agent, and model tags",
        "Strips EXIF and XMP AI markers",
        "Before/after comparison on every file",
        "Batch upload with ZIP download",
        "Files auto-deleted after 1 hour",
      ]}
      keywords={[]}
    />
  );
}
