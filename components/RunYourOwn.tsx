export default function RunYourOwn() {
  return (
    <section id="get-started" className="border-t border-line bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-medium uppercase tracking-wider text-accent">
            Getting started
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Two ways to get started.
          </h2>
          <p className="mt-4 text-mist">
            No signup required to look around, and no setup required to run your own
            analysis.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl2 border border-line bg-paper p-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 font-mono text-[11px] font-medium text-accent-dark">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              No signup needed
            </span>
            <h3 className="mt-4 text-lg font-semibold text-ink">Look at a sample first</h3>
            <p className="mt-2 text-sm leading-relaxed text-mist">
              The sample report is real output from this exact tool, laid out exactly
              like the one you&apos;d get — read it right on the page, or open it as a
              polished PDF, before you run anything yourself.
            </p>
          </div>

          <div className="rounded-xl2 border border-line bg-paper p-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/5 px-2.5 py-1 font-mono text-[11px] font-medium text-ink">
              <span className="h-1.5 w-1.5 rounded-full bg-ink" />
              Two minutes
            </span>
            <h3 className="mt-4 text-lg font-semibold text-ink">Run it on your own product</h3>
            <p className="mt-2 text-sm leading-relaxed text-mist">
              Tell us about your product, industry, target customers, and any competitors
              you already know about. We&apos;ll research the rest and hand you a full
              report — add your email and it&apos;s saved to your dashboard, so you can
              log back in and find it later.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
