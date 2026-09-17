import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/seo/seo-landing-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "SynthID Remover & Detector",
  description:
    "SynthID remover guide and detector. Detect Google SynthID watermarks with Pro Verify. Learn limits of metadata removal and try Deep Clean beta for experimental disruption.",
  path: "/remove-synthid-metadata",
  keywords: [
    "synthid remover",
    "synthid detector",
    "remove synthid",
    "google watermark ai",
    "synthid metadata",
  ],
});

export default function RemoveSynthidMetadataPage() {
  return (
    <SeoLandingPage
      h1="SynthID remover guide & detection"
      intro="SynthID is Google's invisible watermark embedded in pixel data — not removable via standard metadata stripping. ClearMeta offers SynthID detection via Pro Verify and an experimental Deep Clean beta for disruption attempts."
      alert="SynthID lives in image pixels, not metadata. No tool guarantees complete removal. Deep Clean is beta software with variable results."
      bullets={[
        "SynthID detector via Pro Verify and OpenAI API",
        "C2PA and metadata strip on the free tool",
        "Deep Clean beta for experimental SynthID disruption",
        "Before/after metadata comparison",
        "Shareable verification reports",
      ]}
      expandedTopic="synthid"
      primaryCta={{ href: "/verify", label: "Detect with Pro Verify" }}
      secondaryCta={{ href: "/app/deep-clean", label: "Deep Clean beta" }}
    />
  );
}
