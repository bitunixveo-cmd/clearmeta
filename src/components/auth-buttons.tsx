"use client";

import { useEffect, useState } from "react";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/nextjs";
import { PremiumBadge } from "@/components/premium-badge";
import { PRO_VERIFY_PLAN_SLUG } from "@/lib/provenance/billing";

export function AuthButtons() {
  const [mounted, setMounted] = useState(false);
  const { isLoaded, has } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-3" aria-hidden>
        <div className="h-9 w-16 rounded-md bg-stone-100" />
        <div className="h-9 w-16 rounded-md bg-stone-100" />
      </div>
    );
  }

  const isPremium = isLoaded && has?.({ plan: PRO_VERIFY_PLAN_SLUG });

  return (
    <>
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button
            type="button"
            className="rounded-md px-3 py-2 text-sm font-medium text-stone-600 hover:text-stone-950"
          >
            Sign in
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button
            type="button"
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Sign up
          </button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <div className="flex items-center gap-2">
          {isPremium && <PremiumBadge label="Premium" />}
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: isPremium
                  ? "ring-2 ring-amber-400 ring-offset-1"
                  : undefined,
              },
            }}
          />
        </div>
      </Show>
    </>
  );
}
