import { NextRequest, NextResponse } from "next/server";
import { verifyEmailTransport } from "@/lib/email";

export const runtime = "nodejs";
export const maxDuration = 30;

// A quick, safe way to confirm GMAIL_USER / GMAIL_APP_PASSWORD actually
// work after deploying — checks the SMTP connection and auth without
// sending a real email to anyone. Protected by DEBUG_EMAIL_SECRET so it
// isn't a public probe of your mail server config.
//
//   curl "https://your-app.vercel.app/api/debug/email-check?secret=YOUR_SECRET"
export async function GET(req: NextRequest) {
  const configuredSecret = process.env.DEBUG_EMAIL_SECRET;
  if (!configuredSecret) {
    return NextResponse.json(
      { error: "Set DEBUG_EMAIL_SECRET in your environment to enable this check." },
      { status: 501 }
    );
  }

  const providedSecret = req.nextUrl.searchParams.get("secret");
  if (providedSecret !== configuredSecret) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    await verifyEmailTransport();
    return NextResponse.json({ ok: true, message: "Gmail SMTP connection and auth succeeded." });
  } catch (err) {
    console.error("email-check failed:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
