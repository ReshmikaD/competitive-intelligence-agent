import { NextRequest, NextResponse } from "next/server";
import { generateReport } from "@/lib/anthropic";
import { sendReportEmail } from "@/lib/email";
import { renderReportPdf } from "@/lib/pdf";
import { createUnsubscribeToken } from "@/lib/auth";
import { listSubscriptions, monthlyAutomationEnabled, saveReportToHistory } from "@/lib/store";

export const runtime = "nodejs";
// Regenerating every subscriber's report involves real web research per
// subscriber; 300s requires a Vercel Pro plan (clamped to 60s on Hobby).
export const maxDuration = 300;

// Triggered by Vercel Cron (see vercel.json) on the 1st of each month.
// Regenerates and emails a fresh report — based on the last 30 days of
// competitor activity — for every saved subscription. If Upstash Redis
// isn't configured, this is a harmless no-op — monthly automation is
// opt-in infrastructure, not required for the app to work.
export async function GET(req: NextRequest) {
  // Vercel signs cron requests with this header; verify in production.
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!monthlyAutomationEnabled()) {
    return NextResponse.json({ skipped: true, reason: "Upstash Redis not configured." });
  }

  const subscriptions = await listSubscriptions();
  const results: { email: string; ok: boolean; error?: string }[] = [];

  const appUrl = req.nextUrl.origin;

  for (const sub of subscriptions) {
    try {
      const report = await generateReport(sub.input);
      const pdfBuffer = await renderReportPdf(report);
      const unsubscribeToken = await createUnsubscribeToken({
        email: sub.email,
        productName: report.productName,
      });
      await sendReportEmail(sub.email, report, {
        subscribed: true,
        pdfBuffer,
        manageUrl: `${appUrl}/account`,
        unsubscribeUrl: `${appUrl}/api/unsubscribe?token=${unsubscribeToken}`,
      });
      await saveReportToHistory(sub.email, report, { subscribed: true }).catch((err) =>
        console.error("Failed to save report history:", err)
      );
      results.push({ email: sub.email, ok: true });
    } catch (err) {
      results.push({
        email: sub.email,
        ok: false,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  return NextResponse.json({ processed: results.length, results });
}
