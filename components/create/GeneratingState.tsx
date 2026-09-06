"use client";

import { useEffect, useState } from "react";

const STEPS = [
  "Searching the web for your competitors…",
  "Reading competitor websites and recent news…",
  "Converting research into PM insights…",
  "Building your report…",
];

function formatElapsed(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function GeneratingState({ onCancel }: { onCancel: () => void }) {
  const [activeStep, setActiveStep] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (activeStep >= STEPS.length - 1) return;
    const t = setTimeout(() => setActiveStep((s) => s + 1), 1800);
    return () => clearTimeout(t);
  }, [activeStep]);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-28 text-center">
      <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink">
        <span className="h-4 w-4 animate-pulse rounded-full bg-accent" />
      </div>
      <h2 className="text-xl font-semibold text-ink">The agent is working</h2>
      <p className="mt-2 text-sm text-mist">
        Claude is actually browsing the web — usually takes 30-90 seconds.
      </p>
      <p className="mt-1 font-mono text-xs text-mist">Elapsed: {formatElapsed(elapsedSeconds)}</p>

      <div className="mt-9 w-full space-y-3 text-left">
        {STEPS.map((label, i) => {
          const done = i < activeStep;
          const active = i === activeStep;
          return (
            <div
              key={label}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 transition ${
                active
                  ? "border-accent/40 bg-accent-soft/50"
                  : done
                  ? "border-line bg-white"
                  : "border-line bg-paper opacity-50"
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] ${
                  done
                    ? "bg-threat-low text-white"
                    : active
                    ? "bg-accent text-white"
                    : "border border-line text-transparent"
                }`}
              >
                {done ? "✓" : active ? "" : ""}
              </span>
              <span className={`text-sm ${active ? "text-ink" : done ? "text-ink" : "text-mist"}`}>
                {label}
              </span>
              {active && (
                <span className="ml-auto flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:-0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:-0.1s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent" />
                </span>
              )}
            </div>
          );
        })}
      </div>

      {elapsedSeconds > 45 && (
        <div className="mt-6 w-full rounded-lg border border-line bg-paper p-3 text-xs text-mist">
          Still working — this can take longer during busy periods.
        </div>
      )}

      <button
        onClick={onCancel}
        className="mt-8 text-xs text-mist underline transition hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        Cancel and go back
      </button>
    </div>
  );
}
