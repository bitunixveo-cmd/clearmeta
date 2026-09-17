import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SEO_GUIDE_LINKS } from "@/lib/seo-keywords";

export type ExpandedLandingTopic =
  | "chatgpt"
  | "c2pa"
  | "synthid"
  | "ai"
  | "midjourney";

type ExpandedLandingProps = {
  topic: ExpandedLandingTopic;
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
          {SEO_GUIDE_LINKS.map((guide) => (
            <li key={guide.href}>
              <Link href={guide.href} className="hover:text-stone-950">
                {guide.title}
              </Link>
            </li>
          ))}
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
  ai: [
    {
      title: "What is AI metadata?",
      paragraphs: [
        "AI metadata includes C2PA Content Credentials, XMP trainedAlgorithmicMedia tags, EXIF software fields, and generator-specific blocks that identify how an image was created. ChatGPT, DALL·E, Midjourney, Adobe Firefly, and Stable Diffusion commonly embed these tags on export.",
        "Removing AI metadata is different from removing visible watermarks. ClearMeta targets file-level tags that platforms like Instagram and Facebook may read as AI Info or contains AI-generated media signals.",
      ],
    },
    {
      title: "How to remove AI metadata before upload",
      paragraphs: [
        "Export the original file from your AI tool — not a screenshot. Upload to ClearMeta at /app for automatic scan and strip. Review the before/after metadata panel, download the cleaned file, and upload that version to social platforms or clients.",
        "Batch mode supports multiple images with ZIP download. Files auto-delete from our servers after one hour.",
      ],
    },
    {
      title: "Remove AI label on Instagram and other platforms",
      paragraphs: [
        "Many AI Info labels are triggered by C2PA and XMP metadata in the file itself. Stripping those tags before upload can prevent metadata-driven labels. Pixel watermarks like SynthID are separate — use Pro Verify to detect them.",
      ],
    },
  ],
  midjourney: [
    {
      title: "What metadata does Midjourney embed?",
      paragraphs: [
        "Midjourney exports may include XMP generation parameters, prompt fragments, model identifiers, and in some workflows C2PA or PNG text chunks with workflow data. The exact fields depend on your export path and upscaler settings.",
        "ClearMeta scans for supported containers and strips AI-related metadata while preserving image quality.",
      ],
    },
    {
      title: "How to remove Midjourney metadata",
      paragraphs: [
        "Upload your Midjourney PNG or JPEG to the free tool. ClearMeta detects XMP, EXIF, C2PA, and PNG text chunks, then removes selected AI metadata. Compare before and after for every file.",
      ],
    },
    {
      title: "Midjourney vs SynthID",
      paragraphs: [
        "Standard Midjourney cleaning removes file metadata, not invisible pixel watermarks. If you need SynthID detection after cleaning, run Pro Verify at /verify.",
      ],
    },
  ],
} as const;
