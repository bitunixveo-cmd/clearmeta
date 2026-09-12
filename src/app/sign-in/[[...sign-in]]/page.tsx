import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isClerkEnabled } from "@/lib/auth";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Sign In",
  description: "Sign in to ClearMeta for Pro Verify and Deep Clean.",
  path: "/sign-in",
  noIndex: true,
});

export default function SignInPage() {
  if (!isClerkEnabled()) {
    redirect("/verify");
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-stone-50 px-4 py-16">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg border border-stone-200",
          },
        }}
      />
    </div>
  );
}
