import crypto from "crypto";
import { kvSet, kvGet, kvDel, isConfigured } from "./store";

// Hand-rolled, dependency-free auth: no NextAuth/Auth.js, consistent with
// the rest of this codebase's "small, explicit, no framework you didn't
// choose" style. There's no signup step and no password — whoever can
// click the link sent to an inbox controls that inbox's report history,
// which is the same trust model as "email me the report" already used.
//
// Two building blocks:
// 1. Single-use login/unsubscribe tokens: random, opaque, stored in
//    Upstash with a TTL, looked up once and deleted. Requires Upstash to
//    be configured — login and the report feed are optional, Upstash-
//    backed features layered on top of the core (API-key-only) product.
// 2. The session cookie itself: signed with SESSION_SECRET so it can be
//    verified on every request without a database round trip.

const LOGIN_TOKEN_PREFIX = "cia:login-token:";
const LOGIN_TOKEN_TTL_SECONDS = 15 * 60; // 15 minutes

const UNSUB_TOKEN_PREFIX = "cia:unsub-token:";
// No expiry set on unsubscribe tokens — they're mailed out and may sit
// unread for a while; someone should always be able to unsubscribe.

export const SESSION_COOKIE_NAME = "cia_session";
const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

export const authEnabled = isConfigured;

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "SESSION_SECRET is not set. Add it to your environment variables (see .env.example) — login and the account feed need it to sign session cookies."
    );
  }
  return secret;
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

// --- login tokens (magic link) ---

export async function createLoginToken(email: string): Promise<string> {
  const token = crypto.randomBytes(24).toString("base64url");
  await kvSet(LOGIN_TOKEN_PREFIX + token, email.toLowerCase(), LOGIN_TOKEN_TTL_SECONDS);
  return token;
}

/** Single-use: returns the email once, then the token is dead. */
export async function consumeLoginToken(token: string): Promise<string | null> {
  const email = await kvGet(LOGIN_TOKEN_PREFIX + token);
  if (!email) return null;
  await kvDel(LOGIN_TOKEN_PREFIX + token);
  return email;
}

// --- unsubscribe tokens (one-click, no login required, embedded in every email) ---

interface UnsubTarget {
  email: string;
  productName: string;
}

export async function createUnsubscribeToken(target: UnsubTarget): Promise<string> {
  const token = crypto.randomBytes(24).toString("base64url");
  await kvSet(UNSUB_TOKEN_PREFIX + token, JSON.stringify(target));
  return token;
}

/** Not single-use on purpose — someone might click an old email's link
 *  twice, or a mail client might "prefetch" the link once already. Both
 *  should just land on the same "you're unsubscribed" confirmation. */
export async function resolveUnsubscribeToken(token: string): Promise<UnsubTarget | null> {
  const raw = await kvGet(UNSUB_TOKEN_PREFIX + token);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UnsubTarget;
  } catch {
    return null;
  }
}

// --- session cookie ---

export function createSessionCookieValue(email: string): string {
  const exp = Date.now() + SESSION_TTL_SECONDS * 1000;
  const payload = base64url(JSON.stringify({ email: email.toLowerCase(), exp }));
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function verifySessionCookieValue(value: string | undefined | null): string | null {
  if (!value) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;

  let expected: string;
  try {
    expected = sign(payload);
  } catch {
    return null; // SESSION_SECRET not configured
  }

  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const { email, exp } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof email !== "string" || typeof exp !== "number" || Date.now() > exp) return null;
    return email;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_MAX_AGE = SESSION_TTL_SECONDS;
