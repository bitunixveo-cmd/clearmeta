import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FileImage,
  Lock,
  Scan,
  Sparkles,
  Zap,
} from "lucide-react";
import { SEO_GUIDE_LINKS } from "@/lib/seo-keywords";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute inset-0 bg-gradient-to-b from-stone-100/60 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-1.5 text-sm font-medium text-stone-700">
            <Sparkles className="h-4 w-4" />
            C2PA & AI metadata removal
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl lg:text-6xl">
            Strip AI metadata from your images{" "}
            <span className="underline decoration-stone-300 decoration-2 underline-offset-4">
              in seconds
            </span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-stone-600 sm:text-xl">
            Remove Content Credentials (C2PA), EXIF, and XMP tags embedded by
            ChatGPT, DALL·E, Midjourney, Adobe Firefly, and other AI tools —
            without sacrificing image quality.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-stone-900/10 transition hover:bg-stone-800"
            >
              Start cleaning free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-8 py-3.5 text-base font-semibold text-stone-700 transition hover:border-stone-400 hover:bg-stone-50"
            >
              See how it works
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-stone-500">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Automatic on upload
            </span>
            <span className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-emerald-600" />
              Files deleted after 1 hour
            </span>
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-600" />
              Batch processing
            </span>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-4xl">
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl shadow-stone-900/5">
            <div className="flex items-center gap-2 border-b border-stone-200 bg-stone-50 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-amber-400" />
              <div className="h-3 w-3 rounded-full bg-emerald-400" />
              <span className="ml-2 text-xs font-medium text-stone-500">
                ClearMeta — metadata scan
              </span>
            </div>
            <div className="grid gap-0 md:grid-cols-2">
              <div className="border-b border-stone-200 p-6 md:border-b-0 md:border-r">
                <p className="text-xs font-semibold uppercase tracking-wider text-red-500">
                  Before
                </p>
                <div className="mt-3 space-y-2 font-mono text-xs text-stone-600">
                  <p className="rounded bg-red-50 px-2 py-1 text-red-700">
                    C2PA: OpenAI OpCo — DALL·E
                  </p>
                  <p className="rounded bg-red-50 px-2 py-1 text-red-700">
                    Action: c2pa.created
                  </p>
                  <p className="rounded bg-red-50 px-2 py-1 text-red-700">
                    digitalSourceType: trainedAlgorithmicMedia
                  </p>
                  <p className="rounded bg-red-50 px-2 py-1 text-red-700">
                    JUMBF manifest: present
                  </p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                  After
                </p>
                <div className="mt-3 space-y-2 font-mono text-xs text-stone-600">
                  <p className="rounded bg-emerald-50 px-2 py-1 text-emerald-700">
                    C2PA: not present
                  </p>
                  <p className="rounded bg-emerald-50 px-2 py-1 text-emerald-700">
                    AI tags: 0 detected
                  </p>
                  <p className="rounded bg-emerald-50 px-2 py-1 text-emerald-700">
                    EXIF/XMP: stripped
                  </p>
                  <p className="rounded bg-emerald-50 px-2 py-1 text-emerald-700">
                    Image quality: preserved
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Features() {
  const features = [
    {
      icon: Scan,
      title: "Deep metadata scan",
      description:
        "Detects C2PA Content Credentials, JUMBF manifests, XMP digitalSourceType tags, and software agent fields from all major AI tools.",
    },
    {
      icon: FileImage,
      title: "Lossless cleaning",
      description:
        "Strips metadata without re-encoding pixels. Your image dimensions and visual quality stay intact.",
    },
    {
      icon: Lock,
      title: "Privacy by design",
      description:
        "Files are processed locally on your server. Auto-deleted after one hour. No tracking, no cloud storage.",
    },
    {
      icon: Zap,
      title: "Automatic processing",
      description:
        "Upload multiple images at once. Each one is scanned and cleaned automatically — no extra clicks.",
    },
  ];

  return (
    <section id="features" className="border-t border-stone-200 bg-white py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
            Everything you need to clean AI images
          </h2>
          <p className="mt-4 text-lg text-stone-600">
            Built on ExifTool and the C2PA standard — the same metadata systems
            used by OpenAI, Adobe, and Google.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-stone-200 bg-stone-50/50 p-6 transition hover:border-stone-300 hover:bg-white hover:shadow-lg hover:shadow-stone-900/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-950 text-white transition group-hover:scale-105">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-stone-950">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Upload your images",
      description:
        "Drag and drop JPEG, PNG, WebP, or TIFF files. Supports images from ChatGPT, DALL·E, Midjourney, Firefly, and more.",
    },
    {
      step: "02",
      title: "Auto-scan & clean",
      description:
        "We detect C2PA manifests, JUMBF blocks, XMP tags, and EXIF fields — then strip them automatically.",
    },
    {
      step: "03",
      title: "Download",
      description:
        "Your clean image is ready instantly. No manual steps required.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-lg text-stone-600">
            Three steps. No account. No complexity.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((item) => (
            <div key={item.step} className="relative">
              <span className="text-5xl font-bold text-stone-200">
                {item.step}
              </span>
              <h3 className="mt-2 text-xl font-semibold text-stone-950">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for occasional use",
      features: [
        "10 images per day",
        "C2PA & EXIF removal",
        "Batch upload (5 files)",
        "1-hour file retention",
      ],
      cta: "Get started free",
      href: "/app",
      highlighted: false,
    },
    {
      name: "Pro Verify",
      price: "$9",
      period: "/month",
      description: "SynthID & C2PA detection",
      features: [
        "100 provenance checks / month",
        "SynthID invisible watermark scan",
        "C2PA Content Credentials check",
        "OpenAI verification API",
        "Then $0.15 per extra check",
      ],
      cta: "View plans & subscribe",
      href: "#subscribe",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Self-hosted deployment",
      features: [
        "Unlimited everything",
        "On-premise install",
        "Custom integrations",
        "SLA & support",
      ],
      cta: "Contact us",
      href: "/faq",
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="border-t border-stone-200 bg-white py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-stone-600">
            Start free. Upgrade when you need more.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 ${
                plan.highlighted
                  ? "border-stone-950 bg-stone-950 text-white shadow-xl shadow-stone-900/10"
                  : "border-stone-200 bg-stone-50/50"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-950">
                  Popular
                </span>
              )}
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span
                    className={
                      plan.highlighted ? "text-stone-400" : "text-stone-500"
                    }
                  >
                    {plan.period}
                  </span>
                )}
              </div>
              <p
                className={`mt-2 text-sm ${
                  plan.highlighted ? "text-stone-400" : "text-stone-500"
                }`}
              >
                {plan.description}
              </p>
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <CheckCircle2
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        plan.highlighted ? "text-stone-400" : "text-emerald-600"
                      }`}
                    />
                    <span
                      className={
                        plan.highlighted ? "text-stone-300" : "text-stone-600"
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`mt-8 block rounded-full py-3 text-center text-sm font-semibold transition ${
                  plan.highlighted
                    ? "bg-white text-stone-950 hover:bg-stone-100"
                    : "bg-stone-950 text-white hover:bg-stone-800"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div
          id="subscribe"
          className="mt-16 scroll-mt-24 rounded-2xl border border-stone-200 bg-stone-50/50 p-8 text-center"
        >
          <h3 className="text-xl font-semibold text-stone-950">
            Subscribe to Pro Verify
          </h3>
          <p className="mx-auto mt-2 max-w-lg text-sm text-stone-600">
            SynthID and C2PA detection from $9/mo. Secure checkout powered by
            Clerk. Cancel anytime.
          </p>
          <Link
            href="/pricing"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-stone-950 px-8 py-3.5 text-sm font-semibold text-white hover:bg-stone-800"
          >
            View pricing & subscribe
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function SeoResources() {
  return (
    <section className="border-t border-stone-200 bg-stone-50 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-stone-950">
            Guides & resources
          </h2>
          <p className="mt-4 text-lg text-stone-600">
            Learn how to remove AI metadata, C2PA, and SynthID from your images.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SEO_GUIDE_LINKS.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="rounded-2xl border border-stone-200 bg-white p-6 transition hover:border-stone-300 hover:shadow-sm"
            >
              <h3 className="text-lg font-semibold text-stone-950">
                {guide.title}
              </h3>
              <p className="mt-2 text-sm text-stone-600">{guide.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-stone-950 px-8 py-16 text-center shadow-2xl shadow-stone-900/10 sm:px-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to clean your AI images?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-stone-400">
            Upload your first image and see exactly what metadata is hiding
            inside — removed automatically on upload.
          </p>
          <Link
            href="/app"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-stone-950 shadow-lg transition hover:bg-stone-100"
          >
            Open the app
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

const SUPPORTED_TOOLS = [
  { name: "ChatGPT", logo: "/brands/chatgpt.svg" },
  { name: "DALL·E 3", logo: "/brands/dalle.svg" },
  { name: "Midjourney", logo: "/brands/midjourney.svg" },
  { name: "Adobe Firefly", logo: "/brands/firefly.svg" },
  { name: "Stable Diffusion", logo: "/brands/stable-diffusion.svg" },
  { name: "Google Gemini", logo: "/brands/gemini.svg" },
  { name: "Leonardo AI", logo: "/brands/leonardo.svg" },
  { name: "Ideogram", logo: "/brands/ideogram.svg" },
] as const;

export function SupportedTools() {
  return (
    <section className="border-y border-stone-200 bg-stone-50 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-sm font-medium text-stone-500">
          Removes metadata from images generated by
        </p>
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {SUPPORTED_TOOLS.map((tool) => (
            <li
              key={tool.name}
              className="flex flex-col items-center gap-3 text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-stone-200 bg-white p-2.5 shadow-sm">
                <img
                  src={tool.logo}
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <span className="text-xs font-semibold text-stone-600 sm:text-sm">
                {tool.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
