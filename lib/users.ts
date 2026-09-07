import crypto from "crypto";
import { redisFetch, isConfigured } from "./store";

// User account storage, alongside lib/store.ts's report history — same
// Upstash Redis backend, same "small, explicit, no ORM" style. Passwords
// are never stored (or logged) in plain text: see hashPassword/verifyPassword
// below, which use Node's built-in crypto.scrypt rather than pulling in a
// dependency like bcrypt/argon2.

const USER_PREFIX = "cia:user:"; // cia:user:<email> -> JSON UserRecord

// Shared by the signup and login routes so the email-format check can't
// drift between the two.
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface UserRecord {
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string; // "<salt-hex>:<hash-hex>"
  createdAt: string;
}

const SCRYPT_KEYLEN = 64;
const SALT_BYTES = 16;

/** Derives a salted scrypt hash and returns "salt:hash" (both hex) so the
 *  salt travels with the hash — never store or log the raw password. */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(SALT_BYTES).toString("hex");
  const derived = crypto.scryptSync(password, salt, SCRYPT_KEYLEN);
  return `${salt}:${derived.toString("hex")}`;
}

/** Re-derives the hash for the given password with the stored salt and
 *  compares in constant time via crypto.timingSafeEqual. */
export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hashHex] = stored.split(":");
  if (!salt || !hashHex) return false;
  const storedBuf = Buffer.from(hashHex, "hex");
  const derived = crypto.scryptSync(password, salt, storedBuf.length || SCRYPT_KEYLEN);
  if (derived.length !== storedBuf.length) return false;
  return crypto.timingSafeEqual(derived, storedBuf);
}

export async function getUser(email: string): Promise<UserRecord | null> {
  if (!isConfigured()) return null;
  const res = await redisFetch(["GET", USER_PREFIX + email.toLowerCase()]);
  if (!res.result) return null;
  try {
    return JSON.parse(res.result) as UserRecord;
  } catch {
    return null;
  }
}

/** Creates the user record only if the email isn't already taken, using
 *  Redis's SET ... NX so two concurrent signups for the same email can't
 *  both succeed (the second would otherwise silently overwrite the
 *  first). Returns false if the key already existed — callers should
 *  treat that the same as the pre-existing "email already registered"
 *  case. */
export async function createUser(record: UserRecord): Promise<boolean> {
  const key = USER_PREFIX + record.email.toLowerCase();
  const res = await redisFetch(["SET", key, JSON.stringify(record), "NX"]);
  // Upstash's REST API returns { result: "OK" } when the SET applied, and
  // { result: null } when NX blocked it because the key already existed.
  return res.result === "OK";
}
