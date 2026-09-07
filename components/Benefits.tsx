const benefits = [
  {
    title: "Save hours every month",
    body: "Skip the manual scan across G2, LinkedIn, and changelogs.",
  },
  {
    title: "Never get blindsided",
    body: "Know about a competitor's move before a customer tells you.",
  },
  {
    title: "Insights, not summaries",
    body: "Every signal is converted into a threat level and a recommended action.",
  },
  {
    title: "Walk in with evidence",
    body: "Back roadmap decisions with a current view of the market.",
  },
  {
    title: "Come back anytime",
    body: "Every report you generate is saved to your dashboard — log back in and pick up right where you left off.",
    highlight: true,
  },
  {
    title: "Your data stays yours",
    body: "Nothing about your product or competitors is shared with anyone else.",
  },
];

export default function Benefits() {
  return (
    <section id="benefits" className="border-t border-line bg-paper py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-medium uppercase tracking-wider text-accent">
            Why it works
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Built for the way PMs actually make decisions.
          </h2>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-xl2 border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <div
              key={b.title}
              className={`p-6 ${b.highlight ? "bg-accent-soft/40" : "bg-white"}`}
            >
              <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
                {b.title}
                {b.highlight && (
                  <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[10px] font-medium text-white">
                    Dashboard
                  </span>
                )}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-mist">{b.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
