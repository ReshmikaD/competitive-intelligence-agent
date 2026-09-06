"use client";

import { useState } from "react";
import type { AnalysisInput } from "@/lib/types";

function TagInput({
  tags,
  onAdd,
  onRemove,
  placeholder,
}: {
  tags: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState("");

  function commit() {
    const value = draft.trim().replace(/,$/, "");
    if (value) onAdd(value);
    setDraft("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && draft === "" && tags.length > 0) {
      onRemove(tags[tags.length - 1]);
    }
  }

  return (
    <div className="flex w-full flex-wrap items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 focus-within:border-accent">
      {tags.map((t) => (
        <span
          key={t}
          className="flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent-dark"
        >
          {t}
          <button
            type="button"
            onClick={() => onRemove(t)}
            aria-label={`Remove ${t}`}
            className="ml-0.5 rounded-full text-accent-dark/70 transition hover:text-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1"
          >
            &times;
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        placeholder={tags.length === 0 ? placeholder : "Add another…"}
        className="min-w-[10rem] flex-1 border-none bg-transparent py-1 text-sm outline-none focus-visible:outline-none"
      />
    </div>
  );
}

export default function AnalysisForm({
  onSubmit,
}: {
  onSubmit: (input: AnalysisInput) => void;
}) {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [industry, setIndustry] = useState<string[]>([]);
  const [targetCustomers, setTargetCustomers] = useState<string[]>([]);
  const [knownCompetitors, setKnownCompetitors] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [monthlyDelivery, setMonthlyDelivery] = useState(false);

  const valid =
    productName.trim().length > 0 &&
    productDescription.trim().length > 0 &&
    industry.length > 0 &&
    targetCustomers.length > 0;

  function addTag(setter: React.Dispatch<React.SetStateAction<string[]>>) {
    return (value: string) => setter((prev) => (prev.includes(value) ? prev : [...prev, value]));
  }
  function removeTag(setter: React.Dispatch<React.SetStateAction<string[]>>) {
    return (value: string) => setter((prev) => prev.filter((v) => v !== value));
  }

  function handleSubmit() {
    if (!valid) return;
    onSubmit({
      productName: productName.trim(),
      productDescription: productDescription.trim(),
      industry,
      targetCustomers,
      knownCompetitors,
      email: email.trim() || undefined,
      monthlyDelivery: monthlyDelivery && Boolean(email.trim()),
    });
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <p className="mb-1 font-mono text-xs uppercase tracking-wide text-mist">
        Tell Claude about your product
      </p>
      <h1 className="mb-8 text-2xl font-semibold tracking-tight text-ink">
        Four things, then we research.
      </h1>

      <div className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Product Name</label>
          <input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g. PulseCRM"
            className="w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            What does it do? <span className="font-normal text-mist">(1-2 sentences)</span>
          </label>
          <textarea
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            placeholder="e.g. A lightweight CRM built for SMB sales teams who want pipeline tracking without Salesforce-level complexity."
            rows={3}
            className="w-full resize-none rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Industry</label>
          <TagInput
            tags={industry}
            onAdd={addTag(setIndustry)}
            onRemove={removeTag(setIndustry)}
            placeholder="e.g. Sales & CRM Software, then press Enter"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Target Customers</label>
          <TagInput
            tags={targetCustomers}
            onAdd={addTag(setTargetCustomers)}
            onRemove={removeTag(setTargetCustomers)}
            placeholder="e.g. SMB sales teams, then press Enter"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Competitors <span className="font-normal text-mist">(optional — Claude will find more)</span>
          </label>
          <TagInput
            tags={knownCompetitors}
            onAdd={addTag(setKnownCompetitors)}
            onRemove={removeTag(setKnownCompetitors)}
            placeholder="e.g. HubSpot, then press Enter"
          />
        </div>

        <div className="rounded-lg border border-line bg-paper p-4">
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Email address <span className="font-normal text-mist">(optional)</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          />
          <p className="mt-2 text-xs text-mist">
            We&apos;ll save this report to your dashboard so you can find it later — just log
            in with this same email, no account setup required.
          </p>
          <label className="mt-3 flex items-center gap-2 text-sm text-mist">
            <input
              type="checkbox"
              checked={monthlyDelivery}
              disabled={!email.trim()}
              onChange={(e) => setMonthlyDelivery(e.target.checked)}
              className="accent-accent"
            />
            Also send me a fresh version of this every month
          </label>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSubmit}
            disabled={!valid}
            className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white shadow-card transition hover:bg-accent-dark disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Research & Generate My Report
          </button>
        </div>
        {!valid && (
          <p className="text-right text-xs text-mist">
            Add a product name, description, industry, and at least one target customer to
            continue.
          </p>
        )}
      </div>
    </div>
  );
}
