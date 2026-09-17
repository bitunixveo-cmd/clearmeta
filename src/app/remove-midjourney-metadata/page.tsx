import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/seo/seo-landing-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Remove Midjourney Metadata",
  description:
    "Remove Midjourney metadata from PNG and JPEG exports. Strip XMP generation parameters, prompts, and C2PA tags with ClearMeta's free AI metadata remover.",
  path: "/remove-midjourney-metadata",
  keywords: [
    "remove midjourney metadata",
    "midjourney metadata remover",
    "midjourney exif remover",
    "remove ai metadata",
  ],
});

export default function RemoveMidjourneyMetadataPage() {
  return (
    <SeoLandingPage
      h1="Remove Midjourney image metadata"
      intro="Midjourney exports can carry XMP generation data, prompt parameters, and provenance tags in PNG and JPEG files. ClearMeta removes supported Midjourney metadata automatically while preserving image quality."
      bullets={[
        "Strips XMP and EXIF AI generation fields",
        "Removes C2PA and PNG text chunks when present",
        "Works on upscaled and raw Midjourney downloads",
        "Batch processing with shareable before/after reports",
        "Free — no account required",
      ]}
      expandedTopic="midjourney"
    />
  );
}
