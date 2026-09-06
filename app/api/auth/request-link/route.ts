import { NextRequest, NextResponse } from "next/server";
import { createLoginToken, authEnabled } from "@/lib/auth";
import { sendLoginEmail } from "@/lib/email";

export const runtime = "nodejs";
export const maxDuration = 30;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  if (!authEnabled()) {
    return NextResponse.json(
      {
        error:
          "Login isn't configured on this deployment yet — it needs UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN and SESSION_SECRET set. See the README.",
      },
      { status: 501 }
    );
  }

  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }

  try {
    const token = await createLoginToken(email);
    const loginUrl = new URL(`/api/auth/verify?token=${token}`, req.nextUrl.origin).toString();
    await sendLoginEmail(email, loginUrl);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("request-link failed:", err);
    const message = err instanceof Error ? err.message : "Failed to send login link.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
