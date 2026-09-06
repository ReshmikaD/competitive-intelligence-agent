import { NextRequest, NextResponse } from "next/server";
import { consumeLoginToken, createSessionCookieValue, SESSION_COOKIE_NAME, SESSION_COOKIE_MAX_AGE } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const email = token ? await consumeLoginToken(token) : null;

  if (!email) {
    return NextResponse.redirect(new URL("/login?error=expired", req.nextUrl.origin));
  }

  const response = NextResponse.redirect(new URL("/account", req.nextUrl.origin));
  response.cookies.set(SESSION_COOKIE_NAME, createSessionCookieValue(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_COOKIE_MAX_AGE,
  });
  return response;
}
