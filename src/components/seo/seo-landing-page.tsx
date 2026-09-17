import Link from "next/link";
import { ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";
import {
  ExpandedLandingContent,
  type ExpandedLandingTopic,
} from "@/components/seo/expanded-landing-content";

export type SeoLandingPageProps = {
  h1: string;
  intro: string;
  bullets: string[];
  expandedTopic: ExpandedLandingTopic;
  primaryCta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  alert?: string;
};

export function SeoLandingPage({
  h1,
  intro,
  bullets,
  expandedTopic,
  primaryCta = { href: "/app", label: "Remove metadata free" },
  secondaryCta,
  alert,
}: SeoLandingPageProps) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-sm font-medium text-stone-500">ClearMeta</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-950">
          {h1}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-600">{intro}</p>

        {alert && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{alert}</p>
          </div>
        )}

        <ul className="mt-8 space-y-3">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-3 text-stone-700">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              {bullet}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href={primaryCta.href}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-950 px-8 py-3.5 text-base font-semibold text-white hover:bg-stone-800"
          >
            {primaryCta.label}
            <ArrowRight className="h-5 w-5" />
          </Link>
          {secondaryCta && (
            <Link
              href={secondaryCta.href}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 px-8 py-3.5 text-base font-semibold text-stone-700 hover:bg-stone-50"
            >
              {secondaryCta.label}
            </Link>
          )}
        </div>

        <ExpandedLandingContent topic={expandedTopic} />
      </div>
    </div>
  );
}
