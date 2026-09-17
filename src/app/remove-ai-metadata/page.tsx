import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/seo/seo-landing-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Remove AI Metadata from Images",
  description:
    "Remove AI metadata from images before upload. Strip C2PA, EXIF, and XMP tags from ChatGPT, Midjourney, DALL·E, and Firefly exports. Free AI metadata remover with batch ZIP download.",
  path: "/remove-ai-metadata",
  keywords: [
    "remove ai metadata",
    "ai metadata remover",
    "remove ai label instagram",
    "exif metadata remover",
    "remove ai generated metadata",
  ],
});

export default function RemoveAiMetadataPage() {
  return (
    <SeoLandingPage
      h1="Remove AI metadata from images"
      intro="ClearMeta is a free AI metadata remover that strips C2PA Content Credentials, EXIF, XMP, and generator tags from AI-created images. Upload once, review before/after metadata, and download a clean file — no account required."
      bullets={[
        "Remove AI metadata from ChatGPT, DALL·E, Midjourney, Firefly, and SD exports",
        "C2PA remover and content credentials stripper built in",
        "Before/after metadata comparison on every file",
        "Batch upload with ZIP download",
        "Files auto-deleted after 1 hour",
      ]}
      expandedTopic="ai"
      secondaryCta={{ href: "/verify", label: "Pro Verify" }}
    />
  );
}
