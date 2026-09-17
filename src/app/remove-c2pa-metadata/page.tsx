import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/seo/seo-landing-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "C2PA Remover — Remove C2PA Metadata",
  description:
    "Free C2PA remover and content credentials remover. Remove C2PA metadata and JUMBF blocks from AI-generated images with batch processing and shareable reports.",
  path: "/remove-c2pa-metadata",
  keywords: [
    "c2pa remover",
    "remove c2pa metadata",
    "content credentials remover",
    "jumbf stripper",
    "c2pa metadata remover",
  ],
});

export default function RemoveC2paMetadataPage() {
  return (
    <SeoLandingPage
      h1="Remove C2PA Content Credentials"
      intro="C2PA (Coalition for Content Provenance and Authenticity) embeds signed credentials in JUMBF blocks inside your image file. ClearMeta is a free C2PA remover that deletes manifests, assertions, and related metadata using ExifTool."
      bullets={[
        "C2PA remover for JPEG, PNG, WebP, and more",
        "Content credentials remover for JUMBF blocks",
        "Detects issuer, validation state, and software agent",
        "Shareable before/after reports",
        "Remove C2PA metadata in seconds",
      ]}
      expandedTopic="c2pa"
      primaryCta={{ href: "/app", label: "Strip C2PA now" }}
    />
  );
}
