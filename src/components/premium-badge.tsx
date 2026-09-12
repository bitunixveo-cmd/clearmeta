import { cn } from "@/lib/utils";

export function PremiumBadge({
  className,
  label = "Pro",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-gradient-to-r from-amber-100 to-amber-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-900 ring-1 ring-amber-200/80",
        className
      )}
    >
      {label}
    </span>
  );
}
