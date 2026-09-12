"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/logo";
import { AuthButtons } from "@/components/auth-buttons";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "pricing", label: "Pricing" },
  { href: "/app", label: "Free tool" },
];

const toolLinks = [
  {
    href: "/verify",
    label: "SynthID Verify",
    description: "Pro Verify — SynthID & C2PA detection",
  },
  {
    href: "/app/deep-clean",
    label: "Deep Clean",
    description: "Beta — SynthID disruption pipeline",
  },
];

function pricingHref(pathname: string) {
  return pathname === "/" ? "/#pricing" : "/pricing";
}

function ToolsDropdown({ active }: { active: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "inline-flex items-center gap-1 text-sm font-medium transition-colors hover:text-stone-950",
          active ? "text-stone-950" : "text-stone-500"
        )}
      >
        Tools
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-[calc(100%+0.75rem)] z-50 w-72 rounded-xl border border-stone-200 bg-white p-2 shadow-lg"
        >
          {toolLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-stone-50"
            >
              <span className="block text-sm font-medium text-stone-950">
                {link.label}
              </span>
              <span className="mt-0.5 block text-xs text-stone-500">
                {link.description}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isApp =
    pathname.startsWith("/app") ||
    pathname.startsWith("/verify") ||
    pathname === "/pricing";
  const isToolsActive =
    pathname.startsWith("/verify") || pathname.startsWith("/app/deep-clean");

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <LogoMark className="h-9 w-9" />
          <span className="text-lg font-semibold tracking-tight text-stone-950">
            ClearMeta
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const href =
              link.href === "pricing" ? pricingHref(pathname) : link.href;
            return (
              <Link
                key={link.label}
                href={href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-stone-950",
                  isApp && link.href === "/app"
                    ? "text-stone-950"
                    : "text-stone-500"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <ToolsDropdown active={isToolsActive} />
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <AuthButtons />
          <Link
            href="/app"
            className="rounded-md bg-neutral-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Remove metadata
          </Link>
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-stone-600 hover:bg-stone-100 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-stone-200 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => {
              const href =
                link.href === "pricing" ? pricingHref(pathname) : link.href;
              return (
                <Link
                  key={link.label}
                  href={href}
                  className="text-sm font-medium text-stone-700"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                Tools
              </p>
              <div className="mt-2 flex flex-col gap-2 pl-2">
                {toolLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-stone-700"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              href="/app"
              className="mt-2 rounded-md bg-stone-950 px-4 py-2.5 text-center text-sm font-medium text-white"
              onClick={() => setMobileOpen(false)}
            >
              Remove metadata
            </Link>
            <div className="mt-3 flex justify-center gap-2">
              <AuthButtons />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
