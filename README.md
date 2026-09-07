# ScoutAI

ScoutAI is a competitive intelligence tool for Product Managers. Tell it about
your product, and it actually browses the web — competitor websites,
TechCrunch, industry news — to research and write a full report: who you're
up against, what they've shipped recently, where the market's heading, and
what to do next. No manual searching, no stitching together screenshots.

There's a live demo at `/demo` with zero setup. To generate a *real* report
on your own product, you need your own Anthropic API key — this project has
no shared backend, so every person who runs it pays for their own usage.
That's what this README walks you through.

## Run it yourself

You'll need [Node.js](https://nodejs.org) 18 or later and an Anthropic API
key (get one at [console.anthropic.com](https://console.anthropic.com) —
sign up, add billing, then create a key under **API Keys**).

**1. Clone the repo**

```bash
git clone https://github.com/ReshmikaD/competitive-intelligence-agent.git
cd competitive-intelligence-agent
```

**2. Install dependencies**

```bash
npm install
```

**3. Add your API key**

Copy the example env file, then paste your key in:

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:

```
ANTHROPIC_API_KEY=your-key-here
```

That's the only thing required to generate real reports. Everything else in
`.env.example` is optional (see below).

**4. Run it**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), go to **Run Your Own
Analysis**, and try it on your own product.

## Optional: login and saved reports

By default, anyone can generate a report — no account needed. If you also
want sign-in and a dashboard of past reports, add a free
[Upstash](https://upstash.com) Redis database and fill in the remaining
variables in `.env.local`:

```
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
SESSION_SECRET=       # generate with: openssl rand -hex 32
```

Without these, `/login` and `/account` just show a friendly "not configured"
message — the core report-generation flow works fully without them.

## How it works

- **Research**: Claude is given real `web_search` and `web_fetch` tools and
  told to actually visit each competitor's site plus TechCrunch and industry
  sources — not rely on what it already knows.
- **Structuring**: a second call converts that research into a strict format,
  so the report and PDF export always render correctly.
- **PDF export**: every report can be saved as a PDF, rendered server-side.

Real research takes 30-90 seconds, more with several competitors named. If
you deploy to Vercel, note that `maxDuration` is set to 300 seconds, which
needs a Pro plan — the Hobby plan clamps this to 60 seconds, which may not be
enough time for larger requests.

## Deploying your own copy

1. Fork or clone this repo and push it to your own GitHub account.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. In Project Settings → Environment Variables, add `ANTHROPIC_API_KEY` (and
   the optional Upstash/session variables if you want login).
4. Deploy.

## Project structure

```
app/
  page.tsx                Landing page
  login/, signup/          Instant sign-in / account creation (optional)
  account/                 Saved report dashboard (optional, session-gated)
  create/                  The main workflow: 4-field form → report
  demo/                    Fixed sample report, no API key needed
  api/generate-report/     Runs the research + structuring pipeline
components/
  create/                  The analysis form and loading state
  report/                  Report view, charts, sections
lib/
  anthropic.ts             Research + structured extraction logic
  pdf.tsx                  PDF layout
  auth.ts, store.ts        Optional login + report history
  sampleReport.ts          Fixed data behind /demo
  types.ts                 Shared TypeScript types
```

## License

MIT — see [LICENSE](./LICENSE). Use it, modify it, ship your own version.
