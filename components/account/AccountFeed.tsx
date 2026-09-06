"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Subscription, HistoryEntry } from "@/lib/store";

function useViewPdf() {
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  async function viewPdf(key: string, report: HistoryEntry["report"]) {
    setLoadingKey(key);
    try {
      const res = await fetch("/api/report-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report }),
      });
      if (!res.ok) throw new Error("Failed to render PDF.");
      const blob = await res.blob();
      window.open(URL.createObjectURL(blob), "_blank", "noopener,noreferrer");
    } catch {
      alert("Couldn't open the PDF. Try again.");
    } finally {
      setLoadingKey(null);
    }
  }

  return { loadingKey, viewPdf };
}

export default function AccountFeed({
  email,
  subscriptions,
  history,
}: {
  email: string;
  subscriptions: Subscription[];
  history: HistoryEntry[];
}) {
  const router = useRouter();
  const [subs, setSubs] = useState(subscriptions);
  const [unsubscribing, setUnsubscribing] = useState<string | null>(null);
  const { loadingKey, viewPdf } = useViewPdf();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  async function handleUnsubscribe(productName: string) {
    setUnsubscribing(productName);
    try {
      const res = await fetch("/api/account/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName }),
      });
      if (!res.ok) throw new Error();
      setSubs((prev) => prev.filter((s) => s.input.productName !== productName));
    } catch {
      alert("Couldn't unsubscribe. Try again.");
    } finally {
      setUnsubscribing(null);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-mist">Signed in as</p>
          <h1 className="text-xl font-semibold text-ink">{email}</h1>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-medium text-ink transition hover:border-ink/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          Log out
        </button>
      </div>

      {/* Active subscriptions */}
      <section className="mb-12">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-mistStrong">
          Active Subscriptions
        </h2>
        {subs.length === 0 ? (
          <p className="rounded-xl2 border border-line bg-white p-5 text-sm text-mist">
            No active monthly subscriptions. Generate a report and check "send me this every
            month" to start one.
          </p>
        ) : (
          <div className="space-y-3">
            {subs.map((s) => (
              <div
                key={s.input.productName}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl2 border border-line bg-white p-4"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">{s.input.productName}</p>
                  <p className="text-xs text-mist">
                    {s.input.industry.join(", ")} &middot; subscribed since{" "}
                    {new Date(s.savedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleUnsubscribe(s.input.productName)}
                  disabled={unsubscribing === s.input.productName}
                  className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-mist transition hover:border-threat-high/40 hover:text-threat-high disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                >
                  {unsubscribing === s.input.productName ? "Unsubscribing…" : "Unsubscribe"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Report feed */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-mistStrong">
          Report Feed
        </h2>
        {history.length === 0 ? (
          <p className="rounded-xl2 border border-line bg-white p-5 text-sm text-mist">
            Reports you've emailed to yourself will show up here.
          </p>
        ) : (
          <div className="space-y-3">
            {history.map((entry, i) => {
              const key = `${entry.report.productName}-${entry.sentAt}-${i}`;
              return (
                <div
                  key={key}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl2 border border-line bg-white p-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-ink">{entry.report.productName}</p>
                    <p className="text-xs text-mist">
                      {entry.report.reportPeriod} &middot; sent {new Date(entry.sentAt).toLocaleDateString()}
                      {entry.subscribed && (
                        <span className="ml-2 rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-medium text-accent-dark">
                          Monthly
                        </span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => viewPdf(key, entry.report)}
                    disabled={loadingKey === key}
                    className="rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-white transition hover:bg-ink/85 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                  >
                    {loadingKey === key ? "Opening…" : "View PDF ↗"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
