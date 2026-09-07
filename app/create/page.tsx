"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";
import AnalysisForm from "@/components/create/AnalysisForm";
import GeneratingState from "@/components/create/GeneratingState";
import ReportView from "@/components/report/ReportView";
import type { AnalysisInput, CompetitiveReport } from "@/lib/types";

type Phase = "form" | "generating" | "report" | "error";

/**
 * Isolated leaf component so useSearchParams() doesn't force the entire
 * page to bail out of static rendering into full client-side rendering.
 * Only this tiny node opts into CSR; the rest of the page ships as HTML.
 */
function ReportIdFromUrl({ onId }: { onId: (id: string | null) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    onId(searchParams?.get("report") ?? null);
  }, [searchParams, onId]);
  return null;
}

function CreatePageInner() {
  const [phase, setPhase] = useState<Phase>("form");
  const [report, setReport] = useState<CompetitiveReport | null>(null);
  const [lastInput, setLastInput] = useState<AnalysisInput | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [controller, setController] = useState<AbortController | null>(null);
  const [checkedUrl, setCheckedUrl] = useState(false);

  // On mount, check sessionStorage for a report matching ?report=<id> so a
  // refresh doesn't lose the generated report.
  function handleReportId(id: string | null) {
    if (checkedUrl) return;
    setCheckedUrl(true);
    if (!id) return;
    try {
      const raw = sessionStorage.getItem(`cia-report-${id}`);
      if (raw) {
        const parsed = JSON.parse(raw) as { report: CompetitiveReport; input: AnalysisInput | null };
        setReport(parsed.report);
        setLastInput(parsed.input);
        setReportId(id);
        setPhase("report");
      }
    } catch {
      // ignore malformed storage
    }
  }

  async function handleGenerate(input: AnalysisInput) {
    setLastInput(input);
    setPhase("generating");
    setErrorMessage("");
    const abort = new AbortController();
    setController(abort);
    try {
      const res = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        signal: abort.signal,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate report.");
      const generated = data.report as CompetitiveReport;
      setReport(generated);
      setPhase("report");

      const id = crypto.randomUUID();
      setReportId(id);
      try {
        sessionStorage.setItem(
          `cia-report-${id}`,
          JSON.stringify({ report: generated, input })
        );
        const url = new URL(window.location.href);
        url.searchParams.set("report", id);
        window.history.replaceState({}, "", url.toString());
      } catch {
        // sessionStorage unavailable — report still works, just won't survive a refresh
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setPhase("form");
        return;
      }
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
      setPhase("error");
    } finally {
      setController(null);
    }
  }

  function handleCancel() {
    controller?.abort();
  }

  function handleReset() {
    setReport(null);
    setLastInput(null);
    setReportId(null);
    setPhase("form");
    const url = new URL(window.location.href);
    url.searchParams.delete("report");
    window.history.replaceState({}, "", url.toString());
  }

  return (
    <main className="min-h-screen bg-paper">
      <Suspense fallback={null}>
        <ReportIdFromUrl onId={handleReportId} />
      </Suspense>

      <header className="no-print sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo />
            <span className="text-sm font-semibold tracking-tight text-ink">
              Competitive Intelligence Agent
            </span>
          </Link>
          <Link href="/" className="text-sm text-mist transition hover:text-ink">
            ← Back home
          </Link>
        </div>
      </header>

      {phase === "form" && <AnalysisForm onSubmit={handleGenerate} />}

      {phase === "generating" && <GeneratingState onCancel={handleCancel} />}

      {phase === "error" && (
        <div className="mx-auto flex max-w-md flex-col items-center px-6 py-28 text-center">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-threat-high/10">
            <span className="text-2xl text-threat-high">!</span>
          </div>
          <h2 className="text-xl font-semibold text-ink">Something went wrong</h2>
          <p className="mt-2 text-sm text-mist">{errorMessage}</p>
          <p className="mt-3 max-w-sm text-xs text-mist">
            This is usually temporary — please try again in a moment.
          </p>
          <button
            onClick={() => setPhase("form")}
            className="mt-8 rounded-lg bg-ink px-5 py-2.5 text-sm font-medium text-white transition hover:bg-ink/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Try again
          </button>
        </div>
      )}

      {phase === "report" && report && (
        <ReportView
          report={report}
          onReset={handleReset}
          analysisInput={lastInput ?? undefined}
          reportId={reportId ?? undefined}
        />
      )}
    </main>
  );
}

export default function CreatePage() {
  return <CreatePageInner />;
}
