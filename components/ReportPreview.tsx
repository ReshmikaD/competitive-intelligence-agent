import Link from "next/link";

const opportunities = [
  { rank: 1, name: "Explainable AI lead scoring", impact: "High", urgency: "High", effort: "Medium" },
  { rank: 2, name: "Sub-3-minute onboarding", impact: "High", urgency: "High", effort: "Low" },
  { rank: 3, name: "Native mobile offline mode", impact: "Medium", urgency: "Medium", effort: "High" },
];

function LevelDot({ level }: { level: string }) {
  const tone =
    level === "High" ? "bg-threat-high" : level === "Medium" ? "bg-threat-med" : "bg-threat-low";
  return (
    <span
      aria-label={level}
      className={`flex h-3.5 w-3.5 items-center justify-center rounded-full font-mono text-[8px] font-bold text-white ${tone}`}
    >
      {level.charAt(0)}
    </span>
  );
}

export default function ReportPreview() {
  return (
    <section id="report-preview" className="border-t border-line bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-medium uppercase tracking-wider text-accent">
              Sample report
            </p>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              A real look at the report you&apos;d get.
            </h2>
            <p className="mt-4 text-mist">
              Pulled from a full sample analysis for a fictional CRM product, PulseCRM,
              tracked against 10 direct, indirect, and emerging competitors. This teaser
              always uses fixed mock data — open the full sample to see everything a real
              report includes, laid out exactly like the one you&apos;d get.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/demo"
              className="rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white transition hover:bg-ink/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              Open the sample report &rarr;
            </Link>
            <Link
              href="/create"
              className="rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink transition hover:border-ink/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              Try it with your product &rarr;
            </Link>
          </div>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {/* Executive summary card */}
          <div className="rounded-xl2 border border-line bg-paper p-6">
            <p className="text-[11px] font-medium uppercase tracking-wide text-mistStrong">
              Executive Summary
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink">
              AI-native features moved from differentiator to table stakes this
              quarter — 5 of 8 tracked competitors shipped an AI assistant or
              lead-scoring feature in the last 60 days.
            </p>
            <div className="mt-5 flex items-center gap-2 border-t border-line pt-4">
              <span className="rounded-full bg-threat-high/10 px-2.5 py-1 font-mono text-[11px] text-threat-high">
                Biggest threat: HubSpot free-tier AI
              </span>
            </div>
          </div>

          {/* Opportunity radar mini table */}
          <div className="rounded-xl2 border border-line bg-paper p-6">
            <p className="text-[11px] font-medium uppercase tracking-wide text-mistStrong">
              Opportunity Radar
            </p>
            <div className="mt-4 space-y-3">
              {opportunities.map((o) => (
                <div
                  key={o.rank}
                  className={`flex items-center justify-between rounded-lg border p-3 ${
                    o.rank === 1 ? "border-accent/40 bg-accent-soft/50" : "border-line bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-mist">#{o.rank}</span>
                    <span className="text-sm text-ink">{o.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LevelDot level={o.impact} />
                    <LevelDot level={o.urgency} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Competitor card */}
          <div className="rounded-xl2 border border-line bg-paper p-6">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium uppercase tracking-wide text-mistStrong">
                Competitor Landscape
              </p>
              <span className="rounded-full bg-ink/5 px-2 py-0.5 font-mono text-[10px] text-ink">
                Emerging
              </span>
            </div>
            <p className="mt-3 text-base font-semibold text-ink">Attio</p>
            <p className="mt-1 text-sm leading-relaxed text-mist">
              Shipped a redesigned “CRM in 3 minutes” onboarding flow and
              partnered with a startup accelerator — contesting two of
              PulseCRM&apos;s claimed differentiators at once.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5 border-t border-line pt-4">
              {["Onboarding speed", "Design-forward", "Startup mindshare"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-mistStrong"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
