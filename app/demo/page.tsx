import Link from "next/link";
import Logo from "@/components/Logo";
import ReportView from "@/components/report/ReportView";
import { sampleReport } from "@/lib/sampleReport";

// Renders the fixed sample data through the exact same report experience a
// real /create analysis produces — same layout, same "View as PDF" button
// up top — so a visitor gets a true feel for the product before ever
// running their own analysis. (The raw PDF is still reachable directly at
// /api/sample-report-pdf for anyone who wants just the file.)
export default function DemoPage() {
  return (
    <main className="min-h-screen bg-paper">
      <header className="no-print sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo />
            <span className="text-sm font-semibold tracking-tight text-ink">
              ScoutAI
            </span>
          </Link>
          <Link href="/" className="text-sm text-mist transition hover:text-ink">
            ← Back home
          </Link>
        </div>
      </header>

      <div className="no-print border-b border-line bg-accent-soft/50 px-6 py-3 text-center text-sm text-accent-dark">
        Sample report &middot; fictional data for &quot;PulseCRM&quot;.{" "}
        <Link href="/create" className="font-medium underline underline-offset-2 hover:no-underline">
          Run this on your own product →
        </Link>
      </div>

      <ReportView report={sampleReport} />
    </main>
  );
}
