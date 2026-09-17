import type { Metadata } from "next";
import { MetadataRemoverApp } from "@/components/app/metadata-remover";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Free AI Metadata Remover",
  description:
    "AI metadata remover — upload images and automatically strip C2PA, EXIF, and XMP tags. Remove AI metadata from ChatGPT, Midjourney, and DALL·E exports. Batch ZIP download.",
  path: "/app",
  keywords: [
    "ai metadata remover",
    "remove ai metadata",
    "exif metadata remover",
    "c2pa remover",
  ],
});

export default function AppPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-stone-100/50 via-white to-white">
      <MetadataRemoverApp />
    </div>
  );
}
