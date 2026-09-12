import { getSiteUrl } from "@/lib/env";

export function organizationSchema() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "ClearMeta",
        url: siteUrl,
        email: "privacy@clearmeta.app",
        description:
          "ClearMeta removes C2PA, EXIF, and XMP AI metadata from generated images.",
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "ClearMeta",
        publisher: { "@id": `${siteUrl}/#organization` },
      },
      {
        "@type": "SoftwareApplication",
        name: "ClearMeta",
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Web",
        url: `${siteUrl}/app`,
        description:
          "Remove C2PA Content Credentials, EXIF, and XMP AI tags from AI-generated images.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
    ],
  };
}

export function faqPageSchema(
  items: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
