"use client";

import { useCallback, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileImage,
  Loader2,
  Package,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { cn, formatBytes } from "@/lib/utils";
import type { CleanResult, ScanResult } from "@/lib/metadata/types";
import { ShareReportButton } from "@/components/app/share-report-button";

interface FileJob {
  file: File;
  id?: string;
  scan?: ScanResult;
  clean?: CleanResult;
  status: "pending" | "scanning" | "cleaning" | "done" | "error";
  error?: string;
  preview?: string;
}

export function MetadataRemoverApp() {
  const [jobs, setJobs] = useState<FileJob[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [zipStatus, setZipStatus] = useState<"idle" | "loading" | "error">("idle");
  const processingRef = useRef<Set<number>>(new Set());

  const updateJob = useCallback((index: number, patch: Partial<FileJob>) => {
    setJobs((prev) =>
      prev.map((job, i) => (i === index ? { ...job, ...patch } : job))
    );
  }, []);

  const processFile = useCallback(
    async (index: number, file: File) => {
      if (processingRef.current.has(index)) return;
      processingRef.current.add(index);

      try {
        updateJob(index, { status: "scanning", error: undefined });

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/process", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Processing failed");
        }

        updateJob(index, {
          clean: data,
          id: data.id,
          scan: data.before,
          status: "done",
        });
      } catch (err) {
        updateJob(index, {
          status: "error",
          error: err instanceof Error ? err.message : "Processing failed",
        });
      } finally {
        processingRef.current.delete(index);
      }
    },
    [updateJob]
  );

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const imageFiles = Array.from(files).filter((f) =>
        f.type.startsWith("image/")
      );
      if (imageFiles.length === 0) return;

      setJobs((prev) => {
        const startIndex = prev.length;
        const newJobs: FileJob[] = imageFiles.map((file) => ({
          file,
          status: "pending",
          preview: URL.createObjectURL(file),
        }));

        queueMicrotask(() => {
          imageFiles.forEach((file, i) => {
            processFile(startIndex + i, file);
          });
        });

        return [...prev, ...newJobs];
      });
    },
    [processFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const retryFile = (index: number) => {
    const job = jobs[index];
    if (job) processFile(index, job.file);
  };

  const removeJob = (index: number) => {
    setJobs((prev) => {
      const job = prev[index];
      if (job.preview) URL.revokeObjectURL(job.preview);
      processingRef.current.delete(index);
      return prev.filter((_, i) => i !== index);
    });
  };

  const clearAll = () => {
    jobs.forEach((job) => {
      if (job.preview) URL.revokeObjectURL(job.preview);
    });
    processingRef.current.clear();
    setJobs([]);
  };

  const doneCount = jobs.filter((j) => j.status === "done").length;
  const processingCount = jobs.filter(
    (j) => j.status === "scanning" || j.status === "cleaning" || j.status === "pending"
  ).length;
  const doneIds = jobs
    .filter((j) => j.status === "done" && j.id)
    .map((j) => j.id as string);

  const downloadZip = async () => {
    if (doneIds.length === 0) return;
    setZipStatus("loading");
    try {
      const res = await fetch("/api/batch/zip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: doneIds }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "ZIP failed");
      window.location.href = data.downloadUrl;
      setZipStatus("idle");
    } catch {
      setZipStatus("error");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-stone-950">
          Metadata Remover
        </h1>
        <p className="mt-2 text-stone-600">
          Upload an image — we scan and clean it automatically.
        </p>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "relative rounded-2xl border-2 border-dashed p-12 text-center transition",
          dragOver
            ? "border-stone-950 bg-stone-100"
            : "border-stone-300 bg-white hover:border-stone-400 hover:bg-stone-50/50"
        )}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/tiff,image/avif,image/heic,image/heif"
          multiple
          className="absolute inset-0 cursor-pointer opacity-0"
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-700">
          <Upload className="h-7 w-7" />
        </div>
        <p className="mt-4 text-lg font-semibold text-stone-950">
          Drop images here or click to browse
        </p>
        <p className="mt-1 text-sm text-stone-500">
          JPEG, PNG, WebP, TIFF, AVIF, HEIC — up to 50MB each
        </p>
      </div>

      {jobs.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
          <span className="text-stone-500">
            {processingCount > 0
              ? `Processing ${processingCount}…`
              : `${doneCount} ready to download`}
          </span>
          <div className="flex items-center gap-3">
            {doneCount > 1 && (
              <button
                type="button"
                onClick={downloadZip}
                disabled={zipStatus === "loading"}
                className="inline-flex items-center gap-1.5 rounded-md bg-stone-950 px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-800 disabled:opacity-50"
              >
                {zipStatus === "loading" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Package className="h-3.5 w-3.5" />
                )}
                Download all as ZIP
              </button>
            )}
            {zipStatus === "error" && (
              <span className="text-xs text-red-600">ZIP failed</span>
            )}
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-950"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear all
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-3">
        {jobs.map((job, index) => (
          <FileCard
            key={`${job.file.name}-${job.file.size}-${index}`}
            job={job}
            onRetry={() => retryFile(index)}
            onRemove={() => removeJob(index)}
          />
        ))}
      </div>

      {jobs.length === 0 && (
        <div className="mt-12 rounded-2xl border border-stone-200 bg-white p-8 text-center">
          <FileImage className="mx-auto h-10 w-10 text-stone-300" />
          <p className="mt-3 text-sm text-stone-500">
            No files uploaded yet. Drop an image above to get started.
          </p>
        </div>
      )}
    </div>
  );
}

function FileCard({
  job,
  onRetry,
  onRemove,
}: {
  job: FileJob;
  onRetry: () => void;
  onRemove: () => void;
}) {
  const isProcessing =
    job.status === "pending" ||
    job.status === "scanning" ||
    job.status === "cleaning";

  const statusLabel = {
    pending: "Starting…",
    scanning: "Scanning…",
    cleaning: "Removing metadata…",
    done: "Ready",
    error: "Failed",
  }[job.status];

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="flex items-start gap-4 p-5">
        {job.preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={job.preview}
            alt={job.file.name}
            className="h-20 w-20 shrink-0 rounded-xl object-cover"
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-semibold text-stone-950">
                {job.file.name}
              </p>
              <p className="text-sm text-stone-500">{formatBytes(job.file.size)}</p>
            </div>
            <button
              type="button"
              onClick={onRemove}
              className="shrink-0 rounded p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
              aria-label="Remove"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                job.status === "done" && "bg-green-50 text-green-800",
                job.status === "error" && "bg-red-50 text-red-800",
                isProcessing && "bg-stone-100 text-stone-600"
              )}
            >
              {isProcessing && (
                <Loader2 className="h-3 w-3 animate-spin" />
              )}
              {job.status === "done" && (
                <CheckCircle2 className="h-3 w-3" />
              )}
              {statusLabel}
            </span>

            {job.status === "done" && job.clean && (
              <>
                <a
                  href={job.clean.downloadUrl}
                  download
                  className="inline-flex items-center gap-1.5 rounded-md bg-stone-950 px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-800"
                >
                  <Download className="h-3 w-3" />
                  Download
                </a>
                <ShareReportButton
                  payload={{
                    type: "clean",
                    title: "Metadata clean report",
                    originalFilename: job.file.name,
                    before: job.clean.before,
                    after: job.clean.after,
                    clean: {
                      removedTags: job.clean.removedTags,
                      originalSize: job.clean.originalSize,
                      cleanedSize: job.clean.cleanedSize,
                      downloadUrl: job.clean.downloadUrl,
                    },
                  }}
                  className="inline-flex items-center gap-1.5 rounded-md border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50"
                />
              </>
            )}

            {job.status === "error" && (
              <button
                type="button"
                onClick={onRetry}
                className="text-xs font-medium text-stone-600 underline hover:text-stone-950"
              >
                Retry
              </button>
            )}
          </div>

          {job.error && (
            <p className="mt-2 text-sm text-red-600">{job.error}</p>
          )}
        </div>
      </div>

      {job.clean && (
        <ScanDetails scan={job.clean.before} clean={job.clean} />
      )}
      {job.scan && !job.clean && job.status === "error" && (
        <div className="border-t border-stone-100 bg-stone-50 px-5 py-4">
          <MetadataPanel title="Before" scan={job.scan} variant="before" />
        </div>
      )}
    </div>
  );
}

function ScanDetails({
  scan,
  clean,
}: {
  scan: ScanResult;
  clean?: CleanResult;
}) {
  return (
    <div className="border-t border-stone-100 bg-stone-50 px-5 py-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <MetadataPanel title="Before" scan={scan} variant="before" />
        {clean && (
          <MetadataPanel title="After" scan={clean.after} variant="after" />
        )}
      </div>

      {scan.warnings.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {scan.warnings.map((warning) => (
            <div
              key={warning}
              className="flex items-start gap-2 text-xs text-stone-600"
            >
              <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-stone-400" />
              <span>
                {warning}
                {warning.includes("SynthID") && (
                  <>
                    {" "}
                    <Link
                      href="/verify"
                      className="font-medium text-stone-900 underline"
                    >
                      Check with Pro Verify →
                    </Link>
                  </>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MetadataPanel({
  title,
  scan,
  variant,
}: {
  title: string;
  scan: ScanResult;
  variant: "before" | "after";
}) {
  const isClean = variant === "after" || !scan.hasAiMetadata;

  return (
    <div>
      <p
        className={cn(
          "text-xs font-semibold uppercase tracking-wider",
          isClean ? "text-emerald-600" : "text-red-500"
        )}
      >
        {title}
      </p>
      <div className="mt-2 space-y-1.5">
        <MetadataRow
          label="C2PA"
          value={
            scan.c2pa.present
              ? scan.c2pa.issuer || scan.c2pa.softwareAgent || "Detected"
              : "Not present"
          }
          detected={scan.c2pa.present}
        />
        {scan.c2pa.model && (
          <MetadataRow label="Model" value={scan.c2pa.model} detected />
        )}
        <MetadataRow
          label="AI tags"
          value={`${scan.aiTags.length} detected`}
          detected={scan.aiTags.length > 0}
        />
        {isClean && (
          <div className="flex items-center gap-1.5 pt-1 text-xs text-emerald-600">
            <CheckCircle2 className="h-3.5 w-3.5" />
            No AI metadata detected
          </div>
        )}
      </div>
    </div>
  );
}

function MetadataRow({
  label,
  value,
  detected,
}: {
  label: string;
  value: string;
  detected?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 font-mono text-xs",
        detected ? "bg-red-50 text-red-800" : "bg-emerald-50 text-emerald-800"
      )}
    >
      <span className="font-medium opacity-70">{label}</span>
      <span className="truncate text-right">{value}</span>
    </div>
  );
}
