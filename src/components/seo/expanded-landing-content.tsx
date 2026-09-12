import Link from "next/link";
import { ArrowRight } from "lucide-react";

type ExpandedLandingProps = {
  topic: "chatgpt" | "c2pa" | "synthid";
};

export function ExpandedLandingContent({ topic }: ExpandedLandingProps) {
  const sections = CONTENT[topic];

  return (
    <div className="mt-16 space-y-12 border-t border-stone-200 pt-12">
      {sections.map((section) => (
        <section key={section.title}>
          <h2 className="text-2xl font-semibold text-stone-950">{section.title}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-4 leading-relaxed text-stone-600">
              {paragraph}
            </p>
          ))}
        </section>
      ))}

      <section>
        <h2 className="text-2xl font-semibold text-stone-950">Related guides</h2>
        <ul className="mt-4 space-y-2 text-stone-600">
          <li>
            <Link href="/remove-chatgpt-metadata" className="hover:text-stone-950">
              Remove ChatGPT & DALL·E metadata
            </Link>
          </li>
          <li>
            <Link href="/remove-c2pa-metadata" className="hover:text-stone-950">
              Remove C2PA Content Credentials
            </Link>
          </li>
          <li>
            <Link href="/remove-synthid-metadata" className="hover:text-stone-950">
              SynthID detection & Deep Clean
            </Link>
          </li>
          <li>
            <Link href="/faq" className="hover:text-stone-950">
              Frequently asked questions
            </Link>
          </li>
        </ul>
        <Link
          href="/app"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-stone-950 px-8 py-3.5 text-base font-semibold text-white hover:bg-stone-800"
        >
          Try the free tool
          <ArrowRight className="h-5 w-5" />
        </Link>
      </section>
    </div>
  );
}

const CONTENT = {
  chatgpt: [
    {
      title: "What metadata do ChatGPT and DALL·E embed?",
      paragraphs: [
        "Images exported from ChatGPT and DALL·E often include C2PA Content Credentials that record the generating software, model lineage, and authenticity assertions. Additional EXIF and XMP fields may identify the image as algorithmically generated.",
        "These tags are invisible in normal viewing but persist when you download, re-save, or repost the file. Platforms, journalists, and verification tools can read them with standard metadata parsers.",
      ],
    },
    {
      title: "How ClearMeta removes ChatGPT metadata",
      paragraphs: [
        "Upload your image to the free tool at /app. ClearMeta scans for C2PA/JUMBF blocks, EXIF, and XMP AI markers, then strips them using ExifTool while preserving image quality.",
        "You receive a before/after comparison for every file plus optional shareable reports. Files are deleted from the server after one hour.",
      ],
    },
    {
      title: "What ClearMeta does not remove",
      paragraphs: [
        "SynthID and other pixel-embedded watermarks are not metadata. They survive standard cleaning. Use Pro Verify at /verify to detect SynthID, or read our SynthID guide for limitations.",
      ],
    },
  ],
  c2pa: [
    {
      title: "What is C2PA?",
      paragraphs: [
        "C2PA (Coalition for Content Provenance and Authenticity) is an open standard for embedding signed Content Credentials in media files. Credentials are stored in JUMBF blocks and can include issuer identity, capture device, editing history, and AI generation assertions.",
        "Major AI tools and cameras increasingly write C2PA manifests by default, even when users do not see visible watermarks.",
      ],
    },
    {
      title: "Why remove C2PA Content Credentials?",
      paragraphs: [
        "Creators remove C2PA metadata for privacy, client delivery, stock uploads, or workflows where provenance tags are unwanted. ClearMeta provides a fast, automatic stripper with batch support and ZIP export.",
      ],
    },
    {
      title: "How the C2PA stripper works",
      paragraphs: [
        "ClearMeta detects validation state, issuer, and software agent fields, then removes JUMBF blocks and related XMP/EXIF tags. Processing runs server-side with ExifTool and completes in seconds for typical JPEG and PNG files.",
      ],
    },
  ],
  synthid: [
    {
      title: "What is SynthID?",
      paragraphs: [
        "SynthID is Google's invisible watermarking technology embedded in pixel data of some AI-generated images. Unlike C2PA metadata, SynthID is not stored in EXIF or XMP and cannot be removed by metadata strippers alone.",
        "Detection requires specialized verification such as ClearMeta Pro Verify, which uses OpenAI's Content Provenance API.",
      ],
    },
    {
      title: "Detection vs removal",
      paragraphs: [
        "Pro Verify at /verify scans for SynthID and C2PA signals and returns a structured report. Deep Clean beta applies re-encoding, resize cycles, and noise injection that may reduce detectability in some cases, but no tool guarantees complete SynthID removal.",
      ],
    },
    {
      title: "When to use each tool",
      paragraphs: [
        "Use the free metadata remover when you need C2PA and EXIF gone. Use Pro Verify when you need to know whether SynthID or C2PA is present. Use Deep Clean only for experimental workflows where slight quality loss is acceptable.",
      ],
    },
  ],
} as const;
