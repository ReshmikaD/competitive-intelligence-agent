import type { CompetitiveReport } from "./types";

// Persistence backed by Upstash Redis (Vercel's recommended KV
// integration). Report generation itself never depends on this — it only
// powers the account feed (report history) and login. See README for setup.

const HISTORY_PREFIX = "cia:history:"; // cia:history:<email> -> list of HistoryEntry (newest first)
const HISTORY_LIMIT = 50; // keeps storage bounded

export function isConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

export async function redisFetch(command: unknown[]) {
  const url = process.env.UPSTASH_REDIS_REST_URL!;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });
  if (!res.ok) throw new Error(`Upstash Redis error: ${res.status}`);
  return res.json();
}

// --- report history (the feed on /account) ---

export interface HistoryEntry {
  report: CompetitiveReport;
  createdAt: string;
}

/** Add an entry to this email's /account feed. Called right after
 *  generation, whenever the person provided an email. Best-effort and
 *  never blocks the caller. */
export async function saveReportToHistory(
  email: string,
  report: CompetitiveReport
): Promise<void> {
  if (!isConfigured()) return;
  const key = HISTORY_PREFIX + email.toLowerCase();
  const entry: HistoryEntry = {
    report,
    createdAt: new Date().toISOString(),
  };
  await redisFetch(["LPUSH", key, JSON.stringify(entry)]);
  await redisFetch(["LTRIM", key, "0", String(HISTORY_LIMIT - 1)]);
}

export async function listReportHistory(email: string): Promise<HistoryEntry[]> {
  if (!isConfigured()) return [];
  const res = await redisFetch(["LRANGE", HISTORY_PREFIX + email.toLowerCase(), "0", "-1"]);
  const raw: string[] = res.result || [];
  const entries: HistoryEntry[] = [];
  for (const item of raw) {
    try {
      entries.push(JSON.parse(item));
    } catch {
      // skip malformed entries
    }
  }
  return entries;
}
