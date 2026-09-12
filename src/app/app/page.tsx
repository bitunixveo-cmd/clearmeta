import type { Metadata } from "next";
import { MetadataRemoverApp } from "@/components/app/metadata-remover";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Free AI Metadata Remover",
  description:
    "Upload AI-generated images and automatically strip C2PA, EXIF, and XMP tags. Batch processing, before/after comparison, and ZIP download. Files deleted after 1 hour.",
  path: "/app",
});

export default function AppPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-stone-100/50 via-white to-white">
      <MetadataRemoverApp />
    </div>
  );
}
