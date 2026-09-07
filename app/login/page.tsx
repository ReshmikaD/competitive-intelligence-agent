"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "signing-in" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("signing-in");
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to sign in.");
      router.push("/account");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
          <Logo />
          <span className="text-sm font-semibold tracking-tight text-ink">
            Competitive Intelligence Agent
          </span>
        </Link>

        <div className="rounded-xl2 border border-line bg-white p-6 shadow-card">
          <h1 className="text-lg font-semibold text-ink">Sign in</h1>
          <p className="mt-1 text-sm text-mist">
            Enter your email to see your report history. No password, nothing to check —
            you're in right away.
          </p>

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
              disabled={status === "signing-in"}
              className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent-dark disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              {status === "signing-in" ? "Signing in…" : "Sign in"}
            </button>
            {status === "error" && <p className="text-xs text-threat-high">{error}</p>}
          </form>
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
