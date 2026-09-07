import { NextRequest, NextResponse } from "next/server";
import {
  authEnabled,
  createSessionCookieValue,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_MAX_AGE,
} from "@/lib/auth";
import { getUser, verifyPassword, EMAIL_RE } from "@/lib/users";

export const runtime = "nodejs";

// Looks up the account by email and checks the password against its stored
// hash. No email is sent or received anywhere in this flow.
export async function POST(req: NextRequest) {
  if (!authEnabled()) {
    return NextResponse.json(
      { error: "Sign-in isn't available on this deployment right now." },
      { status: 501 }
    );
  }

  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";
  if (!email || !EMAIL_RE.test(email) || !password) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }

  const user = await getUser(email);
  if (!user) {
    return NextResponse.json(
      { error: "No account found for that email.", code: "no_account" },
      { status: 401 }
    );
  }

  if (!verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "Incorrect password. Try again." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(
    SESSION_COOKIE_NAME,
    createSessionCookieValue({ email: user.email, firstName: user.firstName }),
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
