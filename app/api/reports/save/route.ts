import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionCookieValue } from "@/lib/auth";
import { saveReportToHistory } from "@/lib/store";
import type { CompetitiveReport } from "@/lib/types";

export const runtime = "nodejs";

// Saves a just-generated report to the signed-in visitor's dashboard. The
// email is always taken from the verified session cookie, never trusted
// from the request body — this is what replaced the old "type your email
// into the create form" mechanic now that saving is account-gated.
export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const session = verifySessionCookieValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!session) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let body: { report?: CompetitiveReport };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.report) {
    return NextResponse.json({ error: "A report is required." }, { status: 400 });
  }

  try {
    await saveReportToHistory(session.email, body.report);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to save report history:", err);
    return NextResponse.json({ error: "Failed to save report." }, { status: 500 });
  }
}
