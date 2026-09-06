import Link from "next/link";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-grid">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-gradient-to-b from-accent-soft/70 via-paper to-paper" />

      <div className="relative mx-auto grid max-w-6xl gap-14 px-6 pb-24 pt-20 md:grid-cols-2 md:items-center md:pb-32 md:pt-28">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-mist shadow-card">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Built for Product Managers
          </div>

          <h1 className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
            Know what your competitors are up to, without doing the digging yourself
          </h1>

          <p className="mt-6 max-w-lg text-balance text-lg leading-relaxed text-mist">
            Tell it your product, industry, target customers, and
            competitors. It goes and reads the actual competitor sites,
            TechCrunch, industry news, then sends you a real PDF report —
            once, or every month.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/create"
              className="rounded-lg bg-accent px-5 py-3 text-sm font-medium text-white shadow-card transition hover:bg-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              Run Your Own Analysis
            </Link>
            <a
              href="/api/sample-report-pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-line bg-white px-5 py-3 text-sm font-medium text-ink transition hover:border-ink/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              Open Sample Report (PDF) ↗
            </a>
          </div>
        </div>

        {/* Preview visual */}
        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-xl2 bg-gradient-to-br from-accent-soft to-transparent blur-2xl" />
          <div className="rounded-xl2 border border-line bg-white p-5 shadow-cardHover">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <p className="text-xs font-medium text-mist">Monthly Report</p>
                <p className="font-mono text-sm font-medium text-ink">PulseCRM &middot; June 2026</p>
              </div>
              <span className="rounded-full bg-threat-high/10 px-2.5 py-1 text-[11px] font-medium text-threat-high">
                2 High Threats
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-lg border border-line bg-paper p-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-mistStrong">
                  Biggest opportunity
                </p>
                <p className="mt-1 text-sm text-ink">
                  Explainable AI lead scoring — no competitor has combined
                  fast setup with transparent scoring yet.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "HubSpot", tag: "Direct", tone: "bg-threat-high/10 text-threat-high" },
                  { label: "Attio", tag: "Emerging", tone: "bg-threat-med/10 text-threat-med" },
                  { label: "Pipedrive", tag: "Direct", tone: "bg-threat-low/10 text-threat-low" },
                ].map((c) => (
                  <div key={c.label} className="rounded-lg border border-line p-2.5">
                    <p className="text-xs font-medium text-ink">{c.label}</p>
                    <span className={`mt-1 inline-block rounded px-1.5 py-0.5 font-mono text-[10px] ${c.tone}`}>
                      {c.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
