"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { pathNeedsClerk } from "@/lib/clerk-routes";

export function ClerkGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const needsClerk = clerkEnabled && pathNeedsClerk(pathname);

  if (!needsClerk) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/verify"
      signUpFallbackRedirectUrl="/verify"
    >
      {children}
    </ClerkProvider>
  );
}
