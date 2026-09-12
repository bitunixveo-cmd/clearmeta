import { DeepCleanApp } from "@/components/app/deep-clean-app";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deep Clean Beta — SynthID Disruption | ClearMeta",
  description:
    "Experimental beta pipeline to disrupt SynthID watermarks via re-encode, resize, and noise injection.",
  robots: { index: false },
};

export default function DeepCleanPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-amber-50/30 via-white to-white">
      <DeepCleanApp />
    </div>
  );
}
