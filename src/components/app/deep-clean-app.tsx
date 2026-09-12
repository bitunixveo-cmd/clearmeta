"use client";

import { useCallback, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FlaskConical,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { cn, formatBytes } from "@/lib/utils";
import { ComparePanel } from "@/components/app/compare-panel";
import { ShareReportButton } from "@/components/app/share-report-button";
import type { DeepCleanResult } from "@/lib/deep-clean/pipeline";

export function DeepCleanApp() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [result, setResult] = useState<DeepCleanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const processFile = useCallback(async (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setStatus("processing");
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", f);

      const res = await fetch("/api/deep-clean", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Deep Clean failed");

      setResult(data);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deep Clean failed");
      setStatus("error");
    }
  }, []);

  const clear = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setResult(null);
    setStatus("idle");
    setError(null);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
        <FlaskConical className="h-3.5 w-3.5" />
        Beta — experimental
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-stone-950">
        Deep Clean
      </h1>
      <p className="mt-2 max-w-2xl text-stone-600">
        Experimental SynthID disruption via metadata strip, re-encode, resize cycle,
        and noise injection. Results are not guaranteed — re-verify with{" "}
        <Link href="/verify" className="font-medium text-stone-900 underline">
          Pro Verify
        </Link>
        .
      </p>

      <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          SynthID is embedded in pixels, not metadata. Deep Clean may cause slight
          quality loss. This is research-grade beta software.
        </p>
      </div>

      {!file && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files[0];
            if (f?.type.startsWith("image/")) processFile(f);
          }}
          className={cn(
            "relative mt-8 rounded-2xl border-2 border-dashed p-12 text-center transition",
            dragOver
              ? "border-stone-950 bg-stone-100"
              : "border-stone-300 bg-white hover:border-stone-400"
          )}
        >
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) processFile(f);
            }}
          />
          <Upload className="mx-auto h-10 w-10 text-stone-400" />
          <p className="mt-4 font-semibold text-stone-950">
            Drop an image for Deep Clean
          </p>
          <p className="mt-1 text-sm text-stone-500">Max 25MB · JPEG, PNG, WebP</p>
        </div>
      )}

      {file && (
        <div className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="flex items-start gap-4 p-5">
            {preview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt={file.name}
                className="h-20 w-20 rounded-xl object-cover"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-stone-950">{file.name}</p>
              <p className="text-sm text-stone-500">{formatBytes(file.size)}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {status === "processing" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Running Deep Clean pipeline…
                  </span>
                )}
                {status === "done" && result && (
                  <>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-800">
                      <CheckCircle2 className="h-3 w-3" />
                      Complete
                    </span>
                    <a
                      href={result.downloadUrl}
                      download
                      className="inline-flex items-center gap-1.5 rounded-md bg-stone-950 px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-800"
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </a>
                    <ShareReportButton
                      payload={{
                        type: "deep-clean",
                        title: "Deep Clean report",
                        originalFilename: result.originalFilename,
                        before: result.before,
                        after: result.after,
                        deepClean: {
                          stepsApplied: result.stepsApplied,
                          downloadUrl: result.downloadUrl,
                        },
                      }}
                      className="inline-flex items-center gap-1.5 rounded-md border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50"
                    />
                  </>
                )}
                <button
                  type="button"
                  onClick={clear}
                  className="rounded p-1 text-stone-400 hover:bg-stone-100"
                  aria-label="Clear"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>
          </div>

          {result && (
            <div className="border-t border-stone-100 bg-stone-50 px-5 py-4">
              <ComparePanel before={result.before} after={result.after} />
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Pipeline steps
                </p>
                <ul className="mt-2 space-y-1">
                  {result.stepsApplied.map((step) => (
                    <li
                      key={step}
                      className="flex items-center gap-2 text-sm text-stone-700"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
              {result.warnings.map((w) => (
                <p key={w} className="mt-2 text-xs text-amber-700">
                  {w}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
