"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "creating" | "error">("idle");
  const [error, setError] = useState("");
  const [errorCode, setErrorCode] = useState<string | undefined>(undefined);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("creating");
    setError("");
    setErrorCode(undefined);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorCode(data.code);
        throw new Error(data.error || "Failed to create your account.");
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
            Competitive Intelligence Agent
          </span>
        </Link>

        <div className="rounded-xl2 border border-line bg-white p-6 shadow-card">
          <h1 className="text-lg font-semibold text-ink">Create your account</h1>
          <p className="mt-1 text-sm text-mist">
            Save your reports and pick up where you left off.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">First name</label>
              <input
                type="text"
                required
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Jane"
                className="w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Last name</label>
              <input
                type="text"
                required
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              />
            </div>

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
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              />
              <p className="mt-1.5 text-xs text-mist">
                At least 8 characters, with a letter and a number.
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                Confirm password
              </label>
              <input
                type="password"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              />
            </div>

            <button
              type="submit"
              disabled={status === "creating"}
              className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent-dark disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              {status === "creating" ? "Creating account…" : "Create Account"}
            </button>
            {status === "error" && (
              <p className="text-xs text-threat-high">
                {error}{" "}
                {errorCode === "email_exists" && (
                  <Link href="/login" className="underline underline-offset-2 hover:no-underline">
                    Log in instead.
                  </Link>
                )}
              </p>
            )}
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-mist">
          Already have an account?{" "}
          <Link href="/login" className="text-ink underline underline-offset-2 hover:no-underline">
            Log in
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
