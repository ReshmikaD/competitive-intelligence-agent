// Shared logo mark — a radar/scan motif (concentric sweep arcs collapsing
// on a center blip) to visually tie back to "intelligence gathering" /
// the Opportunity Radar, instead of a generic abstract square-in-square.
export default function Logo({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-md bg-ink ${className}`}>
      <svg viewBox="0 0 24 24" className="h-[60%] w-[60%]" fill="none" aria-hidden="true">
        <path
          d="M12 2.5a9.5 9.5 0 0 1 9.5 9.5"
          stroke="#0D9488"
          strokeOpacity="0.35"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M12 6.5a5.5 5.5 0 0 1 5.5 5.5"
          stroke="#0D9488"
          strokeOpacity="0.7"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="2.25" fill="#0D9488" />
      </svg>
    </span>
  );
}
