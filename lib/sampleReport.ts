import type { CompetitiveReport } from "./types";

/**
 * A fixed, hand-written sample report for "PulseCRM" — a fictional
 * mid-market CRM product. This is what /demo renders. It is NOT generated
 * by Claude; it exists so visitors can see the depth of a real report
 * before connecting their own API key.
 */
export const sampleReport: CompetitiveReport = {
  productName: "PulseCRM",
  industry: "B2B SaaS, CRM & Sales Engagement",
  reportPeriod: "Last 30 days · Jul 12 – Aug 11, 2026",
  executiveSummary: {
    biggestMarketChanges:
      "AI-generated deal summaries just became table stakes. Three of PulseCRM's five direct competitors shipped this feature in the last month alone, so what used to set a product apart is now just the baseline buyers expect. On top of that, HubSpot raised mid-market prices 12–18% for teams above 10 seats — its first price move in over a year — and it's already showing up in win-loss notes as a reason prospects are shopping around.",
    emergingThemes:
      "Two shifts are converging right now. First, competitors are moving from AI that suggests to AI that acts on its own — drafting follow-ups, updating fields, scheduling — without waiting for a person to approve each step. Second, several are testing usage-based or hybrid pricing to challenge the standard \"pay per seat\" model.",
    biggestThreats:
      "Attio is moving up-market straight into PulseCRM's lane. It launched a dedicated onboarding flow for outbound sales teams and published its first case studies aimed at that audience, backed by a newly disclosed $28M raise earmarked for growth. Close is also cutting into PulseCRM's territory, offering free white-glove data migration to any team switching off a legacy CRM — the exact switcher audience PulseCRM has historically won.",
    biggestOpportunities:
      "HubSpot's price hike opens a 60–90 day window where mid-market teams are actively shopping for alternatives. A switcher campaign right now — clear pricing comparison, a migration guarantee — has unusually strong odds of landing. There's also an open position nobody has claimed: \"AI you can audit.\" Every competitor is selling AI on speed and autonomy, and none address the growing concern from sales leaders about AI messaging customers unsupervised.",
  },
  competitors: [
    {
      name: "HubSpot Sales Hub",
      category: "Direct",
      whyItMatters:
        "The competitor PulseCRM loses to most often. It's the default choice for marketing-led mid-market teams, and its broad suite (marketing, website, service tools) makes it hard to unseat once a team has adopted it.",
      differentiator: "Deep native integration across HubSpot's full marketing/CMS/service suite.",
      strength: "Brand trust and an enormous partner/integration ecosystem lower switching anxiety for buyers.",
      weakness: "Pricing complexity and seat-based scaling are the most frequently cited objections in competitive deals.",
    },
    {
      name: "Salesforce Sales Cloud",
      category: "Direct",
      whyItMatters:
        "Sets the ceiling for what buyers expect a CRM to eventually do, even when they'd never actually buy it. It's the enterprise benchmark competitors get measured against, even in mid-market deals where Salesforce itself isn't realistic.",
      differentiator: "Unmatched customization depth and a certified admin/consultant ecosystem.",
      strength: "Perceived as the 'safe' enterprise-grade choice by procurement and IT stakeholders.",
      weakness: "Implementation time and cost are consistently cited as the top reason mid-market teams look elsewhere.",
    },
    {
      name: "Pipedrive",
      category: "Direct",
      whyItMatters:
        "PulseCRM's closest rival on ease of use. It's the second tool most often evaluated alongside PulseCRM by teams who specifically want to avoid Salesforce or HubSpot's complexity.",
      differentiator: "Visual pipeline-first UX that sales reps consistently rate as the easiest to adopt with no training.",
      strength: "Fast time-to-value — teams report being fully onboarded within days, not weeks.",
      weakness: "Weaker native reporting and forecasting depth once teams pass ~25 reps.",
    },
    {
      name: "Close",
      category: "Direct",
      whyItMatters:
        "Built specifically for teams that call and email at high volume — which is a lot of PulseCRM's own customer base. That overlap makes every Close deal worth watching closely.",
      differentiator: "Built-in calling and SMS as first-class objects, not bolted-on integrations.",
      strength: "Power-user efficiency features (multi-line dialing, saved sequences) are best-in-class for high-volume outbound teams.",
      weakness: "Limited customization for teams with non-standard sales processes or complex approval workflows.",

    },
    {
      name: "Attio",
      category: "Direct",
      whyItMatters:
        "The fastest-growing competitor showing up in PulseCRM's deal notes. Its new fundraise and new onboarding flow for outbound sales teams both point to a deliberate push into PulseCRM's exact customer base.",
      differentiator: "Fully flexible, spreadsheet-like data model that lets teams define their own objects without engineering help.",
      strength: "Extremely strong word-of-mouth among modern, technical sales teams and a design quality competitors are visibly copying.",
      weakness: "Newer AI features are still catching up in depth compared to incumbents with years of usage data.",
    },
    {
      name: "Notion (CRM templates + Notion AI)",
      category: "Indirect",
      whyItMatters:
        "The \"good enough\" default for lean teams who haven't felt real pain yet. It's a genuine source of delayed CRM purchases, not a serious head-to-head competitor.",
      differentiator: "Zero incremental cost for teams already paying for Notion company-wide.",
      strength: "Total flexibility and familiarity — no new tool to learn for teams already living in Notion daily.",
      weakness: "No native email/calendar sync, calling, or pipeline automation without third-party connectors.",
    },
    {
      name: "Airtable",
      category: "Indirect",
      whyItMatters:
        "A common stopgap for ops-minded founders building their own pipeline tracker before they're ready for a real CRM. It delays purchases now, but often becomes a switcher opportunity later.",
      differentiator: "Database-grade flexibility with a much gentler learning curve than a full CRM.",
      strength: "Popular with operations teams who want full control over how their data is structured.",
      weakness: "No purpose-built sales workflows (sequences, forecasting, activity capture) without significant manual setup.",
    },
    {
      name: "Google Sheets + Apps Script",
      category: "Indirect",
      whyItMatters:
        "The real starting point for a lot of very early-stage teams. It's the \"do nothing\" competitor — the one PulseCRM's own sales team runs into on first calls, not on a comparison chart.",
      differentiator: "Free, infinitely flexible, and requires no procurement process.",
      strength: "Zero cost and zero onboarding friction.",
      weakness: "Breaks down entirely past a handful of reps — no automation, no activity tracking, no reporting integrity.",
    },
    {
      name: "Folk",
      category: "Emerging",
      whyItMatters:
        "A newer, well-funded rival claiming the same \"anti-Salesforce, simple by design\" territory PulseCRM has owned. Deal overlap is low today, but worth watching closely.",
      differentiator: "Relationship-graph framing (people and companies as the core object, not just deals).",
      strength: "Strong design sensibility and growing traction with agencies and services businesses.",
      weakness: "Limited sales-specific reporting; not yet positioned for high-volume outbound teams.",
    },
    {
      name: "Clay",
      category: "Emerging",
      whyItMatters:
        "Not a CRM, but it now sits upstream of one — handling data enrichment, list-building, and AI-personalized outreach. That's starting to change whether some prospects think they need a traditional CRM at all.",
      differentiator: "AI-driven data enrichment and outbound personalization at a granularity no CRM natively offers.",
      strength: "Viral adoption among modern sales-operations teams and a deep integration ecosystem via Zapier and native connectors.",
      weakness: "Not a system of record — teams still need a CRM downstream, which keeps it complementary rather than substitutive for now.",
    },
  ],
  featureMovement: [
    {
      competitor: "HubSpot",
      whatChanged:
        "Restructured Sales Hub Professional pricing, effectively raising cost 12–18% for teams above 10 seats, and bundled AI deal-summary features into the higher tier only.",
      whyItMatters:
        "This is the first price increase from a major player in over a year. It's already coming up in win-loss interviews as a reason prospects are shopping around — a real-time window for a switcher campaign.",
    },
    {
      competitor: "Attio",
      whatChanged:
        "Launched a dedicated onboarding flow for outbound sales teams and published its first two case studies for that use case, following a disclosed $28M raise earmarked for growth.",
      whyItMatters:
        "Attio is deliberately moving from technical early adopters into PulseCRM's exact mid-market customer base. This is the single clearest threat this period.",
    },
    {
      competitor: "Close",
      whatChanged:
        "Introduced free white-glove data migration for teams switching from Salesforce, HubSpot, or Pipedrive, removing the single biggest friction point in a CRM switch.",
      whyItMatters:
        "This goes after the exact switcher audience PulseCRM has historically won with easy-migration messaging — and it erodes that advantage.",
    },
    {
      competitor: "Pipedrive",
      whatChanged:
        "Shipped an AI 'next best action' panel that surfaces a ranked daily task list per rep, generated from pipeline and activity data.",
      whyItMatters:
        "Moves AI-driven prioritization from a nice-to-have to table stakes among simplicity-positioned competitors — closes a gap that used to favor PulseCRM.",
    },
    {
      competitor: "Salesforce",
      whatChanged:
        "Expanded Einstein Copilot's autonomous actions to include auto-drafting and, with approval, auto-sending follow-up emails on stalled deals.",
      whyItMatters:
        "Pushes the 'agentic AI' narrative further than any competitor so far and will likely reset buyer expectations for what 'AI-native' means across the category, not just at the enterprise tier.",
    },
    {
      competitor: "Folk",
      whatChanged:
        "Added native LinkedIn activity sync, letting relationship data update automatically from LinkedIn interactions without manual logging.",
      whyItMatters:
        "A small feature, but one aimed squarely at the manual-data-entry pain point that is consistently PulseCRM's own top usability complaint in support tickets.",
    },
    {
      competitor: "Clay",
      whatChanged:
        "Released a CRM-write-back integration that pushes enriched lead data directly into HubSpot, Salesforce, and Pipedrive records automatically.",
      whyItMatters:
        "Deepens Clay's position upstream of the CRM and, notably, does not yet support PulseCRM as a write-back destination — a gap worth closing before it becomes a switching reason.",
    },
  ],
  marketTrends: {
    industryTrends:
      "The market is splitting into two camps: \"AI does it for you\" (Salesforce, HubSpot, increasingly Pipedrive) versus \"radically simple and flexible\" (Attio, Folk, and similar tools). Being just easy to use, without an AI story, is getting harder to sell on its own — buyers now expect both.",
    customerBehaviorShifts:
      "\"We want AI that drafts and suggests\" has been the top ask for over a year. But a growing minority — roughly one in five conversations now — are asking for approval steps and audit trails before AI touches anything customer-facing. That's a new trust concern nobody is addressing yet.",
    aiTrends:
      "Every direct competitor now ships some version of \"AI drafts your next message.\" The real competition has moved to two questions: does the AI just suggest, or does it act on its own, and can a manager review or undo what it does? Salesforce is furthest ahead on autonomy; nobody has yet made oversight and control their headline feature.",
  },
  opportunityRadar: [
    {
      rank: 1,
      opportunity:
        "Launch a time-boxed HubSpot-switcher campaign: transparent pricing comparison, migration guarantee, and a 'lock your old price for 12 months' offer aimed at teams reacting to the recent increase.",
      customerImpact: "High",
      competitiveUrgency: "High",
      implementationEffort: "Low",
    },
    {
      rank: 2,
      opportunity:
        "Build an 'AI with an audit trail' feature set — every AI-drafted or AI-sent action logged, reversible, and attributable to a specific model action, marketed explicitly against competitors' unsupervised-autonomy messaging.",
      customerImpact: "High",
      competitiveUrgency: "Medium",
      implementationEffort: "Medium",
    },
    {
      rank: 3,
      opportunity:
        "Ship native LinkedIn activity sync to close the manual-data-entry gap Folk just addressed and that remains PulseCRM's top usability complaint.",
      customerImpact: "Medium",
      competitiveUrgency: "Medium",
      implementationEffort: "Medium",
    },
    {
      rank: 4,
      opportunity:
        "Publish a dedicated 'PulseCRM vs. Attio' comparison and sales battlecard before Attio's mid-market push gains more coverage — control the narrative early rather than reactively.",
      customerImpact: "Medium",
      competitiveUrgency: "High",
      implementationEffort: "Low",
    },
    {
      rank: 5,
      opportunity:
        "Add a Clay write-back integration so enrichment data flows automatically into PulseCRM, matching the destinations Clay already supports and removing a reason technical teams might delay adoption.",
      customerImpact: "Medium",
      competitiveUrgency: "Low",
      implementationEffort: "Medium",
    },
    {
      rank: 6,
      opportunity:
        "Introduce an optional usage-based add-on tier (e.g., AI actions or enrichment credits) to test appetite for hybrid pricing ahead of any category-wide shift away from pure per-seat pricing.",
      customerImpact: "Low",
      competitiveUrgency: "Low",
      implementationEffort: "High",
    },
  ],
  recommendedActions: {
    investigateNext: [
      "Pull the last 90 days of closed-lost deals where HubSpot was the alternative and check how many cite price as a factor — size the switcher campaign's addressable pool before building it.",
      "Interview 3–5 recent prospects who considered Attio to understand exactly which onboarding or outbound features tipped their evaluation.",
      "Audit current AI features for what an 'audit trail' add-on would actually require at the data-model level before committing engineering time.",
    ],
    customerConversations: [
      "Ask existing customers directly whether they'd want approval/review steps before AI sends customer-facing messages — validate the trust-and-control opportunity isn't team-specific.",
      "Ask churned customers who moved to Close specifically why the free migration offer mattered, to confirm migration friction (not just price) was the deciding factor.",
      "Survey power users on manual data-entry pain points to prioritize LinkedIn sync against other automation requests already in the backlog.",
    ],
    roadmapOpportunities: [
      "Fast-follow: LinkedIn activity sync (addresses a validated, longstanding usability complaint with a scoped, medium-effort build).",
      "Differentiated bet: AI action audit trail and approval workflow (no competitor owns this position yet; aligns with an emerging, currently under-served buyer concern).",
      "Defensive: Attio comparison page and updated sales battlecard (low effort, high urgency given Attio's disclosed growth-fund investment).",
    ],
  },
  sources: [
    { title: "hubspot.com/pricing", url: "https://www.hubspot.com/pricing/sales" },
    { title: "attio.com/blog", url: "https://attio.com/blog" },
    { title: "close.com — Switch to Close", url: "https://close.com/switch/" },
    { title: "pipedrive.com/en/newsroom", url: "https://www.pipedrive.com/en/newsroom" },
    { title: "salesforce.com — Einstein Copilot", url: "https://www.salesforce.com/einstein/" },
    { title: "folk.app/changelog", url: "https://www.folk.app/changelog" },
    { title: "clay.com/blog", url: "https://www.clay.com/blog" },
    {
      title: "TechCrunch — CRM & GTM coverage",
      url: "https://techcrunch.com/tag/crm/",
      note: "Searched for recent funding, launch, and pricing coverage across tracked competitors.",
    },
  ],
  generatedAt: new Date().toISOString(),
};
