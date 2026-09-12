"use client";

import { useEffect, useState } from "react";
import { PricingTable } from "@clerk/nextjs";

export function ProVerifyPricingTable({
  redirectUrl = "/verify?subscribed=1",
}: {
  redirectUrl?: string;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-[280px] items-center justify-center text-sm text-neutral-500">
        Loading plans…
      </div>
    );
  }

  return <PricingTable newSubscriptionRedirectUrl={redirectUrl} />;
}
