import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/layout";

export const metadata: Metadata = {
  title: "Security — ClearMeta",
  description:
    "How ClearMeta protects uploaded images: auto-deletion, rate limits, and secure processing.",
};

export default function SecurityPage() {
  return (
    <LegalLayout
      title="Security"
      description="How we protect your files and infrastructure."
    >
      <h2>File handling</h2>
      <ul>
        <li>Uploads stored in isolated server directories with random UUIDs</li>
        <li>Automatic deletion after 1 hour (uploads, cleaned files, batch ZIPs)</li>
        <li>No permanent image storage or CDN caching of user content</li>
        <li>Shareable reports expire after 7 days</li>
      </ul>

      <h2>Transport & headers</h2>
      <ul>
        <li>HTTPS enforced in production</li>
        <li>Security headers: X-Frame-Options, X-Content-Type-Options, Referrer-Policy</li>
        <li>Download endpoints use Cache-Control: no-store</li>
      </ul>

      <h2>Rate limiting</h2>
      <p>
        API routes are rate-limited per IP to prevent abuse. Deep Clean and Pro Verify
        have stricter limits due to compute cost.
      </p>

      <h2>Authentication</h2>
      <p>
        Pro Verify and Deep Clean require Clerk authentication when enabled. Session
        tokens are managed by Clerk — we do not store passwords.
      </p>

      <h2>Pro Verify & third parties</h2>
      <p>
        When you use Pro Verify, images are sent to OpenAI&apos;s Content Provenance
        API over TLS. Review OpenAI&apos;s data handling before processing sensitive
        content.
      </p>

      <h2>Reporting vulnerabilities</h2>
      <p>
        Found a security issue? Email{" "}
        <a href="mailto:security@clearmeta.app">security@clearmeta.app</a>. We aim to
        respond within 72 hours.
      </p>
    </LegalLayout>
  );
}
