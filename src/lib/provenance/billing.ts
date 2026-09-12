/** Clerk Billing plan slug — must match Dashboard → Billing → Plans → Key */
export const PRO_VERIFY_PLAN_SLUG = "pro_verify";

/** Clerk Billing plan ID — Dashboard → Billing → Plans */
export const PRO_VERIFY_PLAN_ID =
  process.env.NEXT_PUBLIC_CLERK_PRO_VERIFY_PLAN_ID ??
  "cplan_3JFIl8kZnJfmIzworzOqwvBoxAy";

/** Feature slug for granular gating (attach to the plan in Dashboard) */
export const PRO_VERIFY_FEATURE_SLUG = "pro_verify_checks";
