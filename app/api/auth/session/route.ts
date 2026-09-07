import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionCookieValue } from "@/lib/auth";

export const runtime = "nodejs";

// Lightweight client-side session check — used by the report view to decide
// whether to auto-save a freshly generated report or show the "create an
// account to save this" prompt instead.
export async function GET() {
  const cookieStore = await cookies();
  const session = verifySessionCookieValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  return NextResponse.json({ session });
}
