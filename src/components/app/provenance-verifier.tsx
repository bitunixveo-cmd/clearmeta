"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  Loader2,
  Lock,
  ScanSearch,
  Shield,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { cn, formatBytes } from "@/lib/utils";
import type { ProvenanceCheckResult } from "@/lib/provenance/types";
import { PROVENANCE_PRICING } from "@/lib/provenance/pricing";
import type { CleanResult } from "@/lib/metadata/types";
import { ShareReportButton } from "@/components/app/share-report-button";
import { PremiumBadge } from "@/components/premium-badge";
import { PRO_VERIFY_PLAN_SLUG } from "@/lib/provenance/billing";

interface VerifyJob {
  file: File;
  preview: string;
  status: "idle" | "checking" | "done" | "error";
  result?: ProvenanceCheckResult;
  error?: string;
  cleanStatus?: "idle" | "cleaning" | "done" | "error";
  cleanError?: string;
  clean?: CleanResult;
}

export function ProvenanceVerifier() {
  const [jobs, setJobs] = useState<VerifyJob[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const { isLoaded, has } = useAuth();
  const isPremium = isLoaded && has?.({ plan: PRO_VERIFY_PLAN_SLUG });
  const [config, setConfig] = useState<{
    enabled: boolean;
    requiresAccessCode: boolean;
  } | null>(null);

  useEffect(() => {
    fetch("/api/provenance/config")
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => setConfig({ enabled: false, requiresAccessCode: false }));

    const saved = localStorage.getItem("clearmeta_pro_code");
    if (saved) setAccessCode(saved);
  }, []);

  const saveAccessCode = (code: string) => {
    setAccessCode(code);
    if (code) localStorage.setItem("clearmeta_pro_code", code);
    else localStorage.removeItem("clearmeta_pro_code");
  };

  const verifyFile = useCallback(
    async (index: number, file: File) => {
      setJobs((prev) =>
        prev.map((j, i) =>
          i === index ? { ...j, status: "checking", error: undefined } : j
        )
      );

      try {
        const formData = new FormData();
        formData.append("file", file);
        if (accessCode) formData.append("accessCode", accessCode);

        const res = await fetch("/api/provenance", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Verification failed");

        setJobs((prev) =>
          prev.map((j, i) =>
            i === index
              ? { ...j, status: "done", result: data.result }
              : j
          )
        );
      } catch (err) {
        setJobs((prev) =>
          prev.map((j, i) =>
            i === index
              ? {
                  ...j,
                  status: "error",
                  error:
                    err instanceof Error ? err.message : "Verification failed",
                }
              : j
          )
        );
      }
    },
    [accessCode]
  );

  const cleanMetadata = useCallback(async (index: number, file: File) => {
    setJobs((prev) =>
      prev.map((j, i) =>
        i === index
          ? { ...j, cleanStatus: "cleaning", cleanError: undefined }
          : j
      )
    );

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/process", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Metadata removal failed");

      setJobs((prev) =>
        prev.map((j, i) =>
          i === index
            ? { ...j, cleanStatus: "done", clean: data }
            : j
        )
      );
    } catch (err) {
      setJobs((prev) =>
        prev.map((j, i) =>
          i === index
            ? {
                ...j,
                cleanStatus: "error",
                cleanError:
                  err instanceof Error ? err.message : "Metadata removal failed",
              }
            : j
        )
      );
    }
  }, []);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const imageFiles = Array.from(files).filter((f) =>
        f.type.startsWith("image/")
      );
      if (!imageFiles.length) return;

      setJobs((prev) => {
        const start = prev.length;
        const newJobs: VerifyJob[] = imageFiles.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
          status: "idle",
        }));

        queueMicrotask(() => {
          imageFiles.forEach((file, i) => verifyFile(start + i, file));
        });

        return [...prev, ...newJobs];
      });
    },
    [verifyFile]
  );

  const configured = config?.enabled;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-neutral-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-700">
              <Lock className="h-3.5 w-3.5" />
              Pro tool
            </div>
            {isPremium && <PremiumBadge label="Premium" />}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
            SynthID & Provenance Verify
          </h1>
          <p className="mt-2 max-w-xl text-neutral-600">
            Step 1: Detect SynthID & C2PA. Step 2: Remove metadata and
            download — SynthID pixel watermarks cannot be stripped, only C2PA
            metadata can.
          </p>
        </div>
        <Link
          href="/app"
          className="shrink-0 text-sm font-medium text-neutral-500 hover:text-neutral-950"
        >
          ← Free metadata remover
        </Link>
      </div>

      {/* Pricing card */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <p className="text-sm font-medium text-neutral-500">Pay per check</p>
          <p className="mt-2 text-3xl font-bold text-neutral-950">
            ${PROVENANCE_PRICING.perCheck}
            <span className="text-base font-normal text-neutral-500">
              {" "}
              / image
            </span>
          </p>
          <p className="mt-2 text-sm text-neutral-600">
            C2PA + SynthID scan via OpenAI verification API
          </p>
        </div>
        <div className="rounded-xl border border-neutral-900 bg-neutral-900 p-6 text-white">
          <p className="text-sm font-medium text-neutral-400">Pro plan</p>
          <p className="mt-2 text-3xl font-bold">
            ${PROVENANCE_PRICING.monthly}
            <span className="text-base font-normal text-neutral-400">/mo</span>
          </p>
          <p className="mt-2 text-sm text-neutral-300">
            {PROVENANCE_PRICING.checksIncluded} checks included, then $
            {PROVENANCE_PRICING.perCheck} each
          </p>
        </div>
      </div>

      {/* Access code */}
      {config?.requiresAccessCode && (
        <div className="mb-6 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <label className="text-sm font-medium text-neutral-900">
            Pro access code
          </label>
          <input
            type="password"
            value={accessCode}
            onChange={(e) => saveAccessCode(e.target.value)}
            placeholder="Enter your access code"
            className="mt-2 w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-neutral-900"
          />
          <p className="mt-2 text-xs text-neutral-500">
            Required to run checks. Contact us or subscribe to get a code.
          </p>
        </div>
      )}

      {!configured && config !== null && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Server not configured</p>
            <p className="mt-1 text-amber-800">
              Add <code className="rounded bg-amber-100 px-1">OPENAI_API_KEY</code>{" "}
              to <code className="rounded bg-amber-100 px-1">.env.local</code>{" "}
              and restart the server.
            </p>
          </div>
        </div>
      )}

      {/* Upload */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
        }}
        className={cn(
          "relative rounded-xl border-2 border-dashed p-10 text-center transition",
          !configured && "pointer-events-none opacity-50",
          dragOver
            ? "border-neutral-900 bg-neutral-100"
            : "border-neutral-300 bg-white hover:border-neutral-400"
        )}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={!configured}
          className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <ScanSearch className="mx-auto h-8 w-8 text-neutral-400" strokeWidth={1.5} />
        <p className="mt-4 font-medium text-neutral-950">
          Drop an image to verify SynthID & C2PA
        </p>
        <p className="mt-1 text-sm text-neutral-500">
          PNG, JPEG, WebP — up to 20MB · ${PROVENANCE_PRICING.perCheck} per check
        </p>
      </div>

      {/* Results */}
      <div className="mt-6 space-y-4">
        {jobs.map((job, index) => (
          <div
            key={`${job.file.name}-${index}`}
            className="overflow-hidden rounded-xl border border-neutral-200 bg-white"
          >
            <div className="flex items-start gap-4 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={job.preview}
                alt={job.file.name}
                className="h-16 w-16 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="truncate font-medium text-neutral-950">
                      {job.file.name}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {formatBytes(job.file.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      URL.revokeObjectURL(job.preview);
                      setJobs((prev) => prev.filter((_, i) => i !== index));
                    }}
                    className="rounded p-1 text-neutral-400 hover:bg-neutral-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {job.status === "checking" && (
                  <p className="mt-2 flex items-center gap-2 text-sm text-neutral-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Checking with OpenAI…
                  </p>
                )}
                {job.error && (
                  <p className="mt-2 text-sm text-red-600">{job.error}</p>
                )}
              </div>
            </div>

            {job.result && (
              <ProvenanceResults
                result={job.result}
                job={job}
                onClean={() => cleanMetadata(index, job.file)}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-600">
        <p className="flex items-center gap-2 font-medium text-neutral-900">
          <Zap className="h-4 w-4" />
          What this detects
        </p>
        <ul className="mt-3 space-y-2">
          <li>
            <strong>SynthID</strong> — invisible pixel watermark (survives
            metadata removal)
          </li>
          <li>
            <strong>C2PA</strong> — signed Content Credentials in file metadata
          </li>
          <li>
            Only detects <strong>OpenAI</strong> signals (ChatGPT, DALL·E, API).
            Google Gemini SynthID requires Gemini app verification.
          </li>
        </ul>
      </div>
    </div>
  );
}

function ProvenanceResults({
  result,
  job,
  onClean,
}: {
  result: ProvenanceCheckResult;
  job: VerifyJob;
  onClean: () => void;
}) {
  const c2paDetected = result.c2pa?.outcome === "detected";
  const synthidDetected = result.synthid?.outcome === "detected";

  return (
    <div className="border-t border-neutral-100 bg-neutral-50 px-4 py-4">
      <p className="mb-3 text-sm text-neutral-600">{result.summary}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <SignalCard
          title="C2PA Content Credentials"
          icon={Shield}
          detected={c2paDetected}
          details={[
            result.c2pa?.issuer && `Issuer: ${result.c2pa.issuer}`,
            result.c2pa?.model && `Model: ${result.c2pa.model}`,
            result.c2pa?.validationState &&
              `Validation: ${result.c2pa.validationState}`,
            result.c2pa?.generatedAt &&
              `Generated: ${new Date(result.c2pa.generatedAt).toLocaleDateString()}`,
            c2paDetected ? "Removable via metadata strip" : undefined,
          ].filter(Boolean) as string[]}
        />
        <SignalCard
          title="SynthID Watermark"
          icon={ScanSearch}
          detected={synthidDetected}
          details={[
            synthidDetected
              ? "Invisible watermark found in pixels"
              : "No OpenAI SynthID watermark detected",
            result.synthid?.model && `Model: ${result.synthid.model}`,
            "Not removable via metadata strip",
          ].filter(Boolean) as string[]}
        />
      </div>

      {/* Actions: remove metadata + download */}
      <div className="mt-4 rounded-lg border border-neutral-200 bg-white p-4">
        <p className="text-sm font-medium text-neutral-900">
          Remove metadata & download
        </p>
        <p className="mt-1 text-xs text-neutral-500">
          Strips C2PA, EXIF, and XMP tags for free. SynthID in pixels will
          likely still be detected if you re-verify.
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <ShareReportButton
            payload={{
              type: "verify",
              title: "Provenance verification report",
              originalFilename: result.filename,
              before: {
                filename: result.filename,
                format: result.mimeType.split("/")[1] || "unknown",
                fileSize: result.fileSize,
                mimeType: result.mimeType,
                c2pa: {
                  present: c2paDetected,
                  issuer: result.c2pa?.issuer || undefined,
                  model: result.c2pa?.model || undefined,
                  validationState: result.c2pa?.validationState,
                },
                aiTags: [],
                hasAiMetadata: c2paDetected || synthidDetected,
                removableByStrip: c2paDetected,
                warnings: synthidDetected
                  ? ["SynthID detected — not removable via metadata strip"]
                  : [],
              },
              provenance: result,
            }}
            className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          />
          {job.cleanStatus !== "done" && (
            <button
              type="button"
              onClick={onClean}
              disabled={job.cleanStatus === "cleaning"}
              className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
            >
              {job.cleanStatus === "cleaning" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Removing metadata…
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Remove C2PA metadata
                </>
              )}
            </button>
          )}

          {job.cleanStatus === "done" && job.clean && (
            <>
              <a
                href={job.clean.downloadUrl}
                download
                className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                <Download className="h-4 w-4" />
                Download cleaned image
              </a>
              <span className="text-xs text-neutral-500">
                {formatBytes(job.clean.cleanedSize)} · C2PA removed
              </span>
            </>
          )}

          {job.cleanError && (
            <p className="text-sm text-red-600">{job.cleanError}</p>
          )}
        </div>

        {job.clean?.after && (
          <div className="mt-3 rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
            <CheckCircle2 className="mr-1 inline h-3.5 w-3.5" />
            Metadata cleaned — C2PA and AI tags removed from file. SynthID
            watermark may still exist in pixels.
          </div>
        )}
      </div>
    </div>
  );
}

function SignalCard({
  title,
  icon: Icon,
  detected,
  details,
}: {
  title: string;
  icon: typeof Shield;
  detected?: boolean;
  details: string[];
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        detected
          ? "border-red-200 bg-red-50"
          : "border-emerald-200 bg-emerald-50"
      )}
    >
      <div className="flex items-center gap-2">
        <Icon
          className={cn(
            "h-4 w-4",
            detected ? "text-red-600" : "text-emerald-600"
          )}
        />
        <p
          className={cn(
            "text-sm font-semibold",
            detected ? "text-red-900" : "text-emerald-900"
          )}
        >
          {title}
        </p>
        {detected ? (
          <CheckCircle2 className="ml-auto h-4 w-4 text-red-500" />
        ) : (
          <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-500" />
        )}
      </div>
      <ul className="mt-2 space-y-1">
        {details.map((d) => (
          <li
            key={d}
            className={cn(
              "text-xs",
              detected ? "text-red-800" : "text-emerald-800"
            )}
          >
            {d}
          </li>
        ))}
      </ul>
    </div>
  );
}
