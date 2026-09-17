import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/seo/seo-landing-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Remove ChatGPT & DALL·E Metadata",
  description:
    "Remove ChatGPT metadata and remove ChatGPT image metadata from exports. Strip C2PA, EXIF, and XMP from ChatGPT and DALL·E images. Free DALL·E metadata remover.",
  path: "/remove-chatgpt-metadata",
  keywords: [
    "remove chatgpt metadata",
    "remove chatgpt image metadata",
    "remove dalle metadata",
    "dalle metadata remover",
    "gpt-image metadata",
    "openai image metadata",
  ],
});

export default function RemoveChatgptMetadataPage() {
  return (
    <SeoLandingPage
      h1="Remove ChatGPT & DALL·E image metadata"
      intro="Images from ChatGPT and DALL·E embed C2PA Content Credentials and XMP tags that identify them as AI-generated. ClearMeta strips these automatically — including remove ChatGPT image metadata workflows for Instagram and client delivery."
      bullets={[
        "Removes C2PA issuer, software agent, and model tags",
        "Strips EXIF and XMP AI markers from ChatGPT exports",
        "Remove DALL·E metadata from PNG and JPEG downloads",
        "Before/after comparison on every file",
        "Batch upload with ZIP download",
      ]}
      expandedTopic="chatgpt"
      secondaryCta={{ href: "/verify", label: "Pro Verify" }}
    />
  );
}
