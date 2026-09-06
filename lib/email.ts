import nodemailer from "nodemailer";
import type { CompetitiveReport } from "./types";

// Sends via Gmail SMTP using an App Password, so "email me the report"
// goes out from (and can land back in) a real Gmail inbox with no
// third-party email service required. See .env.example for setup.

function getTransport() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    throw new Error(
      "GMAIL_USER / GMAIL_APP_PASSWORD are not set. Add them to your environment variables (see .env.example)."
    );
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

/** Verify SMTP credentials work without sending an actual email — used by
 *  /api/debug/email-check so you can confirm Gmail is configured right
 *  right after deploying, instead of finding out the hard way a month
 *  from now when the cron job tries to send and fails. */
export async function verifyEmailTransport(): Promise<void> {
  const transport = getTransport();
  await transport.verify();
}

// Gmail (and SMTP generally) occasionally hiccups on a single send — a
// dropped connection, a momentary rate limit. One retry after a short
// pause turns most of those into a non-event instead of a failed
// "email this report" click or a missed monthly delivery.
async function sendMailWithRetry(
  transport: ReturnType<typeof getTransport>,
  message: Parameters<ReturnType<typeof getTransport>["sendMail"]>[0]
): Promise<void> {
  try {
    await transport.sendMail(message);
  } catch (err) {
    console.error("Email send failed, retrying once:", err);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await transport.sendMail(message);
  }
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function levelColor(level: string) {
  if (level === "High") return "#E34D4D";
  if (level === "Medium") return "#DD9A2B";
  return "#1FA37A";
}

export function renderReportEmailHtml(
  report: CompetitiveReport,
  opts?: {
    subscribed?: boolean;
    hasPdfAttachment?: boolean;
    manageUrl?: string;
    unsubscribeUrl?: string;
  }
): string {
  const competitorRows = report.competitors
    .map(
      (c) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #EEE;font-weight:600;">${esc(c.name)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #EEE;color:#6B6B72;">${esc(c.category)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #EEE;color:#333;">${esc(c.whyItMatters)}</td>
      </tr>`
    )
    .join("");

  const opportunityRows = report.opportunityRadar
    .sort((a, b) => a.rank - b.rank)
    .map(
      (o) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #EEE;font-weight:600;">#${o.rank}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #EEE;">${esc(o.opportunity)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #EEE;color:${levelColor(o.customerImpact)};">${o.customerImpact}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #EEE;color:${levelColor(o.competitiveUrgency)};">${o.competitiveUrgency}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #EEE;">${o.implementationEffort}</td>
      </tr>`
    )
    .join("");

  const actionList = (items: string[]) =>
    items.map((i) => `<li style="margin-bottom:6px;color:#333;">${esc(i)}</li>`).join("");

  return `
  <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:640px;margin:0 auto;color:#111;">
    <div style="background:#111114;padding:24px 28px;border-radius:12px 12px 0 0;">
      <p style="color:#fff;font-size:12px;letter-spacing:0.04em;text-transform:uppercase;margin:0 0 6px;opacity:0.6;">Competitive Intelligence Agent</p>
      <h1 style="color:#fff;font-size:22px;margin:0;">${esc(report.productName)} — ${esc(report.reportPeriod)}</h1>
    </div>

    <div style="border:1px solid #EEE;border-top:none;padding:28px;border-radius:0 0 12px 12px;">
      ${
        opts?.hasPdfAttachment
          ? `<p style="margin:0 0 20px;padding:10px 14px;background:#FAFAFA;border:1px solid #E8E8EC;border-radius:8px;font-size:13px;color:#333;">📎 Your full report is attached as a PDF — open it to view the complete, formatted version.</p>`
          : ""
      }
      ${
        opts?.subscribed
          ? `<p style="margin:0 0 20px;padding:10px 14px;background:#E1F5F3;border-radius:8px;font-size:13px;color:#0F766E;">You're subscribed — a fresh version of this report, based on the latest 30 days of competitor activity, will land in this inbox automatically every month.</p>`
          : ""
      }
      <h2 style="font-size:15px;text-transform:uppercase;letter-spacing:0.04em;color:#0D9488;margin:0 0 12px;">Executive Summary</h2>
      <p style="margin:0 0 10px;line-height:1.6;"><strong>Biggest market changes:</strong> ${esc(report.executiveSummary.biggestMarketChanges)}</p>
      <p style="margin:0 0 10px;line-height:1.6;"><strong>Emerging themes:</strong> ${esc(report.executiveSummary.emergingThemes)}</p>
      <p style="margin:0 0 10px;line-height:1.6;"><strong>Biggest threats:</strong> ${esc(report.executiveSummary.biggestThreats)}</p>
      <p style="margin:0 0 24px;line-height:1.6;"><strong>Biggest opportunities:</strong> ${esc(report.executiveSummary.biggestOpportunities)}</p>

      <h2 style="font-size:15px;text-transform:uppercase;letter-spacing:0.04em;color:#0D9488;margin:0 0 12px;">Competitor Landscape</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:14px;">
        <thead>
          <tr style="text-align:left;background:#FAFAFA;">
            <th style="padding:10px 12px;">Competitor</th>
            <th style="padding:10px 12px;">Category</th>
            <th style="padding:10px 12px;">Why it matters</th>
          </tr>
        </thead>
        <tbody>${competitorRows}</tbody>
      </table>

      <h2 style="font-size:15px;text-transform:uppercase;letter-spacing:0.04em;color:#0D9488;margin:0 0 12px;">Opportunity Radar</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:14px;">
        <thead>
          <tr style="text-align:left;background:#FAFAFA;">
            <th style="padding:10px 12px;">Rank</th>
            <th style="padding:10px 12px;">Opportunity</th>
            <th style="padding:10px 12px;">Impact</th>
            <th style="padding:10px 12px;">Urgency</th>
            <th style="padding:10px 12px;">Effort</th>
          </tr>
        </thead>
        <tbody>${opportunityRows}</tbody>
      </table>

      <h2 style="font-size:15px;text-transform:uppercase;letter-spacing:0.04em;color:#0D9488;margin:0 0 12px;">Recommended Actions</h2>
      <p style="margin:0 0 4px;font-weight:600;">Investigate next</p>
      <ul style="margin:0 0 16px;padding-left:20px;">${actionList(report.recommendedActions.investigateNext)}</ul>
      <p style="margin:0 0 4px;font-weight:600;">Customer conversations</p>
      <ul style="margin:0 0 16px;padding-left:20px;">${actionList(report.recommendedActions.customerConversations)}</ul>
      <p style="margin:0 0 4px;font-weight:600;">Roadmap opportunities</p>
      <ul style="margin:0 0 4px;padding-left:20px;">${actionList(report.recommendedActions.roadmapOpportunities)}</ul>

      <p style="margin-top:28px;font-size:12px;color:#999;">Generated by Competitive Intelligence Agent on ${new Date(report.generatedAt).toLocaleString()}.</p>
      ${
        opts?.manageUrl || opts?.unsubscribeUrl
          ? `<p style="margin-top:8px;font-size:12px;color:#999;">
              ${opts?.manageUrl ? `<a href="${esc(opts.manageUrl)}" style="color:#0D9488;">See all your reports</a>` : ""}
              ${opts?.manageUrl && opts?.unsubscribeUrl ? " &middot; " : ""}
              ${opts?.unsubscribeUrl ? `<a href="${esc(opts.unsubscribeUrl)}" style="color:#999;">Unsubscribe from ${esc(report.productName)} updates</a>` : ""}
            </p>`
          : ""
      }
    </div>
  </div>`;
}

export async function sendReportEmail(
  to: string,
  report: CompetitiveReport,
  opts?: {
    subscribed?: boolean;
    pdfBuffer?: Buffer;
    manageUrl?: string;
    unsubscribeUrl?: string;
  }
): Promise<void> {
  const transport = getTransport();
  const fileName = `${report.productName.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "report"}-competitive-intelligence.pdf`;

  await sendMailWithRetry(transport, {
    from: `"Competitive Intelligence Agent" <${process.env.GMAIL_USER}>`,
    to,
    subject: `Competitive Intelligence Report — ${report.productName} (${report.reportPeriod})`,
    html: renderReportEmailHtml(report, { ...opts, hasPdfAttachment: Boolean(opts?.pdfBuffer) }),
    attachments: opts?.pdfBuffer
      ? [{ filename: fileName, content: opts.pdfBuffer, contentType: "application/pdf" }]
      : undefined,
  });
}

/** The magic-link login email. Deliberately plain — this is a
 *  transactional, time-sensitive message, not a marketing one. */
export async function sendLoginEmail(to: string, loginUrl: string): Promise<void> {
  const transport = getTransport();
  await sendMailWithRetry(transport, {
    from: `"Competitive Intelligence Agent" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Your sign-in link",
    html: `
      <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:480px;margin:0 auto;color:#111;">
        <p style="font-size:15px;line-height:1.6;">Click below to sign in. This link works once and expires in 15 minutes.</p>
        <p style="margin:24px 0;">
          <a href="${esc(loginUrl)}" style="display:inline-block;background:#111114;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">Sign in</a>
        </p>
        <p style="font-size:12px;color:#999;">If you didn't request this, you can safely ignore this email.</p>
      </div>`,
  });
}
