import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/legal/layout";

export const metadata: Metadata = {
  title: "FAQ — ClearMeta",
  description:
    "Frequently asked questions about removing C2PA, EXIF, SynthID, and AI metadata from images.",
};

export default function FaqPage() {
  return (
    <LegalLayout
      title="Frequently Asked Questions"
      description="Common questions about metadata removal and Pro Verify."
    >
      <h2>What metadata does ClearMeta remove?</h2>
      <p>
        The free tool removes C2PA Content Credentials, JUMBF blocks, EXIF, XMP, and
        other embedded tags commonly added by ChatGPT, DALL·E, Midjourney, Adobe
        Firefly, and similar tools.
      </p>

      <h2>Can ClearMeta remove SynthID?</h2>
      <p>
        Standard metadata stripping does <strong>not</strong> remove SynthID — it is
        embedded in pixel data, not metadata. Use{" "}
        <Link href="/verify">Pro Verify</Link> to detect SynthID, or try{" "}
        <Link href="/app/deep-clean">Deep Clean beta</Link> for experimental disruption
        (results not guaranteed).
      </p>

      <h2>Is my image stored permanently?</h2>
      <p>
        No. Files are deleted automatically after 1 hour. Shareable reports you create
        expire after 7 days.
      </p>

      <h2>Do I need an account?</h2>
      <p>
        The free metadata remover at <Link href="/app">/app</Link> requires no account.
        Pro Verify and Deep Clean require sign-in when Clerk is configured.
      </p>

      <h2>What file formats are supported?</h2>
      <p>JPEG, PNG, WebP, TIFF, AVIF, and HEIC — up to 50MB per file (25MB for Deep Clean).</p>

      <h2>Can I process multiple images?</h2>
      <p>
        Yes. Upload multiple files on the app page and download individually or as a
        ZIP batch.
      </p>

      <h2>What is a shareable report?</h2>
      <p>
        After cleaning or verifying, you can generate a public link showing before/after
        metadata comparison. Reports expire after 7 days.
      </p>

      <h2>Is metadata removal legal?</h2>
      <p>
        Laws vary by jurisdiction and use case. You are responsible for complying with
        disclosure requirements for AI-generated content in your region and platform
        policies.
      </p>
    </LegalLayout>
  );
}
