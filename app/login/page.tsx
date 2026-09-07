"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "signing-in" | "error">("idle");
  const [error, setError] = useState("");
  const [errorCode, setErrorCode] = useState<string | undefined>(undefined);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setStatus("signing-in");
    setError("");
    setErrorCode(undefined);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorCode(data.code);
        throw new Error(data.error || "Failed to log in.");
      }
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
            Scout AI
          </span>
        </Link>

        <div className="rounded-xl2 border border-line bg-white p-6 shadow-card">
          <h1 className="text-lg font-semibold text-ink">Log in</h1>
          <p className="mt-1 text-sm text-mist">
            Enter your email and password to see your reports.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Email</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Password</label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              />
            </div>

            <button
              type="submit"
              disabled={status === "signing-in"}
              className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent-dark disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              {status === "signing-in" ? "Logging in…" : "Log In"}
            </button>

            <p className="text-xs text-mist">
              Forgot your password? There&apos;s no recovery yet — you&apos;ll need to sign up
              again with a different email. Reports won&apos;t transfer.
            </p>

            {status === "error" && (
              <p className="text-xs text-threat-high">
                {error}{" "}
                {errorCode === "no_account" && (
                  <Link href="/signup" className="underline underline-offset-2 hover:no-underline">
                    Sign up instead.
                  </Link>
                )}
              </p>
            )}
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-mist">
          New here?{" "}
          <Link href="/signup" className="text-ink underline underline-offset-2 hover:no-underline">
            Create an account
          </Link>
        </p>

        <p className="mt-3 text-center text-xs text-mist">
          <Link href="/" className="hover:text-ink">
            ← Back home
          </Link>
        </p>
      </div>
    </main>
  );
}
