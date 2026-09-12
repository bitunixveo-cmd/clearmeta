export const CLERK_ROUTES = [
  "/sign-in",
  "/sign-up",
  "/verify",
  "/pricing",
  "/app/deep-clean",
] as const;

export function pathNeedsClerk(pathname: string): boolean {
  return CLERK_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}
