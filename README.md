# Competitive Intelligence Agent

An AI-powered competitive intelligence tool for Product Managers. Give it four
things — your product, its industry, your target customers, and any
competitors you know about — and Claude actually browses the web (competitor
websites, TechCrunch, industry news) to research and return a full report:
competitor landscape, feature movement, market trends, an opportunity radar,
recommended actions, and the exact sources it consulted. The report opens
in a clean, readable in-page view (save it as a PDF whenever you want), and
every report you generate is saved to your own dashboard — log in with your
email and it's all there. Subscribe once and a fresh one lands in your inbox
every month.

There's no shared backend — everyone brings their own Anthropic API key, so
nothing about your product or competitors goes anywhere except your own
Claude account. The sample report at `/demo` works with zero setup so you
can see the real thing before connecting a key. Clone this repo, add your
own key (and optionally Gmail + Upstash for email, login, and monthly
delivery), and deploy it to Vercel under your own account.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- `@anthropic-ai/sdk` — a two-step pipeline per report:
  1. **Research**: Claude is given the `web_search` and `web_fetch` server tools and told to actually visit each named competitor's website plus TechCrunch/industry sources before writing anything.
  2. **Structure**: a second, forced tool-use call converts that research into a strict JSON schema, guaranteeing the frontend and PDF always get a shape they can render.
- `@react-pdf/renderer` — renders the report as a real PDF, server-side, with no headless browser required
- Nodemailer (Gmail SMTP) for report delivery, with the PDF attached
- Upstash Redis (REST API) — optional, powers monthly subscriptions
- Vercel Cron — triggers monthly report regeneration + delivery

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the values below
npm run dev
```

Open `http://localhost:3000`.

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Powers report generation. Get one at [console.anthropic.com](https://console.anthropic.com). |
| `ANTHROPIC_MODEL` | No | Defaults to `claude-sonnet-5`. |
| `GMAIL_USER` | For email | The Gmail address reports are sent from. |
| `GMAIL_APP_PASSWORD` | For email | A 16-character [Gmail App Password](https://support.google.com/accounts/answer/185833) — not your regular password. Requires 2-Step Verification enabled on the account. |
| `UPSTASH_REDIS_REST_URL` | For monthly automation, login, feed | From an [Upstash](https://upstash.com) Redis database (free tier is enough). |
| `UPSTASH_REDIS_REST_TOKEN` | For monthly automation, login, feed | Same Upstash database. |
| `SESSION_SECRET` | For login, feed | Signs session cookies. Generate with `openssl rand -hex 32`. |
| `CRON_SECRET` | For monthly automation | Any random string — verifies that only Vercel Cron can trigger the monthly job. |
| `DEBUG_EMAIL_SECRET` | Optional | Any random string — enables `/api/debug/email-check` to verify Gmail is configured correctly. |

The app degrades gracefully without the optional variables: without Gmail
credentials, the "email this report" button will error; without Upstash and
`SESSION_SECRET`, emailing still works but "subscribe monthly" silently has
no effect, and `/login` and `/account` show a clear "not configured" error
instead of working.

`web_search` and `web_fetch` are Anthropic server-side tools — no extra API
key or setup needed beyond `ANTHROPIC_API_KEY`; Anthropic runs the actual web
requests and returns the results as part of the same API call.

Real web research takes longer than a single model call — typically
30-90 seconds, more with several named competitors. `maxDuration` on the
report-generation routes is set to 300s, which requires a Vercel Pro plan;
on the Hobby plan it's silently clamped to 60s, which may time out on
larger requests.

## Verifying email actually works

Before relying on this for real subscribers, confirm your Gmail credentials
are correct without spamming anyone:

```bash
curl "https://your-app.vercel.app/api/debug/email-check?secret=$DEBUG_EMAIL_SECRET"
# {"ok":true,"message":"Gmail SMTP connection and auth succeeded."}
```

This calls nodemailer's `transporter.verify()` — it opens a connection and
authenticates, but sends nothing. If it fails, the error message tells you
exactly what's wrong (bad credentials, 2-Step Verification not enabled,
etc.) rather than you finding out a month from now when the cron job's send
silently fails.

Once that passes, send yourself a real one end-to-end: run `/create`, enter
your own email, and click **Email this report**. Every send also retries
once automatically if Gmail's SMTP connection drops mid-request, so a single
transient failure won't lose someone's report.

## Login, unsubscribing, and the report feed

Signing in is passwordless — enter an email on `/login`, get a one-time link
sent to that inbox (valid 15 minutes), click it, and you're in. There's no
separate signup: whoever can read a given inbox controls that inbox's
report history, the same trust model as "email me this report" already
uses. This needs `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` and
`SESSION_SECRET` — without them, `/login` shows a clear error instead of a
broken form.

Once signed in, `/account` shows two things:
- **Active subscriptions** — every product you've subscribed to monthly
  reports for, with a one-click unsubscribe.
- **Your Reports** — every report generated with that email address, whether
  or not it was ever emailed — each with a "View PDF" button that re-renders
  the stored data fresh rather than storing the PDF binary itself.

Every emailed report also includes its own one-click unsubscribe link in
the footer (`/api/unsubscribe?token=...`) — this works without logging in
at all, which is both standard practice and a fallback for anyone who'd
rather not create an account just to opt out.

## How monthly delivery actually works

1. On `/create`, checking "Also send me this report automatically every
   month" (or clicking **Email this report** from a generated report) saves
   the report's original inputs to Upstash under the recipient's email,
   alongside the last-sent timestamp.
2. `vercel.json` defines a cron job hitting `/api/cron/monthly-report` on the
   1st of every month.
3. That route lists all active subscriptions, re-runs the full research
   pipeline for each one — explicitly framed around "the last 30 days" of
   competitor activity — renders a fresh PDF, and emails it to each
   subscriber.
4. To test locally without waiting a month:

```bash
curl http://localhost:3000/api/cron/monthly-report \
  -H "Authorization: Bearer $CRON_SECRET"
```

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it in [Vercel](https://vercel.com/new).
3. Add the environment variables above in Project Settings → Environment
   Variables.
4. Deploy. The `crons` entry in `vercel.json` is picked up automatically
   (Vercel Cron requires a Pro plan for schedules more frequent than daily —
   the monthly schedule here works on the free Hobby plan).

## Project structure

```
app/
  page.tsx                    Landing page
  login/page.tsx                Passwordless sign-in form
  account/page.tsx               The report feed + active subscriptions (session-gated)
  create/page.tsx              Interactive workflow: 4-field form → generating → report
  demo/page.tsx                 Renders the fixed sample report in the real ReportView UI
  api/generate-report/          Runs the research + structure pipeline, returns a CompetitiveReport
  api/send-report-email/        Renders the PDF, emails it, auto-subscribes + saves to history
  api/cron/monthly-report/      Vercel Cron target — regenerates, resends, saves to history
  api/auth/request-link/         Emails a one-time login link
  api/auth/verify/                Consumes the login token, sets the session cookie
  api/auth/logout/                Clears the session cookie
  api/account/unsubscribe/        Session-authenticated unsubscribe (used by /account)
  api/unsubscribe/                One-click, no-login unsubscribe (used by email links)
  api/debug/email-check/          Verifies Gmail SMTP credentials without sending anything
pages/api/
  report-pdf.ts                  Renders any CompetitiveReport (POST body) to a PDF, inline
  sample-report-pdf.ts            Renders the fixed sample report to a PDF, inline (GET)
  # These two live under pages/api rather than app/api on purpose — see
  # the comment at the top of report-pdf.ts.
components/
  create/                      AnalysisForm (4 fields + tag inputs), GeneratingState
  report/                      ReportView, ReportNav, EmailReportButton, charts/
  account/                     AccountFeed — the interactive part of /account
lib/
  anthropic.ts                  Research (web_search/web_fetch) + structured extraction
  pdf.tsx                        @react-pdf/renderer PDF layout
  email.ts                      Email HTML rendering + sending, with PDF attachment + retry
  auth.ts                        Login tokens, unsubscribe tokens, signed session cookies
  store.ts                      Upstash-backed subscriptions + report history
  sampleReport.ts                Fixed data behind the /demo sample report
  types.ts                      Shared TypeScript types
```
