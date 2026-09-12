import Link from "next/link";

export function LegalLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Link
          href="/"
          className="text-sm font-medium text-stone-500 hover:text-stone-950"
        >
          ← Back to ClearMeta
        </Link>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-stone-950">
          {title}
        </h1>
        <p className="mt-3 text-lg text-stone-600">{description}</p>
        <div className="prose prose-stone mt-10 max-w-none prose-headings:font-semibold prose-a:text-stone-950">
          {children}
        </div>
        <p className="mt-12 text-sm text-stone-400">
          Last updated: September 13, 2026
        </p>
      </div>
    </div>
  );
}
