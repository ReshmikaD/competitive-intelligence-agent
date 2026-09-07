"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";

const LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#benefits", label: "Benefits" },
  { href: "#see-it-in-action", label: "See it in action" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        <span className="relative flex h-3.5 w-4 flex-col justify-between">
          <span
            className={`block h-0.5 w-full origin-center rounded-full bg-ink transition-transform duration-300 ${
              open ? "translate-y-[6px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-full rounded-full bg-ink transition-opacity duration-300 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block h-0.5 w-full origin-center rounded-full bg-ink transition-transform duration-300 ${
              open ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          />
        </span>
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[55] bg-ink/20 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Overlay panel — a right-anchored drawer, not full-width, so the
          backdrop above stays visible (and clickable) to its left. */}
      <div
        className={`fixed inset-y-0 right-0 z-[60] flex w-full max-w-xs flex-col bg-paper shadow-cardHover transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <span className="flex items-center gap-2">
            <Logo />
            <span className="font-mono text-[13px] font-medium tracking-tight text-ink">
              Scout AI
            </span>
          </span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <span className="relative block h-3.5 w-4">
              <span className="absolute left-0 top-1/2 block h-0.5 w-full -translate-y-1/2 rotate-45 rounded-full bg-ink" />
              <span className="absolute left-0 top-1/2 block h-0.5 w-full -translate-y-1/2 -rotate-45 rounded-full bg-ink" />
            </span>
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-6 px-6 py-10">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-lg text-ink transition hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="space-y-3 px-6 pb-10">
          <Link
            href="/create"
            onClick={() => setOpen(false)}
            className="block w-full rounded-lg bg-ink px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-ink/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Get Started
          </Link>
          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="block w-full rounded-lg border border-line px-4 py-3 text-center text-sm font-medium text-ink transition hover:border-ink/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            My Reports
          </Link>
        </div>
      </div>
    </div>
  );
}
