import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

/**
 * Handles Clerk billing lifecycle events. Entitlements are enforced via
 * auth().has({ plan }) — this route is for logging and future usage metering.
 */
export async function POST(req: NextRequest) {
  let evt;
  try {
    evt = await verifyWebhook(req);
  } catch {
    return new Response("Verification failed", { status: 400 });
  }

  const billingEvents = new Set([
    "subscription.created",
    "subscription.updated",
    "subscription.active",
    "subscription.pastDue",
    "subscriptionItem.canceled",
    "subscriptionItem.pastDue",
    "subscriptionItem.active",
    "paymentAttempt.created",
    "paymentAttempt.updated",
  ]);

  if (billingEvents.has(evt.type)) {
    console.info("[clerk-billing]", evt.type, evt.data);
  }

  return new Response("OK", { status: 200 });
}
