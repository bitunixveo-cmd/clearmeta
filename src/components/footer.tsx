import Link from "next/link";
import { LogoMark } from "@/components/logo";
import { SEO_GUIDE_LINKS } from "@/lib/seo-keywords";

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <LogoMark className="h-8 w-8" />
              <span className="font-semibold text-stone-950">ClearMeta</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-stone-500">
              Remove C2PA and AI metadata from generated images. Private,
              automatic, no account needed.
            </p>
          </div>

          <div className="flex flex-wrap gap-12 sm:gap-16">
            <div>
              <h4 className="text-sm font-semibold text-stone-900">Product</h4>
              <ul className="mt-4 space-y-2 text-sm text-stone-500">
                <li>
                  <Link href="/app" className="hover:text-stone-950">
                    Free tool
                  </Link>
                </li>
                <li>
                  <Link href="/verify" className="hover:text-stone-950">
                    Pro Verify
                  </Link>
                </li>
                <li>
                  <Link href="/app/deep-clean" className="hover:text-stone-950">
                    Deep Clean beta
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-stone-950">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-stone-950">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-900">Resources</h4>
              <ul className="mt-4 space-y-2 text-sm text-stone-500">
                {SEO_GUIDE_LINKS.map((guide) => (
                  <li key={guide.href}>
                    <Link href={guide.href} className="hover:text-stone-950">
                      {guide.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-900">Legal</h4>
              <ul className="mt-4 space-y-2 text-sm text-stone-500">
                <li>
                  <Link href="/privacy" className="hover:text-stone-950">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-stone-950">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-stone-950">
                    Security
                  </Link>
                </li>
                <li>Auto-delete after 1 hour</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-stone-200 pt-8 text-sm text-stone-400">
          © 2026 ClearMeta
        </div>
      </div>
    </footer>
  );
}
