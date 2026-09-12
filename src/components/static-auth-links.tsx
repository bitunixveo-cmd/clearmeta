import Link from "next/link";

export function StaticAuthLinks() {
  return (
    <>
      <Link
        href="/sign-in"
        className="rounded-md px-3 py-2 text-sm font-medium text-stone-600 hover:text-stone-950"
      >
        Sign in
      </Link>
      <Link
        href="/sign-up"
        className="rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
      >
        Sign up
      </Link>
    </>
  );
}
