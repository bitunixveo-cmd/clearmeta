import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/legal/layout";
import { JsonLd } from "@/components/json-ld";
import { FAQ_ITEMS } from "@/lib/faq-data";
import { faqPageSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "FAQ",
  description:
    "Frequently asked questions about removing C2PA, EXIF, SynthID, and AI metadata from images with ClearMeta.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={faqPageSchema(
          FAQ_ITEMS.map((item) => ({
            question: item.question,
            answer: item.answer,
          }))
        )}
      />
      <LegalLayout
        title="Frequently Asked Questions"
        description="Common questions about metadata removal and Pro Verify."
      >
        {FAQ_ITEMS.map((item) => (
          <div key={item.question}>
            <h2>{item.question}</h2>
            <p>{item.answer}</p>
          </div>
        ))}

        <p className="mt-8">
          Ready to start?{" "}
          <Link href="/app" className="font-medium text-stone-950 underline">
            Open the free metadata remover
          </Link>
          .
        </p>
      </LegalLayout>
    </>
  );
}
