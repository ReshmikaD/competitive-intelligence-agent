"use client";

import { useState } from "react";
import type { AnalysisInput, CompetitiveReport } from "@/lib/types";

export default function EmailReportButton({
  report,
  analysisInput,
}: {
  report: CompetitiveReport;
  /** Only passed for reports generated via /create — powers auto-subscribe.
   *  Omitted for the static /demo report, which has no real inputs to re-run. */
  analysisInput?: AnalysisInput;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  async function handleSend() {
    if (!email.trim()) return;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/send-report-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          report,
          // Sending a real (non-demo) report always registers it for
          // monthly re-delivery too — see the send-report-email route.
          subscribeMonthly: Boolean(analysisInput),
          input: analysisInput,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send email.");
      setStatus("sent");
      setSubscribed(Boolean(data.subscribed));
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Something went wrong.");
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink transition hover:border-ink/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        Email this report
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-line bg-white p-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="w-52 rounded-md border border-line px-3 py-2 text-sm text-ink outline-none focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          disabled={status === "sending" || status === "sent"}
        />
        <button
          onClick={handleSend}
          disabled={status === "sending" || status === "sent" || !email.trim()}
          className="rounded-md bg-accent px-3 py-2 text-sm font-medium text-white transition hover:bg-accent-dark disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          {status === "sending" ? "Sending…" : status === "sent" ? "Sent ✓" : "Send"}
        </button>
        {status === "error" && (
          <span className="w-full text-xs text-threat-high">{error}</span>
        )}
      </div>
      {status === "sent" && analysisInput && (
        <p className="max-w-xs text-xs text-mist">
          {subscribed
            ? "You're now subscribed — a fresh version lands in this inbox every month based on the latest 30 days of activity."
            : "Sent. (Monthly auto-delivery needs the optional Upstash setup — see the README.)"}
        </p>
      )}
    </div>
  );
}
