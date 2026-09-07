const steps = [
  {
    n: "01",
    title: "Tell us about your product",
    body: "What it does, its industry, your target customers, and any competitors you already know about. Four fields, two minutes.",
  },
  {
    n: "02",
    title: "We go and actually look",
    body: "We search and read competitor websites, TechCrunch, and industry news in real time — not a guess based on old training data.",
  },
  {
    n: "03",
    title: "Read it right on the page",
    body: "Your report opens in a clean, scannable view — save it as a PDF whenever you want, or come back to it anytime from your dashboard.",
  },
  {
    n: "04",
    title: "Walk away with a plan",
    body: "Every report ends with next steps ranked by impact, urgency, and effort — so you know exactly what to do first.",
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
            From product brief to full intelligence report in minutes.
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
