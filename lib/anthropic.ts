import Anthropic from "@anthropic-ai/sdk";
import type { AnalysisInput, CompetitiveReport, Source } from "./types";

// Model string — update if your account uses a different alias.
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";

const levelEnum = ["High", "Medium", "Low"];

// Strict JSON schema the model must fill in via forced tool use, once real
// research has already happened. This is what guarantees the frontend
// always gets a shape it can render, instead of parsing free-form text.
const REPORT_TOOL = {
  name: "generate_competitive_report",
  description:
    "Return a complete monthly competitive intelligence report for a product manager, structured exactly per the schema, based on the research already gathered.",
  input_schema: {
    type: "object" as const,
    properties: {
      reportPeriod: { type: "string", description: "e.g. 'August 2026'" },
      executiveSummary: {
        type: "object",
        properties: {
          biggestMarketChanges: { type: "string" },
          emergingThemes: { type: "string" },
          biggestThreats: { type: "string" },
          biggestOpportunities: { type: "string" },
        },
        required: [
          "biggestMarketChanges",
          "emergingThemes",
          "biggestThreats",
          "biggestOpportunities",
        ],
      },
      competitors: {
        type: "array",
        minItems: 6,
        maxItems: 10,
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            category: { type: "string", enum: ["Direct", "Indirect", "Emerging"] },
            whyItMatters: { type: "string" },
            differentiator: { type: "string" },
            strength: { type: "string" },
            weakness: { type: "string" },
          },
          required: [
            "name",
            "category",
            "whyItMatters",
            "differentiator",
            "strength",
            "weakness",
          ],
        },
      },
      featureMovement: {
        type: "array",
        minItems: 4,
        items: {
          type: "object",
          properties: {
            competitor: { type: "string" },
            whatChanged: { type: "string" },
            whyItMatters: { type: "string" },
          },
          required: ["competitor", "whatChanged", "whyItMatters"],
        },
      },
      marketTrends: {
        type: "object",
        properties: {
          industryTrends: { type: "string" },
          customerBehaviorShifts: { type: "string" },
          aiTrends: { type: "string" },
        },
        required: ["industryTrends", "customerBehaviorShifts", "aiTrends"],
      },
      opportunityRadar: {
        type: "array",
        minItems: 4,
        maxItems: 6,
        items: {
          type: "object",
          properties: {
            rank: { type: "integer" },
            opportunity: { type: "string" },
            customerImpact: { type: "string", enum: levelEnum },
            competitiveUrgency: { type: "string", enum: levelEnum },
            implementationEffort: { type: "string", enum: levelEnum },
          },
          required: [
            "rank",
            "opportunity",
            "customerImpact",
            "competitiveUrgency",
            "implementationEffort",
          ],
        },
      },
      recommendedActions: {
        type: "object",
        properties: {
          investigateNext: { type: "array", items: { type: "string" } },
          customerConversations: { type: "array", items: { type: "string" } },
          roadmapOpportunities: { type: "array", items: { type: "string" } },
        },
        required: ["investigateNext", "customerConversations", "roadmapOpportunities"],
      },
    },
    required: [
      "reportPeriod",
      "executiveSummary",
      "competitors",
      "featureMovement",
      "marketTrends",
      "opportunityRadar",
      "recommendedActions",
    ],
  },
};

function currentPeriodLabel(): string {
  return new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function buildResearchPrompt(input: AnalysisInput): string {
  const competitorList = input.knownCompetitors.length
    ? input.knownCompetitors.join(", ")
    : "none given — you must discover 6-10 real ones yourself";

  return `You are a competitive intelligence analyst doing real research for a Product Manager, ahead of writing a monthly report. Today's date context: ${currentPeriodLabel()}. Only treat something as "recent" if it plausibly happened in roughly the last 30 days.

THE PRODUCT
- Name: ${input.productName}
- What it does: ${input.productDescription}
- Industry: ${input.industry.join(", ")}
- Target customers: ${input.targetCustomers.join(", ")}
- Competitors the user already knows about: ${competitorList}

YOUR JOB RIGHT NOW is to gather real, current information using the web_search and web_fetch tools you've been given. Do not write the final report yet — this step is pure research. Work through this checklist:

1. For EVERY competitor the user named above, this is mandatory, not optional: web_search for their official website, then web_fetch the homepage and at least one deeper page (pricing, blog, changelog, or "what's new") to see what they're actually saying about themselves and any recent announcements. If a competitor's own newsroom, blog, or changelog surfaces recent posts, fetch those too. Do not rely on general knowledge for a named competitor — go look at their actual site.
2. Search for additional competitors in this space you weren't told about (direct, indirect, and emerging), so the final list covers 6-10 real, named companies.
3. Search TechCrunch and other relevant tech/industry publications (e.g. site:techcrunch.com, plus category-specific outlets relevant to "${input.industry.join(", ")}") for recent news, funding, launches, or analysis touching this product's competitors or market.
4. Search for general market/industry trend coverage relevant to "${input.industry.join(", ")}" and to the target customer segment "${input.targetCustomers.join(", ")}" — pricing shifts, AI feature trends, category consolidation, etc.
5. As you go, keep track of every URL you actually visited or pulled a search result from — you'll need to list them.

After researching, write a thorough research brief in plain text (not the final structured report yet) covering: what each competitor is doing right now and why it matters to this product; any recent feature/pricing/partnership movement with dates where possible; broader market and AI trends; and a ranked list of opportunities for this product given the gaps you found. Be specific and cite where each claim came from (which competitor's site, or which article). This brief will be converted into the final structured report next, so make it detailed and evidence-based — a Product Manager should come away from it able to make real decisions, not read vague generalities.`;
}

function buildExtractionPrompt(input: AnalysisInput, researchBrief: string): string {
  return `Below is a research brief a competitive intelligence analyst just compiled by actually browsing competitor websites, TechCrunch, and other industry sources for "${input.productName}" (${input.productDescription}), an ${input.industry.join(", ")} product targeting ${input.targetCustomers.join(", ")}.

Convert this research into a complete monthly competitive intelligence report by calling the generate_competitive_report tool. Use only what the research brief actually found — do not invent facts that contradict it, but you may reasonably synthesize and structure the information.

Requirements:
- 6-10 real, named competitors across Direct, Indirect, and Emerging categories, each with a "why it matters" tied specifically to ${input.productName}'s audience.
- Feature Movement entries should reflect the specific recent activity the research found, attributed to named competitors, each with a clear "why it matters" for this product.
- Market Trends should synthesize the industry, customer behavior, and AI-specific findings from the brief.
- Opportunity Radar: rank opportunities using Customer Impact, Competitive Urgency, and Implementation Effort (High/Medium/Low), most important first.
- Recommended Actions must be concrete and specific to this product and what the research surfaced — not generic advice.
- Write in a sharp, analytical PM voice — confident, concise, evidence-oriented, no filler.
- This report should be extensive enough that a Product Manager can make real prioritization decisions from it alone.

WRITING STYLE — this is read by a busy Product Manager skimming between meetings, so clarity beats sophistication:
- Every "whyItMatters" / narrative field (executiveSummary entries, each competitor's whyItMatters, featureMovement's whyItMatters, marketTrends entries) must open with ONE short, punchy sentence that states the takeaway in plain language — that first sentence is shown bolded on its own, so it has to stand alone and make sense out of context. Follow it with 1-2 supporting sentences of detail/evidence.
- Avoid unexplained jargon and insider acronyms (e.g. ICP, GTM, SDR, RevOps, TAM, NRR). If a technical or industry term is genuinely necessary, spell it out in plain words the first time ("go-to-market approach" rather than "GTM").
- Prefer short, everyday words over corporate-speak: say "customers switching" not "customer migration patterns," say "cheaper" not "more cost-effective," say "AI features" not "AI-native capabilities."
- Keep sentences short. One idea per sentence. No stacked clauses.
- recommendedActions items should read like a to-do list item a PM could paste straight into a ticket — concrete and specific, not abstract analysis.

RESEARCH BRIEF:
"""
${researchBrief}
"""

Call generate_competitive_report exactly once with the complete report.`;
}

/** Recursively walk the raw Claude response content looking for
 *  {url, title} pairs left behind by web_search / web_fetch tool results,
 *  so the report can cite real sources the model actually visited —
 *  rather than trusting the model to self-report which pages it used. */
function extractSources(content: unknown, seen: Map<string, Source>): void {
  if (!content || typeof content !== "object") return;
  if (Array.isArray(content)) {
    for (const item of content) extractSources(item, seen);
    return;
  }
  const obj = content as Record<string, unknown>;
  const url = typeof obj.url === "string" ? obj.url : undefined;
  if (url && /^https?:\/\//.test(url) && !seen.has(url)) {
    const title =
      (typeof obj.title === "string" && obj.title) ||
      (typeof obj.document_title === "string" && obj.document_title) ||
      new URL(url).hostname.replace(/^www\./, "");
    seen.set(url, { title, url });
  }
  for (const key of Object.keys(obj)) {
    extractSources(obj[key], seen);
  }
}

export async function generateReport(input: AnalysisInput): Promise<CompetitiveReport> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it to your environment variables (see .env.example)."
    );
  }

  const client = new Anthropic({ apiKey });

  // Phase 1: real research. Claude uses web_search + web_fetch (server-side
  // tools — Anthropic runs them and hands the results back in this same
  // call) to actually browse competitor sites, TechCrunch, etc.
  const researchResponse = await client.messages.create({
    model: MODEL,
    max_tokens: 8000,
    tools: [
      { type: "web_search_20250305", name: "web_search", max_uses: 10 },
      {
        type: "web_fetch_20250910",
        name: "web_fetch",
        max_uses: 10,
        citations: { enabled: true },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as any,
    messages: [{ role: "user", content: buildResearchPrompt(input) }],
  });

  const researchBrief = researchResponse.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n\n");

  if (!researchBrief.trim()) {
    throw new Error("Research step returned no findings. Please try again.");
  }

  const sourceMap = new Map<string, Source>();
  extractSources(researchResponse.content, sourceMap);

  // Phase 2: convert the research into the guaranteed JSON shape the UI
  // and PDF renderer expect, via forced tool use.
  const extractionResponse = await client.messages.create({
    model: MODEL,
    max_tokens: 8000,
    tools: [REPORT_TOOL],
    tool_choice: { type: "tool", name: "generate_competitive_report" },
    messages: [{ role: "user", content: buildExtractionPrompt(input, researchBrief) }],
  });

  const toolUse = extractionResponse.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
  );

  if (!toolUse) {
    throw new Error("Claude did not return a structured report. Please try again.");
  }

  const data = toolUse.input as Omit<
    CompetitiveReport,
    "productName" | "industry" | "generatedAt" | "sources"
  >;

  return {
    productName: input.productName,
    industry: input.industry.join(", "),
    generatedAt: new Date().toISOString(),
    sources: Array.from(sourceMap.values()).slice(0, 20),
    ...data,
  };
}
