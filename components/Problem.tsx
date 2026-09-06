const problems = [
  {
    title: "Manual & Scattered",
    body: "Screenshots, browser tabs, and Slack messages instead of one source of truth.",
    icon: "◇",
  },
  {
    title: "Reactive, Not Proactive",
    body: "Most PMs learn about a competitor's move from a customer or a sales rep — after it already mattered.",
    icon: "△",
  },
  {
    title: "Data Without Direction",
    body: "Plenty of information, but rarely a clear answer to “so what do I do about it?”",
    icon: "○",
  },
];

export default function Problem() {
  return (
    <section className="border-t border-line bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-medium uppercase tracking-wider text-accent">
            The problem
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Competitive research shouldn&apos;t be a part-time job.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {problems.map((p) => (
            <div
              key={p.title}
              className="rounded-xl2 border border-line bg-paper p-6 transition hover:-translate-y-0.5 hover:shadow-cardHover"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-sm text-white">
                {p.icon}
              </span>
              <h3 className="mt-5 text-base font-semibold text-ink">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
