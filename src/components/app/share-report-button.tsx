"use client";

import { useCallback, useState } from "react";
import { Check, Link2, Loader2 } from "lucide-react";

export function ShareReportButton({
  payload,
  className,
}: {
  payload: Record<string, unknown>;
  className?: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const createReport = useCallback(async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create report");

      const url = `${window.location.origin}/report/${data.id}`;
      setShareUrl(url);
      setStatus("done");
      await navigator.clipboard.writeText(url).catch(() => {});
    } catch {
      setStatus("error");
    }
  }, [payload]);

  if (status === "done" && shareUrl) {
    return (
      <a
        href={shareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        <Check className="h-3.5 w-3.5" />
        Link copied — view report
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={createReport}
      disabled={status === "loading"}
      className={className}
    >
      {status === "loading" ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Link2 className="h-3.5 w-3.5" />
      )}
      Share report
    </button>
  );
}
