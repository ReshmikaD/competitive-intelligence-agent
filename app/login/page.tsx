"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";

// Isolated leaf so useSearchParams() doesn't force the whole page to bail
// out of static rendering — same pattern as app/create/page.tsx.
function ErrorFromUrl({ onError }: { onError: (hasError: boolean) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    onError(searchParams?.get("error") === "expired");
  }, [searchParams, onError]);
  return null;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [expired, setExpired] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/auth/request-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send login link.");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-6">
      <Suspense fallback={null}>
        <ErrorFromUrl onError={setExpired} />
      </Suspense>

      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
          <Logo />
          <span className="text-sm font-semibold tracking-tight text-ink">
            Competitive Intelligence Agent
          </span>
        </Link>

        <div className="rounded-xl2 border border-line bg-white p-6 shadow-card">
          {status === "sent" ? (
            <div className="text-center">
              <h1 className="text-lg font-semibold text-ink">Check your inbox</h1>
              <p className="mt-2 text-sm text-mist">
                We sent a sign-in link to <span className="font-medium text-ink">{email}</span>.
                It expires in 15 minutes.
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-lg font-semibold text-ink">Sign in</h1>
              <p className="mt-1 text-sm text-mist">
                See your report history and manage subscriptions. No password — we'll email you a
                link.
              </p>

              {expired && (
                <p className="mt-4 rounded-lg bg-threat-high/10 px-3 py-2 text-xs text-threat-high">
                  That link expired or was already used. Request a new one below.
                </p>
              )}

              <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                />
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent-dark disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                >
                  {status === "sending" ? "Sending…" : "Send me a sign-in link"}
                </button>
                {status === "error" && <p className="text-xs text-threat-high">{error}</p>}
              </form>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-mist">
          <Link href="/" className="hover:text-ink">
            ← Back home
          </Link>
        </p>
      </div>
    </main>
  );
}
