import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionCookieValue } from "@/lib/auth";
import { removeSubscription } from "@/lib/store";

export const runtime = "nodejs";

// Session-authenticated unsubscribe, used from the /account feed. For the
// no-login, one-click link embedded in emails, see app/api/unsubscribe.
export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const email = verifySessionCookieValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!email) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let body: { productName?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.productName) {
    return NextResponse.json({ error: "productName is required." }, { status: 400 });
  }

  await removeSubscription(email, body.productName);
  return NextResponse.json({ ok: true });
}
