import type { Competitor } from "@/lib/types";

const CATEGORIES: { key: Competitor["category"]; label: string; color: string }[] = [
  { key: "Direct", label: "Direct", color: "#E34D4D" },
  { key: "Indirect", label: "Indirect", color: "#DD9A2B" },
  { key: "Emerging", label: "Emerging", color: "#0D9488" },
];

export default function CategoryBarChart({ competitors }: { competitors: Competitor[] }) {
  const counts = CATEGORIES.map((c) => ({
    ...c,
    count: competitors.filter((comp) => comp.category === c.key).length,
  }));
  const max = Math.max(1, ...counts.map((c) => c.count));

  return (
    <div className="rounded-xl2 border border-line bg-white p-5">
      <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-mistStrong">
        Landscape Composition
      </p>
      <p className="mb-4 text-xs text-mist">
        {competitors.length} competitors tracked across three categories.
      </p>
      <div className="space-y-4">
        {counts.map((c) => (
          <div key={c.key}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium text-ink">{c.label}</span>
              <span className="font-mono text-mist">{c.count}</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-paper">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${(c.count / max) * 100}%`, backgroundColor: c.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
