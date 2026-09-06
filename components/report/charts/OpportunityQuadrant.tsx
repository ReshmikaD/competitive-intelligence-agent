import type { OpportunityItem } from "@/lib/types";

const LEVEL_POS: Record<string, number> = { Low: 0, Medium: 1, High: 2 };
const EFFORT_RADIUS: Record<string, number> = { Low: 16, Medium: 12, High: 8 };

const PAD = 44;
const W = 520;
const H = 300;
const PLOT_W = W - PAD * 2;
const PLOT_H = H - PAD * 2;

// Small deterministic offsets so bubbles sharing the same impact/urgency
// grid cell don't stack exactly on top of each other.
const JITTER: [number, number][] = [
  [0, 0],
  [14, -10],
  [-14, 10],
  [10, 14],
  [-10, -14],
  [16, 6],
];

export default function OpportunityQuadrant({ items }: { items: OpportunityItem[] }) {
  const sorted = [...items].sort((a, b) => a.rank - b.rank);

  return (
    <div className="rounded-xl2 border border-line bg-white p-5">
      <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-mistStrong">
        Impact vs. Urgency
      </p>
      <p className="mb-4 text-xs text-mist">
        Bubble size = ease of implementation (bigger is faster to ship). Rank #1 highlighted.
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Opportunity impact versus urgency quadrant chart">
        {/* Quadrant background */}
        <rect x={PAD} y={PAD} width={PLOT_W / 2} height={PLOT_H / 2} fill="#FAFAFA" />
        <rect x={PAD + PLOT_W / 2} y={PAD} width={PLOT_W / 2} height={PLOT_H / 2} fill="#E1F5F3" opacity="0.5" />

        {/* Axes */}
        <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#E8E8EC" strokeWidth="1.5" />
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#E8E8EC" strokeWidth="1.5" />
        <line x1={PAD + PLOT_W / 2} y1={PAD} x2={PAD + PLOT_W / 2} y2={H - PAD} stroke="#E8E8EC" strokeWidth="1" strokeDasharray="3 3" />
        <line x1={PAD} y1={PAD + PLOT_H / 2} x2={W - PAD} y2={PAD + PLOT_H / 2} stroke="#E8E8EC" strokeWidth="1" strokeDasharray="3 3" />

        {/* Axis labels */}
        <text x={PAD} y={H - PAD + 22} fontSize="10" fill="#6B6B72" fontFamily="ui-monospace, monospace">Low urgency</text>
        <text x={W - PAD} y={H - PAD + 22} fontSize="10" fill="#6B6B72" fontFamily="ui-monospace, monospace" textAnchor="end">High urgency</text>
        <text x={PAD - 8} y={H - PAD} fontSize="10" fill="#6B6B72" fontFamily="ui-monospace, monospace" textAnchor="end">Low impact</text>
        <text x={PAD - 8} y={PAD + 4} fontSize="10" fill="#6B6B72" fontFamily="ui-monospace, monospace" textAnchor="end">High impact</text>

        {/* Bubbles */}
        {sorted.map((o, i) => {
          const [jx, jy] = JITTER[i % JITTER.length];
          const cx = PAD + (LEVEL_POS[o.competitiveUrgency] / 2) * PLOT_W + jx;
          const cy = H - PAD - (LEVEL_POS[o.customerImpact] / 2) * PLOT_H + jy;
          const r = EFFORT_RADIUS[o.implementationEffort] ?? 10;
          const isTop = o.rank === 1;
          return (
            <g key={o.rank}>
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill={isTop ? "#0D9488" : "#111114"}
                fillOpacity={isTop ? 0.9 : 0.12}
                stroke={isTop ? "#0D9488" : "#111114"}
                strokeOpacity={isTop ? 1 : 0.3}
                strokeWidth="1.5"
              />
              <text
                x={cx}
                y={cy + 3}
                fontSize="9"
                fontWeight="600"
                textAnchor="middle"
                fill={isTop ? "#fff" : "#111114"}
                fontFamily="ui-monospace, monospace"
              >
                {o.rank}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
