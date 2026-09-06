const steps = [
  {
    n: "01",
    title: "Four things about your product",
    body: "What it does, its industry, your target customers, and any competitors you already know about.",
  },
  {
    n: "02",
    title: "Claude actually browses the web",
    body: "It searches and reads competitor websites, TechCrunch, and industry news — not just what it already knows.",
  },
  {
    n: "03",
    title: "Get a real PDF report",
    body: "Opens in a new tab — generate it on demand, or subscribe for monthly delivery straight to your inbox.",
  },
  {
    n: "04",
    title: "Act on ranked opportunities",
    body: "Recommended next steps, ranked by impact, urgency, and effort.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-line bg-paper py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-medium uppercase tracking-wider text-accent">
            How it works
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            From product brief to intelligence report in minutes.
          </h2>
        </div>

        <div className="relative mt-16 grid gap-8 md:grid-cols-4">
          <div className="absolute left-0 right-0 top-5 hidden h-px bg-line md:block" />
          {steps.map((s) => (
            <div key={s.n} className="relative">
              <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white font-mono text-xs font-medium text-accent">
                {s.n}
              </div>
              <h3 className="mt-5 text-base font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
