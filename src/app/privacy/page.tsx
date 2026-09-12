import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/layout";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How ClearMeta handles your images, metadata, and personal data. Files are auto-deleted after 1 hour.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      description="We built ClearMeta to remove metadata — not collect it."
    >
      <h2>Overview</h2>
      <p>
        ClearMeta (&quot;we&quot;, &quot;us&quot;) provides tools to scan and
        remove AI-related metadata from images. This policy explains what data we
        process and how long we keep it.
      </p>

      <h2>What we process</h2>
      <ul>
        <li>
          <strong>Uploaded images</strong> — processed on our servers to scan and
          remove metadata. We do not use your images to train AI models.
        </li>
        <li>
          <strong>Metadata extracted during scans</strong> — C2PA, EXIF, and XMP
          tag values are displayed to you and may be included in shareable reports
          you explicitly create.
        </li>
        <li>
          <strong>Account data (Pro)</strong> — if you sign up via Clerk, we receive
          your email and authentication identifiers to manage Pro Verify access.
        </li>
        <li>
          <strong>Usage logs</strong> — basic request logs (IP, timestamp, endpoint)
          for security and rate limiting. Logs are retained up to 30 days.
        </li>
      </ul>

      <h2>Retention</h2>
      <p>
        Uploaded and cleaned files are <strong>automatically deleted after 1 hour</strong>.
        Shareable reports expire after 7 days. We do not maintain a permanent library
        of your images.
      </p>

      <h2>Third-party services</h2>
      <ul>
        <li>
          <strong>Clerk</strong> — authentication for Pro features (
          <a href="https://clerk.com/privacy">Clerk Privacy Policy</a>).
        </li>
        <li>
          <strong>OpenAI</strong> — Pro Verify sends images to OpenAI&apos;s Content
          Provenance API for SynthID/C2PA detection only when you use that feature (
          <a href="https://openai.com/policies/privacy-policy">
            OpenAI Privacy Policy
          </a>
          ).
        </li>
        <li>
          <strong>Hosting</strong> — our infrastructure provider (Hostinger) processes
          files on servers you connect to when using the service.
        </li>
      </ul>

      <h2>Your rights</h2>
      <p>
        Depending on your jurisdiction, you may have rights to access, correct, or
        delete personal data. Contact us at{" "}
        <a href="mailto:privacy@clearmeta.app">privacy@clearmeta.app</a> for requests.
      </p>

      <h2>Children</h2>
      <p>
        ClearMeta is not directed at children under 13. We do not knowingly collect
        data from children.
      </p>

      <h2>Changes</h2>
      <p>
        We may update this policy. Material changes will be posted on this page with
        an updated date.
      </p>
    </LegalLayout>
  );
}
