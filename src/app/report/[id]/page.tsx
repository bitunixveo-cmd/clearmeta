import { notFound } from "next/navigation";
import Link from "next/link";
import { ComparePanel } from "@/components/app/compare-panel";
import { getReport } from "@/lib/reports";
import { getSiteUrl } from "@/lib/env";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const report = await getReport(id);
  if (!report) return { title: "Report not found" };

  return {
    title: `${report.title} — ClearMeta Report`,
    description: `Metadata ${report.type} report for ${report.originalFilename}`,
    openGraph: {
      title: report.title,
      url: `${getSiteUrl()}/report/${id}`,
    },
  };
}

export default async function ReportPage({ params }: PageProps) {
  const { id } = await params;
  const report = await getReport(id);

  if (!report) notFound();

  return (
    <div className="bg-stone-50">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <Link
          href="/"
          className="text-sm font-medium text-stone-500 hover:text-stone-950"
        >
          ← ClearMeta
        </Link>

        <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
            {report.type} report
          </p>
          <h1 className="mt-2 text-2xl font-bold text-stone-950">{report.title}</h1>
          <p className="mt-1 text-sm text-stone-500">{report.originalFilename}</p>
          <p className="mt-1 text-xs text-stone-400">
            Created {new Date(report.createdAt).toLocaleString()} · Expires{" "}
            {new Date(report.expiresAt).toLocaleDateString()}
          </p>

          <div className="mt-8">
            <ComparePanel before={report.before} after={report.after} />
          </div>

          {report.clean && (
            <div className="mt-6 rounded-xl bg-stone-50 p-4 text-sm text-stone-600">
              <p>
                Removed {report.clean.removedTags} metadata tags ·{" "}
                {(report.clean.originalSize / 1024).toFixed(0)} KB →{" "}
                {(report.clean.cleanedSize / 1024).toFixed(0)} KB
              </p>
            </div>
          )}

          {report.provenance && (
            <div className="mt-6 rounded-xl border border-stone-200 p-4">
              <h3 className="text-sm font-semibold text-stone-900">
                Provenance check
              </h3>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-stone-500">SynthID</dt>
                  <dd className="font-medium text-stone-900">
                    {report.provenance.synthid?.outcome === "detected"
                      ? "Detected"
                      : "Not detected"}
                  </dd>
                </div>
                <div>
                  <dt className="text-stone-500">C2PA</dt>
                  <dd className="font-medium text-stone-900">
                    {report.provenance.c2pa?.outcome === "detected"
                      ? "Detected"
                      : "Not detected"}
                  </dd>
                </div>
              </dl>
            </div>
          )}

          {report.deepClean && (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <h3 className="text-sm font-semibold text-amber-900">
                Deep Clean steps applied
              </h3>
              <ul className="mt-2 list-inside list-disc text-sm text-amber-800">
                {report.deepClean.stepsApplied.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
