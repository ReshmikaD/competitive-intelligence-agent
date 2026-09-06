"use client";

import { useEffect, useRef, useState } from "react";
import type { AnalysisInput, CompetitiveReport, Competitor, Level } from "@/lib/types";
import EmailReportButton from "./EmailReportButton";
import ReportNav from "./ReportNav";
import OpportunityQuadrant from "./charts/OpportunityQuadrant";
import CategoryBarChart from "./charts/CategoryBarChart";

function LevelBadge({ level }: { level: Level }) {
  const tone =
    level === "High"
      ? "bg-threat-high/10 text-threat-high"
      : level === "Medium"
      ? "bg-threat-med/10 text-threat-med"
      : "bg-threat-low/10 text-threat-low";
  return (
    <span className={`rounded-full px-2 py-0.5 font-mono text-[11px] font-medium ${tone}`}>
      {level}
    </span>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-6">
      <p className="font-mono text-xs font-medium uppercase tracking-wider text-accent">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">{title}</h2>
    </div>
  );
}

function CompetitorGroup({ title, items }: { title: string; items: Competitor[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mb-8">
      <p className="mb-3 font-mono text-xs font-medium uppercase tracking-wide text-mistStrong">
        {title} ({items.length})
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((c) => (
          <details
            key={c.name}
            className="group rounded-xl2 border border-line bg-white p-5 open:shadow-cardHover"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2">
              <span className="text-base font-semibold text-ink">{c.name}</span>
              <span className="text-mist transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-mist">{c.whyItMatters}</p>
            <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-open:grid-rows-[1fr]">
              <div className="min-h-0 overflow-hidden">
                <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
                  <p><span className="font-medium text-ink">Differentiator: </span><span className="text-mist">{c.differentiator}</span></p>
                  <p><span className="font-medium text-ink">Strength: </span><span className="text-mist">{c.strength}</span></p>
                  <p><span className="font-medium text-ink">Weakness: </span><span className="text-mist">{c.weakness}</span></p>
                </div>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

export default function ReportView({
  report,
  onReset,
  analysisInput,
}: {
  report: CompetitiveReport;
  onReset?: () => void;
  /** Only present for reports generated via /create — powers the
   *  "email + auto-subscribe" flow. Absent for the static /demo report. */
  analysisInput?: AnalysisInput;
}) {
  const direct = report.competitors.filter((c) => c.category === "Direct");
  const indirect = report.competitors.filter((c) => c.category === "Indirect");
  const emerging = report.competitors.filter((c) => c.category === "Emerging");
  const radar = [...report.opportunityRadar].sort((a, b) => a.rank - b.rank);

  const [confirmingReset, setConfirmingReset] = useState(false);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState("");

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  function handleResetClick() {
    setConfirmingReset(true);
    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    resetTimeoutRef.current = setTimeout(() => setConfirmingReset(false), 5000);
  }

  function handleConfirmReset() {
    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    setConfirmingReset(false);
    onReset?.();
  }

  function handleCancelReset() {
    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    setConfirmingReset(false);
  }

  function handlePrint() {
    window.print();
  }

  async function handleViewPdf() {
    setPdfLoading(true);
    setPdfError("");
    try {
      const res = await fetch("/api/report-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report }),
      });
      if (!res.ok) throw new Error("Failed to render PDF.");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      setPdfError("Couldn't open the PDF. Try again.");
    } finally {
      setPdfLoading(false);
    }
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-6 border-b border-line pb-8">
        <div>
          <p className="font-mono text-xs text-mist">
            Report generated {new Date(report.generatedAt).toLocaleDateString()}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink">
            {report.productName}
          </h1>
          <p className="mt-1 text-mist">
            {report.industry} &middot; {report.reportPeriod}
          </p>
        </div>
        <div className="no-print flex flex-wrap items-center gap-3">
          <button
            onClick={handleViewPdf}
            disabled={pdfLoading}
            className="rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white transition hover:bg-ink/85 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            {pdfLoading ? "Opening PDF…" : "View as PDF ↗"}
          </button>
          <EmailReportButton report={report} analysisInput={analysisInput} />
          <button
            onClick={handleCopyLink}
            className="rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink transition hover:border-ink/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            {copied ? "Link copied" : "Copy link"}
          </button>
          {pdfError && <span className="w-full text-xs text-threat-high">{pdfError}</span>}
          {onReset && !confirmingReset && (
            <button
              onClick={handleResetClick}
              className="rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white transition hover:bg-ink/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              New Analysis
            </button>
          )}
          {onReset && confirmingReset && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-ink">Discard this report?</span>
              <button
                onClick={handleConfirmReset}
                className="rounded-lg bg-threat-high px-3 py-2 text-sm font-medium text-white transition hover:bg-threat-high/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                Yes, start over
              </button>
              <button
                onClick={handleCancelReset}
                className="rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium text-ink transition hover:border-ink/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-[200px_1fr] lg:gap-10">
        <ReportNav />

        <div>
          {/* Executive Summary */}
          <section id="exec-summary" className="mb-16">
            <SectionHeading eyebrow="Section 1" title="Executive Summary" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl2 border border-line bg-white p-5">
                <p className="text-[11px] font-medium uppercase tracking-wide text-mistStrong">Biggest market changes</p>
                <p className="mt-2 text-sm leading-relaxed text-ink">{report.executiveSummary.biggestMarketChanges}</p>
              </div>
              <div className="rounded-xl2 border border-line bg-white p-5">
                <p className="text-[11px] font-medium uppercase tracking-wide text-mistStrong">Emerging themes</p>
                <p className="mt-2 text-sm leading-relaxed text-ink">{report.executiveSummary.emergingThemes}</p>
              </div>
              <div className="rounded-xl2 border border-threat-high/30 bg-threat-high/5 p-5">
                <p className="text-[11px] font-medium uppercase tracking-wide text-threat-high">Biggest threats</p>
                <p className="mt-2 text-sm leading-relaxed text-ink">{report.executiveSummary.biggestThreats}</p>
              </div>
              <div className="rounded-xl2 border border-threat-low/30 bg-threat-low/5 p-5">
                <p className="text-[11px] font-medium uppercase tracking-wide text-threat-low">Biggest opportunities</p>
                <p className="mt-2 text-sm leading-relaxed text-ink">{report.executiveSummary.biggestOpportunities}</p>
              </div>
            </div>
          </section>

          {/* Competitor Landscape */}
          <section id="competitor-landscape" className="mb-16">
            <SectionHeading eyebrow="Section 2" title="Competitor Landscape" />
            <div className="mb-8">
              <CategoryBarChart competitors={report.competitors} />
            </div>
            <CompetitorGroup title="Direct Competitors" items={direct} />
            <CompetitorGroup title="Indirect Competitors" items={indirect} />
            <CompetitorGroup title="Emerging Players" items={emerging} />
          </section>

          {/* Feature Movement */}
          <section id="feature-movement" className="mb-16">
            <SectionHeading eyebrow="Section 3" title="Feature Movement" />
            <div className="space-y-3">
              {report.featureMovement.map((f, i) => (
                <div key={i} className="rounded-xl2 border border-line bg-white p-5">
                  <p className="text-sm font-semibold text-ink">{f.competitor}</p>
                  <p className="mt-1 text-sm text-ink">{f.whatChanged}</p>
                  <p className="mt-2 text-sm leading-relaxed text-mist">
                    <span className="font-medium text-mist">Why it matters: </span>
                    {f.whyItMatters}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Market Trends */}
          <section id="market-trends" className="mb-16">
            <SectionHeading eyebrow="Section 4" title="Market Trends" />
            <div className="space-y-4">
              <div className="rounded-xl2 border border-line bg-white p-5">
                <p className="text-[11px] font-medium uppercase tracking-wide text-mistStrong">Industry trends</p>
                <p className="mt-2 text-sm leading-relaxed text-ink">{report.marketTrends.industryTrends}</p>
              </div>
              <div className="rounded-xl2 border border-line bg-white p-5">
                <p className="text-[11px] font-medium uppercase tracking-wide text-mistStrong">Customer behavior shifts</p>
                <p className="mt-2 text-sm leading-relaxed text-ink">{report.marketTrends.customerBehaviorShifts}</p>
              </div>
              <div className="rounded-xl2 border border-line bg-white p-5">
                <p className="text-[11px] font-medium uppercase tracking-wide text-mistStrong">AI trends</p>
                <p className="mt-2 text-sm leading-relaxed text-ink">{report.marketTrends.aiTrends}</p>
              </div>
            </div>
          </section>

          {/* Opportunity Radar */}
          <section id="opportunity-radar" className="mb-16">
            <SectionHeading eyebrow="Section 5" title="Opportunity Radar" />
            <div className="mb-6">
              <OpportunityQuadrant items={report.opportunityRadar} />
            </div>
            <div className="relative overflow-x-auto rounded-xl2 border border-line bg-white">
              <p className="px-4 pt-3 text-xs text-mist sm:hidden">Swipe to see impact, urgency &amp; effort &rarr;</p>
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-line bg-paper text-left text-xs uppercase tracking-wide text-mistStrong">
                    <th className="px-4 py-3">Rank</th>
                    <th className="px-4 py-3">Opportunity</th>
                    <th className="px-4 py-3">Impact</th>
                    <th className="px-4 py-3">Urgency</th>
                    <th className="px-4 py-3">Effort</th>
                  </tr>
                </thead>
                <tbody>
                  {radar.map((o) => (
                    <tr
                      key={o.rank}
                      className={`border-b border-line last:border-0 ${o.rank === 1 ? "bg-accent-soft/40" : ""}`}
                    >
                      <td className="px-4 py-3 font-mono text-mist">#{o.rank}</td>
                      <td className="px-4 py-3 font-medium text-ink">{o.opportunity}</td>
                      <td className="px-4 py-3"><LevelBadge level={o.customerImpact} /></td>
                      <td className="px-4 py-3"><LevelBadge level={o.competitiveUrgency} /></td>
                      <td className="px-4 py-3"><LevelBadge level={o.implementationEffort} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent sm:hidden" />
            </div>
          </section>

          {/* Recommended Actions */}
          <section id="recommended-actions" className="mb-16">
            <SectionHeading eyebrow="Section 6" title="Recommended Actions" />
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { title: "Investigate next", items: report.recommendedActions.investigateNext },
                { title: "Customer conversations", items: report.recommendedActions.customerConversations },
                { title: "Roadmap opportunities", items: report.recommendedActions.roadmapOpportunities },
              ].map((group) => (
                <div key={group.title} className="rounded-xl2 border border-line bg-white p-5">
                  <p className="text-sm font-semibold text-ink">{group.title}</p>
                  <ul className="mt-3 space-y-2">
                    {group.items.map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm text-mist">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Sources */}
          <section id="sources">
            <SectionHeading eyebrow="Appendix" title="Resources Consulted" />
            <p className="mb-4 text-sm text-mist">
              This report was produced using live web research — competitor websites, product
              pages, and industry news were read directly rather than relying on general
              knowledge alone.
            </p>
            {report.sources.length === 0 ? (
              <p className="text-sm text-mist">No external sources were recorded for this report.</p>
            ) : (
              <ul className="space-y-3">
                {report.sources.map((s, i) => (
                  <li key={i} className="rounded-lg border border-line bg-white p-3">
                    <p className="text-sm font-medium text-ink">{s.title}</p>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-xs text-accent underline-offset-2 hover:underline"
                    >
                      {s.url}
                    </a>
                    {s.note && <p className="mt-1 text-xs text-mist">{s.note}</p>}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
