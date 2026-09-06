import Link from "next/link";

export default function DemoCTA() {
  return (
    <section id="see-it-in-action" className="relative overflow-hidden border-t border-line bg-ink py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(13,148,136,0.3),_transparent_60%)]" />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          See it in action.
        </h2>
        <p className="mt-4 text-balance text-white/60">
          Run a live analysis on your own product, powered by Claude — or browse a full
          sample report first, no signup required.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/create"
            className="rounded-lg bg-white px-6 py-3 text-sm font-medium text-ink shadow-card transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            Run Your Own Analysis
          </Link>
          <a
            href="/api/sample-report-pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-white/15 px-6 py-3 text-sm font-medium text-white transition hover:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            Open the sample PDF ↗
          </a>
        </div>
      </div>
    </section>
  );
}
