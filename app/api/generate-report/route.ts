import { NextRequest, NextResponse } from "next/server";
import { generateReport } from "@/lib/anthropic";
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

    // Saving to a dashboard now happens client-side on the report view,
    // gated by whether the visitor has an active session (see
    // components/report/ReportView.tsx and app/api/reports/save/route.ts) —
    // this endpoint no longer keys anything off an email collected here.

    return NextResponse.json({ report });
  } catch (err) {
    // Log the real error server-side, but never forward internal details
    // (API errors, config problems, etc.) to the client.
    console.error("generate-report failed:", err);
    return NextResponse.json(
      { error: "We couldn't generate this report right now. Please try again in a moment." },
      { status: 500 }
    );
  }
}
