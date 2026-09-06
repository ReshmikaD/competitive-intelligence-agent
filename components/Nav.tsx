import Link from "next/link";
import Logo from "./Logo";
import MobileNav from "./MobileNav";

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2">
          <Logo />
          <span className="font-mono text-[13px] font-medium tracking-tight text-ink">
            Competitive Intelligence Agent
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#how-it-works" className="text-sm text-mist transition hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2">
            How it works
          </a>
          <a href="#benefits" className="text-sm text-mist transition hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2">
            Benefits
          </a>
          <a href="#see-it-in-action" className="text-sm text-mist transition hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2">
            See it in action
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/account"
            className="hidden text-sm text-mist transition hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 sm:block"
          >
            My Reports
          </Link>
          <Link
            href="/create"
            className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white transition hover:bg-ink/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Get Started
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
