export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect width="40" height="40" rx="10" className="fill-stone-950" />
      <path
        d="M12 14h16v2H12v-2Zm0 5h10v2H12v-2Zm0 5h14v2H12v-2Z"
        className="fill-stone-400"
      />
      <path
        d="M28 24l4 4-4 4"
        stroke="#fafaf9"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="22"
        y1="28"
        x2="31"
        y2="28"
        stroke="#fafaf9"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
