"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { HistoryEntry } from "@/lib/store";

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
  history,
}: {
  email: string;
  history: HistoryEntry[];
}) {
  const router = useRouter();
  const { loadingKey, viewPdf } = useViewPdf();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
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

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-mistStrong">
          Your Reports
        </h2>
        {history.length === 0 ? (
          <p className="rounded-xl2 border border-line bg-white p-5 text-sm text-mist">
            Every report you generate with this email will show up here.
          </p>
        ) : (
          <div className="space-y-3">
            {history.map((entry, i) => {
              const key = `${entry.report.productName}-${entry.createdAt}-${i}`;
              return (
                <div
                  key={key}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl2 border border-line bg-white p-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-ink">{entry.report.productName}</p>
                    <p className="text-xs text-mist">
                      {entry.report.reportPeriod} &middot; generated{" "}
                      {new Date(entry.createdAt).toLocaleDateString()}
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
