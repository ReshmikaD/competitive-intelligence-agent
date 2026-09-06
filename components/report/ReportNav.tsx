"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "exec-summary", label: "Executive Summary" },
  { id: "competitor-landscape", label: "Competitor Landscape" },
  { id: "feature-movement", label: "Feature Movement" },
  { id: "market-trends", label: "Market Trends" },
  { id: "opportunity-radar", label: "Opportunity Radar" },
  { id: "recommended-actions", label: "Recommended Actions" },
  { id: "sources", label: "Resources Consulted" },
];

export default function ReportNav() {
  const [active, setActive] = useState(SECTIONS[0].id);

  useEffect(() => {
    const elements = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -70% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Desktop: sticky left rail */}
      <nav className="no-print hidden lg:sticky lg:top-24 lg:block lg:self-start">
        <ul className="space-y-1">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`block border-l-2 py-1.5 pl-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                  active === s.id
                    ? "border-accent text-ink font-medium"
                    : "border-transparent text-mist hover:text-ink"
                }`}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile/tablet: sticky horizontal pill bar */}
      <nav className="no-print sticky top-[65px] z-40 -mx-6 mb-8 overflow-x-auto bg-paper/95 px-6 py-3 backdrop-blur-sm lg:hidden">
        <div className="flex gap-2">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                active === s.id
                  ? "bg-accent-soft text-accent-dark font-medium"
                  : "border border-line bg-white text-mist"
              }`}
            >
              {s.label}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}
