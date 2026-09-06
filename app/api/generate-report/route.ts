import { NextRequest, NextResponse } from "next/server";
import { generateReport } from "@/lib/anthropic";
import { saveSubscription, saveReportToHistory } from "@/lib/store";
import type { AnalysisInput } from "@/lib/types";

export const runtime = "nodejs";
// Real web research (search + fetch across competitor sites, TechCrunch,
// etc.) takes longer than a single model call. 300s requires a Vercel Pro
// plan; on the Hobby plan this is clamped to 60s, which may be tight for
// requests with many named competitors.
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  let body: AnalysisInput;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (
    !body.productName?.trim() ||
    !body.productDescription?.trim() ||
    !Array.isArray(body.industry) ||
    body.industry.filter((i) => i?.trim()).length === 0 ||
    !Array.isArray(body.targetCustomers) ||
    body.targetCustomers.filter((t) => t?.trim()).length === 0
  ) {
    return NextResponse.json(
      {
        error:
          "Product name, description, industry, and at least one target customer are required.",
      },
      { status: 400 }
    );
  }

  try {
    const report = await generateReport(body);

    // Best-effort: save the config so the monthly cron job can regenerate
    // and re-send it later. Never blocks or fails the main request.
    if (body.monthlyDelivery && body.email) {
      saveSubscription(body.email, body).catch((err) =>
        console.error("Failed to save monthly subscription:", err)
      );
    }

    // Best-effort: as long as an email was given, save this report to that
    // person's dashboard right away — logging in later should show every
    // report they've ever generated, not just the ones they explicitly
    // emailed to themselves.
    if (body.email) {
      saveReportToHistory(body.email, report, {
        subscribed: Boolean(body.monthlyDelivery),
        emailed: false,
      }).catch((err) => console.error("Failed to save report history:", err));
    }

    return NextResponse.json({ report });
  } catch (err) {
    console.error("generate-report failed:", err);
    const message = err instanceof Error ? err.message : "Failed to generate report.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
