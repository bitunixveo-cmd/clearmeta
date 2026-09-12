"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { useSearchParams } from "next/navigation";

export function ProSubscriptionWelcome() {
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (searchParams.get("subscribed") === "1") {
      setVisible(true);
      window.history.replaceState({}, "", "/verify");
    }
  }, [searchParams]);

  if (!visible) return null;

  return (
    <div className="mx-auto mb-6 max-w-4xl px-4 sm:px-6">
      <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Welcome to Pro Verify</p>
          <p className="mt-0.5 text-emerald-800">
            Your subscription is active. You now have premium access to SynthID
            and C2PA checks — look for the Pro badge on your profile.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="shrink-0 rounded p-1 text-emerald-600 hover:bg-emerald-100"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
