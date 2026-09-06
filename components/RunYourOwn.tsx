export default function RunYourOwn() {
  return (
    <section id="run-your-own" className="border-t border-line bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-medium uppercase tracking-wider text-accent">
            Getting started
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            How to actually use this.
          </h2>
          <p className="mt-4 text-mist">
            There&apos;s no shared backend here and no account system holding your data —
            every deployment runs on its own Anthropic API key.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl2 border border-line bg-paper p-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 font-mono text-[11px] font-medium text-accent-dark">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              No key needed
            </span>
            <h3 className="mt-4 text-lg font-semibold text-ink">Look at a sample first</h3>
            <p className="mt-2 text-sm leading-relaxed text-mist">
              The sample PDF is real output from this exact tool, just generated ahead
              of time for a fictional product. Open it any time to see what a report
              actually looks like before you set anything up.
            </p>
          </div>

          <div className="rounded-xl2 border border-line bg-paper p-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/5 px-2.5 py-1 font-mono text-[11px] font-medium text-ink">
              <span className="h-1.5 w-1.5 rounded-full bg-ink" />
              Bring your own key
            </span>
            <h3 className="mt-4 text-lg font-semibold text-ink">Run it on your own product</h3>
            <p className="mt-2 text-sm leading-relaxed text-mist">
              Clone the repo, drop in your own Anthropic API key (and Gmail if you want
              email delivery), and deploy it to Vercel — a few minutes, and it&apos;s
              running under your account with your key. Steps are in the README.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
