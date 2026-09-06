import { NextRequest, NextResponse } from "next/server";
import { sendReportEmail } from "@/lib/email";
import { renderReportPdf } from "@/lib/pdf";
import { createUnsubscribeToken } from "@/lib/auth";
import { saveSubscription, saveReportToHistory } from "@/lib/store";
import type { AnalysisInput, CompetitiveReport } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: {
    email?: string;
    report?: CompetitiveReport;
    subscribeMonthly?: boolean;
    input?: AnalysisInput;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.email || !EMAIL_RE.test(body.email)) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }
  if (!body.report) {
    return NextResponse.json({ error: "No report provided to send." }, { status: 400 });
  }

  const { email, report } = body;

  // Every send of a real (non-demo) report also registers it for monthly
  // re-delivery — the frontend only sends `input` for reports it generated
  // itself via /create, never for the static /demo sample report.
  const willSubscribe = Boolean(body.subscribeMonthly && body.input);

  try {
    const pdfBuffer = await renderReportPdf(report);
    const manageUrl = new URL("/account", req.nextUrl.origin).toString();
    const unsubscribeUrl = willSubscribe
      ? new URL(
          `/api/unsubscribe?token=${await createUnsubscribeToken({ email, productName: report.productName })}`,
          req.nextUrl.origin
        ).toString()
      : undefined;

    await sendReportEmail(email, report, {
      subscribed: willSubscribe,
      pdfBuffer,
      manageUrl,
      unsubscribeUrl,
    });

    if (willSubscribe && body.input) {
      try {
        await saveSubscription(email, body.input);
      } catch (err) {
        console.error("Failed to save monthly subscription:", err);
        // The email itself still sent successfully — don't fail the request
        // over best-effort subscription persistence.
      }
    }

    // Best-effort: show up in the /account feed. Never fails the request —
    // the email already sent, that's what matters most.
    saveReportToHistory(email, report, { subscribed: willSubscribe, emailed: true }).catch(
      (err) => console.error("Failed to save report history:", err)
    );

    return NextResponse.json({ ok: true, subscribed: willSubscribe });
  } catch (err) {
    console.error("send-report-email failed:", err);
    const message = err instanceof Error ? err.message : "Failed to send email.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
