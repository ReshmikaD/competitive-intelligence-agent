import { NextRequest, NextResponse } from "next/server";
import {
  authEnabled,
  createSessionCookieValue,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_MAX_AGE,
} from "@/lib/auth";
import { createUser, getUser, hashPassword, EMAIL_RE } from "@/lib/users";

export const runtime = "nodejs";

const MAX_NAME_LENGTH = 60;

// Creates a new account (first name, last name, email, hashed password) and
// signs the visitor straight in. No email is sent or received anywhere in
// this flow — accounts are usable immediately.
export async function POST(req: NextRequest) {
  if (!authEnabled()) {
    return NextResponse.json(
      { error: "Sign-up isn't available on this deployment right now." },
      { status: 501 }
    );
  }

  let body: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const firstName = body.firstName?.trim().slice(0, MAX_NAME_LENGTH) ?? "";
  const lastName = body.lastName?.trim().slice(0, MAX_NAME_LENGTH) ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  const confirmPassword = body.confirmPassword ?? "";

  if (!firstName) {
    return NextResponse.json({ error: "First name is required." }, { status: 400 });
  }
  if (!lastName) {
    return NextResponse.json({ error: "Last name is required." }, { status: 400 });
  }
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return NextResponse.json(
      { error: "Password must include at least one letter and one number." },
      { status: 400 }
    );
  }
  if (password !== confirmPassword) {
    return NextResponse.json({ error: "Passwords don't match." }, { status: 400 });
  }

  const existing = await getUser(email);
  if (existing) {
    return NextResponse.json(
      { error: "An account already exists for this email.", code: "email_exists" },
      { status: 409 }
    );
  }

  const created = await createUser({
    email,
    firstName,
    lastName,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  });
  if (!created) {
    // Lost a race with a concurrent signup for the same email between the
    // getUser check above and this atomic SET ... NX write.
    return NextResponse.json(
      { error: "An account already exists for this email.", code: "email_exists" },
      { status: 409 }
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(
    SESSION_COOKIE_NAME,
    createSessionCookieValue({ email, firstName }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_COOKIE_MAX_AGE,
    }
  );
  return response;
}
