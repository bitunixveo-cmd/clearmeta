"use client";

import Link from "next/link";

export default function VerifyError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="text-xl font-semibold text-stone-950">
        Pro Verify unavailable
      </h1>
      <p className="mt-2 text-sm text-stone-600">
        Something went wrong loading this page. Refresh or return home.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-stone-950 px-4 py-2 text-sm font-medium text-white"
        >
          Try again
        </button>
        <Link
          href="/pricing"
          className="rounded-md border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700"
        >
          Pricing
        </Link>
      </div>
    </div>
  );
}
