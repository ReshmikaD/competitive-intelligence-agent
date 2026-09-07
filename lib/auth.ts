import crypto from "crypto";
import { isConfigured } from "./store";

// Hand-rolled, dependency-free auth: no NextAuth/Auth.js, consistent with
// the rest of this codebase's "small, explicit" style. Accounts are
// email + password (see lib/users.ts for storage and hashing), but there is
// still no verification email and no email-based password recovery —
// nothing is ever sent or received over email anywhere in this flow.
//
// The session cookie is signed with SESSION_SECRET so it can be verified
// on every request without a database round trip. It carries just enough
// ({ email, firstName }) to render the account greeting without an extra
// lookup. Login/signup itself only needs Upstash (via isConfigured) to be
// available so accounts and report history actually have somewhere to live.

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

// --- session cookie ---

/** What the signed session cookie carries. Deliberately excludes the
 *  password/hash — just enough to render the account greeting without an
 *  extra database lookup. */
export interface SessionPayload {
  email: string;
  firstName: string;
}

export function createSessionCookieValue(payload: SessionPayload): string {
  const exp = Date.now() + SESSION_TTL_SECONDS * 1000;
  const data = base64url(
    JSON.stringify({ email: payload.email.toLowerCase(), firstName: payload.firstName, exp })
  );
  const signature = sign(data);
  return `${data}.${signature}`;
}

export function verifySessionCookieValue(value: string | undefined | null): SessionPayload | null {
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
    const { email, firstName, exp } = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    );
    if (
      typeof email !== "string" ||
      typeof firstName !== "string" ||
      typeof exp !== "number" ||
      Date.now() > exp
    ) {
      return null;
    }
    return { email, firstName };
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_MAX_AGE = SESSION_TTL_SECONDS;
