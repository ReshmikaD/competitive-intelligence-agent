import { NextRequest, NextResponse } from "next/server";
import { resolveUnsubscribeToken } from "@/lib/auth";
import { removeSubscription } from "@/lib/store";

export const runtime = "nodejs";

function page(title: string, body: string) {
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>${title}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#FAFAFA;color:#111114;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0;padding:24px;}
  .card{max-width:420px;background:#fff;border:1px solid #E8E8EC;border-radius:20px;padding:32px;text-align:center;}
  a{color:#0D9488;}
</style></head>
<body><div class="card">${body}</div></body></html>`;
}

// The one-click unsubscribe link embedded in every emailed report. No
// login required — this is standard practice, and the token itself is
// the credential (long, random, tied to one email + product).
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const target = token ? await resolveUnsubscribeToken(token) : null;

  if (!target) {
    return new NextResponse(
      page(
        "Link not found",
        `<h1 style="font-size:18px;">This unsubscribe link isn't valid</h1>
         <p style="color:#6B6B72;font-size:14px;">It may have already been used, or the deployment's data store was reset. If you're still receiving emails you don't want, reply to one directly.</p>`
      ),
      { status: 404, headers: { "Content-Type": "text/html" } }
    );
  }

  await removeSubscription(target.email, target.productName);

  return new NextResponse(
    page(
      "Unsubscribed",
      `<h1 style="font-size:18px;">You're unsubscribed</h1>
       <p style="color:#6B6B72;font-size:14px;">You won't receive monthly ${target.productName} reports at ${target.email} anymore.</p>
       <p style="margin-top:16px;font-size:13px;"><a href="/account">Manage all your reports →</a></p>`
    ),
    { status: 200, headers: { "Content-Type": "text/html" } }
  );
}
