import type { NextApiRequest, NextApiResponse } from "next";
import { renderReportPdf } from "@/lib/pdf";
import { sampleReport } from "@/lib/sampleReport";

// See pages/api/report-pdf.ts for why this lives under pages/api rather
// than app/api.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const pdfBuffer = await renderReportPdf(sampleReport);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'inline; filename="pulsecrm-sample-competitive-intelligence-report.pdf"'
    );
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.status(200).send(pdfBuffer);
  } catch (err) {
    console.error("sample-report-pdf failed:", err);
    res.status(500).json({ error: "Failed to render sample PDF." });
  }
}
