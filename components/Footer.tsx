import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-white py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-center sm:flex-row sm:text-left">
        <div className="flex items-center gap-2">
          <Logo className="h-6 w-6" />
          <span className="font-mono text-xs text-mist">ScoutAI</span>
        </div>
        <p className="text-xs text-mist">
          Your product and competitor details are never shared with anyone else.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-5">
          <a href="#top" className="text-xs text-mist transition hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2">
            Home
          </a>
          <a href="#how-it-works" className="text-xs text-mist transition hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2">
            How it works
          </a>
          <a href="#benefits" className="text-xs text-mist transition hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2">
            Benefits
          </a>
          <a href="/create" className="text-xs text-mist transition hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2">
            Get started
          </a>
        </div>
      </div>
    </footer>
  );
}
