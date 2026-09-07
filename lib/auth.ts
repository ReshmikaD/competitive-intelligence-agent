import crypto from "crypto";
import { isConfigured } from "./store";

// Hand-rolled, dependency-free auth: no NextAuth/Auth.js, consistent with
// the rest of this codebase's "small, explicit" style. There's no password
// and no verification email — entering an email creates a signed session
// for it immediately, and that session gates access to that email's own
// report history. This trades a stronger identity guarantee for a login
// that never leaves the app: nothing is ever sent or received over email.
//
// The session cookie is signed with SESSION_SECRET so it can be verified
// on every request without a database round trip. Login itself only needs
// Upstash (via isConfigured) to be available so the report history it
// unlocks actually has something to show.

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
