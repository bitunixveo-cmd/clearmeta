"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScanResult } from "@/lib/metadata/types";

export function ComparePanel({
  before,
  after,
  title = "Before vs After",
}: {
  before: ScanResult;
  after?: ScanResult;
  title?: string;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-stone-900">{title}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <MetadataCompareCard label="Before" scan={before} variant="before" />
        {after ? (
          <MetadataCompareCard label="After" scan={after} variant="after" />
        ) : (
          <div className="rounded-xl border border-dashed border-stone-200 p-6 text-center text-sm text-stone-400">
            No after scan available
          </div>
        )}
      </div>
    </div>
  );
}

function MetadataCompareCard({
  label,
  scan,
  variant,
}: {
  label: string;
  scan: ScanResult;
  variant: "before" | "after";
}) {
  const isClean = variant === "after" || !scan.hasAiMetadata;

  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        isClean ? "border-emerald-200 bg-emerald-50/50" : "border-red-200 bg-red-50/50"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          {label}
        </span>
        {isClean ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        ) : (
          <XCircle className="h-4 w-4 text-red-500" />
        )}
      </div>
      <dl className="mt-3 space-y-2 text-sm">
        <Row
          label="C2PA"
          value={
            scan.c2pa.present
              ? scan.c2pa.issuer || scan.c2pa.softwareAgent || "Detected"
              : "Not present"
          }
          alert={scan.c2pa.present}
        />
        {scan.c2pa.model && (
          <Row label="Model" value={scan.c2pa.model} alert />
        )}
        <Row
          label="AI tags"
          value={`${scan.aiTags.length} detected`}
          alert={scan.aiTags.length > 0}
        />
        <Row label="Format" value={scan.format} />
        <Row label="Size" value={`${(scan.fileSize / 1024).toFixed(1)} KB`} />
      </dl>
    </div>
  );
}

function Row({
  label,
  value,
  alert,
}: {
  label: string;
  value: string;
  alert?: boolean;
}) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-stone-500">{label}</dt>
      <dd
        className={cn(
          "truncate text-right font-medium",
          alert ? "text-red-700" : "text-stone-800"
        )}
      >
        {value}
      </dd>
    </div>
  );
}
