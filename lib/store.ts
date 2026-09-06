import type { AnalysisInput, CompetitiveReport } from "./types";

// Persistence backed by Upstash Redis (Vercel's recommended KV
// integration). Everything here is a graceful no-op if the integration
// isn't configured, so report generation and one-off emailing still work
// without it — this only powers monthly automation, the account feed
// (report history), and login. See README for setup.

const SUB_PREFIX = "cia:sub:"; // cia:sub:<email>:<productSlug> -> Subscription
const SUB_BY_EMAIL_PREFIX = "cia:subs-by-email:"; // set of sub keys for one email
const SUB_INDEX = "cia:subs-index"; // set of every sub key, for the cron fan-out
const HISTORY_PREFIX = "cia:history:"; // cia:history:<email> -> list of HistoryEntry (newest first)
const HISTORY_LIMIT = 24; // ~2 years of monthly reports per person, keeps storage bounded

export function isConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

async function redisFetch(command: unknown[]) {
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

// --- generic KV helpers (also used by lib/auth.ts for login/unsubscribe tokens) ---

export async function kvSet(key: string, value: string, exSeconds?: number): Promise<void> {
  if (!isConfigured()) return;
  const command = exSeconds ? ["SET", key, value, "EX", String(exSeconds)] : ["SET", key, value];
  await redisFetch(command);
}

export async function kvGet(key: string): Promise<string | null> {
  if (!isConfigured()) return null;
  const res = await redisFetch(["GET", key]);
  return res.result ?? null;
}

export async function kvDel(key: string): Promise<void> {
  if (!isConfigured()) return;
  await redisFetch(["DEL", key]);
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "product";
}

export interface Subscription {
  input: AnalysisInput;
  email: string;
  savedAt: string;
}

function subKey(email: string, productName: string): string {
  return `${SUB_PREFIX}${email.toLowerCase()}:${slugify(productName)}`;
}

/** Save (or overwrite) the config to re-run monthly for this email + product.
 *  A single email can track several products — each gets its own subscription. */
export async function saveSubscription(email: string, input: AnalysisInput): Promise<void> {
  if (!isConfigured()) return; // silently skip — monthly automation is opt-in infra
  const key = subKey(email, input.productName);
  const value: Subscription = { input, email, savedAt: new Date().toISOString() };
  await redisFetch(["SET", key, JSON.stringify(value)]);
  await redisFetch(["SADD", SUB_BY_EMAIL_PREFIX + email.toLowerCase(), key]);
  await redisFetch(["SADD", SUB_INDEX, key]);
}

export async function removeSubscription(email: string, productName: string): Promise<void> {
  if (!isConfigured()) return;
  const key = subKey(email, productName);
  await redisFetch(["DEL", key]);
  await redisFetch(["SREM", SUB_BY_EMAIL_PREFIX + email.toLowerCase(), key]);
  await redisFetch(["SREM", SUB_INDEX, key]);
}

/** Used by the monthly cron job to fan out to every saved subscription, across all users. */
export async function listSubscriptions(): Promise<Subscription[]> {
  if (!isConfigured()) return [];
  const indexRes = await redisFetch(["SMEMBERS", SUB_INDEX]);
  const keys: string[] = indexRes.result || [];
  return fetchSubscriptionsByKeys(keys);
}

/** Used by the /account feed to show one person's active subscriptions. */
export async function listSubscriptionsForEmail(email: string): Promise<Subscription[]> {
  if (!isConfigured()) return [];
  const indexRes = await redisFetch(["SMEMBERS", SUB_BY_EMAIL_PREFIX + email.toLowerCase()]);
  const keys: string[] = indexRes.result || [];
  return fetchSubscriptionsByKeys(keys);
}

async function fetchSubscriptionsByKeys(keys: string[]): Promise<Subscription[]> {
  const subs: Subscription[] = [];
  for (const key of keys) {
    const res = await redisFetch(["GET", key]);
    if (res.result) {
      try {
        subs.push(JSON.parse(res.result));
      } catch {
        // skip malformed entries
      }
    }
  }
  return subs;
}

export const monthlyAutomationEnabled = isConfigured;

// --- report history (the "feed" on /account) ---

export interface HistoryEntry {
  report: CompetitiveReport;
  sentAt: string;
  subscribed: boolean;
}

/** Record that a report was actually emailed to this address, so it shows
 *  up in their /account feed. Called after every successful send — both
 *  one-off "email this report" sends and monthly cron deliveries. */
export async function saveReportToHistory(
  email: string,
  report: CompetitiveReport,
  opts: { subscribed: boolean }
): Promise<void> {
  if (!isConfigured()) return;
  const key = HISTORY_PREFIX + email.toLowerCase();
  const entry: HistoryEntry = { report, sentAt: new Date().toISOString(), subscribed: opts.subscribed };
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
