import type { NextApiRequest, NextApiResponse } from "next";
import { renderReportPdf } from "@/lib/pdf";
import type { CompetitiveReport } from "@/lib/types";

// NOTE: this lives under pages/api (not app/api) on purpose. Next's App
// Router bundles Route Handlers through the same module graph it uses to
// enforce a single React instance for Server Components, which silently
// aliases "react" to Next's internal copy. @react-pdf/renderer ships its
// own reconciler that expects the plain node_modules "react" — mixing the
// two throws a cryptic "Objects are not valid as a React child" (minified
// error #31). Pages API routes aren't part of that RSC module graph, so
// this avoids the conflict entirely.
export const config = {
  api: {
    responseLimit: "20mb",
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  const report = req.body?.report as CompetitiveReport | undefined;
  if (!report) {
    res.status(400).json({ error: "A report is required." });
    return;
  }

  try {
    const pdfBuffer = await renderReportPdf(report);
    const fileName = `${report.productName.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "report"}-competitive-intelligence.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);
    res.status(200).send(pdfBuffer);
  } catch (err) {
    console.error("report-pdf failed:", err);
    res.status(500).json({ error: "Failed to render PDF." });
  }
}
