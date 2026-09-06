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
      "Three of PulseCRM's five direct competitors shipped AI-generated deal summaries or next-best-action recommendations this month, moving predictive guidance from a differentiator to a baseline expectation. Meanwhile, HubSpot's mid-market pricing restructure (effectively a 12–18% increase for teams above 10 seats) is the first pricing move in this segment in over a year and is already showing up in win-loss notes as a stated reason prospects are re-shopping.",
    emergingThemes:
      "Two converging themes: (1) 'agentic' CRM workflows — competitors framing AI features around autonomous task execution (drafting follow-ups, updating fields, scheduling) rather than passive suggestions, and (2) usage-based and hybrid pricing experiments aimed at unseating per-seat pricing as the default mental model for CRM cost.",
    biggestThreats:
      "Attio's expansion from founder-led sales into a dedicated mid-market motion (new SDR-focused onboarding flow, first outbound-focused case studies) directly targets PulseCRM's core ICP and is backed by a recently disclosed $28M raise earmarked for GTM. Close's aggressive migration-assistance push, offering white-glove data migration free for teams switching from legacy CRMs, is also pulling directly from the same switcher pool PulseCRM has historically won.",
    biggestOpportunities:
      "HubSpot's price increase creates a 60–90 day window where mid-market teams are actively price-shopping — a switcher campaign timed now, with a transparent pricing comparison and a migration guarantee, has unusually high leverage. There is also a clear, unclaimed position around 'AI you can audit': every competitor's AI messaging leans on autonomy and speed, and none address the growing sales-ops concern about AI writing to customers unsupervised — a trust-and-control narrative is open.",
  },
  competitors: [
    {
      name: "HubSpot Sales Hub",
      category: "Direct",
      whyItMatters:
        "The default choice for marketing-led mid-market teams and the most common competitor named in PulseCRM's own lost-deal notes; its ecosystem breadth (marketing, CMS, service) makes it sticky once adopted.",
      differentiator: "Deep native integration across HubSpot's full marketing/CMS/service suite.",
      strength: "Brand trust and an enormous partner/integration ecosystem lower switching anxiety for buyers.",
      weakness: "Pricing complexity and seat-based scaling are the most frequently cited objections in competitive deals.",
    },
    {
      name: "Salesforce Sales Cloud",
      category: "Direct",
      whyItMatters:
        "The enterprise anchor competitors get compared against even in mid-market deals; sets the ceiling for 'what a CRM can eventually do,' which shapes buyer expectations even when Salesforce itself isn't a realistic option.",
      differentiator: "Unmatched customization depth and a certified admin/consultant ecosystem.",
      strength: "Perceived as the 'safe' enterprise-grade choice by procurement and IT stakeholders.",
      weakness: "Implementation time and cost are consistently cited as the top reason mid-market teams look elsewhere.",
    },
    {
      name: "Pipedrive",
      category: "Direct",
      whyItMatters:
        "The closest competitor on simplicity positioning; frequently the second tool evaluated alongside PulseCRM by teams who explicitly want to avoid Salesforce/HubSpot complexity.",
      differentiator: "Visual pipeline-first UX that sales reps consistently rate as the easiest to adopt with no training.",
      strength: "Fast time-to-value — teams report being fully onboarded within days, not weeks.",
      weakness: "Weaker native reporting and forecasting depth once teams pass ~25 reps.",
    },
    {
      name: "Close",
      category: "Direct",
      whyItMatters:
        "Purpose-built for inside-sales teams that call and email at volume, which overlaps heavily with PulseCRM's SMB-to-mid-market sales-led segment.",
      differentiator: "Built-in calling and SMS as first-class objects, not bolted-on integrations.",
      strength: "Power-user efficiency features (multi-line dialing, saved sequences) are best-in-class for high-volume outbound teams.",
      weakness: "Limited customization for teams with non-standard sales processes or complex approval workflows.",

    },
    {
      name: "Attio",
      category: "Direct",
      whyItMatters:
        "The fastest-growing named competitor in the last two quarters of PulseCRM's own deal notes; its recent enterprise fundraise and new SDR-focused onboarding signal a deliberate move up-market into PulseCRM's exact ICP.",
      differentiator: "Fully flexible, spreadsheet-like data model that lets teams define their own objects without engineering help.",
      strength: "Extremely strong word-of-mouth among modern, technical GTM teams and a design quality competitors are visibly copying.",
      weakness: "Newer AI features are still catching up in depth compared to incumbents with years of usage data.",
    },
    {
      name: "Notion (CRM templates + Notion AI)",
      category: "Indirect",
      whyItMatters:
        "Increasingly the default 'good enough' CRM for early-stage and lean sales teams who haven't yet felt pain from a dedicated tool — a real source of delayed CRM purchases.",
      differentiator: "Zero incremental cost for teams already paying for Notion company-wide.",
      strength: "Total flexibility and familiarity — no new tool to learn for teams already living in Notion daily.",
      weakness: "No native email/calendar sync, calling, or pipeline automation without third-party connectors.",
    },
    {
      name: "Airtable",
      category: "Indirect",
      whyItMatters:
        "Common landing spot for ops-minded founders building a custom pipeline tracker before 'graduating' to a dedicated CRM — a source of both delayed purchases and, eventually, switcher opportunity.",
      differentiator: "Database-grade flexibility with a much gentler learning curve than a full CRM.",
      strength: "Popular with ops and RevOps personas who want full control over data structure.",
      weakness: "No purpose-built sales workflows (sequences, forecasting, activity capture) without significant manual setup.",
    },
    {
      name: "Google Sheets + Apps Script",
      category: "Indirect",
      whyItMatters:
        "Still the actual starting point for a meaningful share of very early-stage teams; represents the 'do nothing' competitor that PulseCRM's own sales team encounters in first calls.",
      differentiator: "Free, infinitely flexible, and requires no procurement process.",
      strength: "Zero cost and zero onboarding friction.",
      weakness: "Breaks down entirely past a handful of reps — no automation, no activity tracking, no reporting integrity.",
    },
    {
      name: "Folk",
      category: "Emerging",
      whyItMatters:
        "A newer, well-funded entrant explicitly targeting the 'anti-Salesforce' positioning PulseCRM has historically owned — worth watching closely even though deal overlap is currently low.",
      differentiator: "Relationship-graph framing (people and companies as the core object, not just deals).",
      strength: "Strong design sensibility and growing traction with agencies and services businesses.",
      weakness: "Limited sales-specific reporting; not yet positioned for high-volume outbound teams.",
    },
    {
      name: "Clay",
      category: "Emerging",
      whyItMatters:
        "Not a CRM, but increasingly sits upstream of the CRM in GTM workflows (enrichment, list-building, AI-personalized outbound), which changes how — and whether — some prospects think they need a traditional CRM at all.",
      differentiator: "AI-driven data enrichment and outbound personalization at a granularity no CRM natively offers.",
      strength: "Viral adoption among modern RevOps teams and deep integration ecosystem via Zapier/native connectors.",
      weakness: "Not a system of record — teams still need a CRM downstream, which keeps it complementary rather than substitutive for now.",
    },
  ],
  featureMovement: [
    {
      competitor: "HubSpot",
      whatChanged:
        "Restructured Sales Hub Professional pricing, effectively raising cost 12–18% for teams above 10 seats, and bundled AI deal-summary features into the higher tier only.",
      whyItMatters:
        "This is the first pricing move from a major incumbent in over a year and is already surfacing as a stated re-shopping reason in win-loss interviews — a real-time window for a switcher campaign.",
    },
    {
      competitor: "Attio",
      whatChanged:
        "Launched a dedicated SDR onboarding flow and published its first two outbound-motion case studies, following a disclosed $28M raise earmarked for go-to-market expansion.",
      whyItMatters:
        "Signals a deliberate move from founder-led/technical-team adoption into PulseCRM's exact mid-market sales-led ICP — the clearest single threat this period.",
    },
    {
      competitor: "Close",
      whatChanged:
        "Introduced free white-glove data migration for teams switching from Salesforce, HubSpot, or Pipedrive, removing the single biggest friction point in a CRM switch.",
      whyItMatters:
        "Directly targets the same switcher pool PulseCRM has historically won on ease-of-migration messaging — reduces PulseCRM's relative advantage there.",
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
      "The category is visibly consolidating around two positioning axes: 'AI-agentic' (Salesforce, HubSpot, increasingly Pipedrive) versus 'radically simple/flexible' (Attio, Folk, Airtable-adjacent tools). Pure ease-of-use without an AI story is becoming a harder position to defend on its own — buyers now expect both simplicity and intelligence, not a tradeoff between them.",
    customerBehaviorShifts:
      "Win-loss interviews this period show a measurable shift: 'we want AI that drafts and suggests' has been the majority ask for over a year, but a new and growing minority (roughly a fifth of interviews) now explicitly ask about approval steps and audit trails before letting AI touch customer-facing communication — a nascent trust concern that no competitor is addressing head-on yet.",
    aiTrends:
      "Every direct competitor now ships at least one 'AI drafts your next message' feature; the differentiation frontier has moved to autonomy (does it just suggest, or does it act) and control (can a manager review, approve, or roll back AI actions). Salesforce is currently furthest on autonomy; no competitor has yet made control and auditability a headline feature.",
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
      "Interview 3–5 recent Attio-considered prospects to understand exactly which SDR-onboarding or outbound features tipped their evaluation.",
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
      "Defensive: Attio comparison page and updated sales battlecard (low effort, high urgency given Attio's disclosed GTM investment).",
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
