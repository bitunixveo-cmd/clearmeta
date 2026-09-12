import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/layout";

export const metadata: Metadata = {
  title: "Terms of Service — ClearMeta",
  description: "Terms governing use of ClearMeta's free metadata remover and Pro Verify tools.",
};

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      description="By using ClearMeta, you agree to these terms."
    >
      <h2>Service description</h2>
      <p>
        ClearMeta provides free metadata removal and paid Pro Verify (SynthID/C2PA
        detection) tools. Deep Clean is an experimental beta feature with no
        guarantee of watermark removal.
      </p>

      <h2>Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Upload illegal content or content you do not have rights to process</li>
        <li>Abuse the service via automated scraping, denial-of-service, or rate-limit evasion</li>
        <li>Misrepresent cleaned images as human-created when disclosure is legally required</li>
        <li>Reverse-engineer or resell the service without permission</li>
      </ul>

      <h2>No warranty</h2>
      <p>
        The service is provided &quot;as is.&quot; Metadata removal and SynthID
        disruption results vary by file format, source model, and processing path.
        We do not guarantee complete removal of all watermarks, credentials, or
        provenance signals.
      </p>

      <h2>Pro Verify billing</h2>
      <p>
        Pro Verify pricing is displayed on the site. Usage-based charges apply per
        check beyond included limits. Subscriptions renew monthly unless cancelled.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, ClearMeta is not liable for indirect,
        incidental, or consequential damages arising from use of the service, including
        reputational harm from undisclosed AI-generated content.
      </p>

      <h2>Termination</h2>
      <p>
        We may suspend access for violations of these terms. You may stop using the
        service at any time.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by applicable law in the jurisdiction where ClearMeta
        operates. Disputes will be resolved in good faith before formal proceedings.
      </p>

      <h2>Contact</h2>
      <p>
        Questions: <a href="mailto:legal@clearmeta.app">legal@clearmeta.app</a>
      </p>
    </LegalLayout>
  );
}
