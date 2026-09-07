# ScoutAI

An AI-powered competitive intelligence tool for Product Managers. Give it four
things — your product, its industry, your target customers, and any
competitors you know about — and it actually browses the web (competitor
websites, TechCrunch, industry news) to research and return a full report:
competitor landscape, feature movement, market trends, an opportunity radar,
recommended actions, and the exact sources it consulted. The report opens
in a clean, readable in-page view (save it as a PDF whenever you want), and
every report you generate is saved to your own dashboard — sign in with your
email and it's all there.

The sample report at `/demo` works with zero setup so you can see the real
thing before running your own analysis. Nothing ever leaves the app over
email — signing in is instant, and there's no monthly send to configure.

There's no shared backend — every deployment runs on its own Anthropic API
key, so nothing about your product or competitors goes anywhere except your
own account. Clone this repo, add your own key (and optionally Upstash for
login and the report dashboard), and deploy it to Vercel under your own
account.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- `@anthropic-ai/sdk` — a two-step pipeline per report:
  1. **Research**: the model is given the `web_search` and `web_fetch` server tools and told to actually visit each named competitor's website plus TechCrunch/industry sources before writing anything.
  2. **Structure**: a second, forced tool-use call converts that research into a strict JSON schema, guaranteeing the frontend and PDF always get a shape they can render.
- `@react-pdf/renderer` — renders the report as a real PDF, server-side, with no headless browser required
- Upstash Redis (REST API) — optional, powers login and the report dashboard

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
| `UPSTASH_REDIS_REST_URL` | For login, dashboard | From an [Upstash](https://upstash.com) Redis database (free tier is enough). |
| `UPSTASH_REDIS_REST_TOKEN` | For login, dashboard | Same Upstash database. |
| `SESSION_SECRET` | For login, dashboard | Signs session cookies. Generate with `openssl rand -hex 32`. |

The app degrades gracefully without the optional variables: without Upstash
and `SESSION_SECRET`, `/login` and `/account` show a clear "not configured"
error instead of a broken form. Generating a report at `/create` always
works regardless — none of this is required for the core flow.

`web_search` and `web_fetch` are Anthropic server-side tools — no extra API
key or setup needed beyond `ANTHROPIC_API_KEY`; Anthropic runs the actual web
requests and returns the results as part of the same API call.

Real web research takes longer than a single model call — typically
30-90 seconds, more with several named competitors. `maxDuration` on the
report-generation route is set to 300s, which requires a Vercel Pro plan;
on the Hobby plan it's silently clamped to 60s, which may time out on
larger requests.

## Signing in and the report dashboard

Signing in is instant — enter an email on `/login` and you're straight into
that email's session, no verification step, nothing sent or received. This
trades a stronger identity guarantee for a login that never leaves the app;
it's meant for one person's own deployment revisiting their own reports, not
as a security boundary between untrusted users. This needs
`UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` and `SESSION_SECRET` —
without them, `/login` shows a clear error instead of a broken form.

Once signed in, `/account` shows **Your Reports** — every report generated
with that email address, each with a "View PDF" button that re-renders the
stored data fresh rather than storing the PDF binary itself.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it in [Vercel](https://vercel.com/new).
3. Add the environment variables above in Project Settings → Environment
   Variables.
4. Deploy.

## Project structure

```
app/
  page.tsx                    Landing page
  login/page.tsx                Instant sign-in form (no email round trip)
  account/page.tsx               The report dashboard (session-gated)
  create/page.tsx              Interactive workflow: 4-field form → generating → report
  demo/page.tsx                 Renders the fixed sample report in the real ReportView UI
  api/generate-report/          Runs the research + structure pipeline, saves to history
  api/auth/login/                 Creates a session for the entered email, no email sent
  api/auth/logout/                Clears the session cookie
pages/api/
  report-pdf.ts                  Renders any CompetitiveReport (POST body) to a PDF, inline
  sample-report-pdf.ts            Renders the fixed sample report to a PDF, inline (GET)
  # These two live under pages/api rather than app/api on purpose — see
  # the comment at the top of report-pdf.ts.
components/
  create/                      AnalysisForm (4 fields + tag inputs), GeneratingState
  report/                      ReportView, ReportNav, charts/
  account/                     AccountFeed — the interactive part of /account
lib/
  anthropic.ts                  Research (web_search/web_fetch) + structured extraction
  pdf.tsx                        @react-pdf/renderer PDF layout
  auth.ts                        Signed session cookies (no tokens, no email)
  store.ts                      Upstash-backed report history
  sampleReport.ts                Fixed data behind the /demo sample report
  types.ts                      Shared TypeScript types
```
