export type Level = "High" | "Medium" | "Low";
export type CompetitorCategory = "Direct" | "Indirect" | "Emerging";

export interface AnalysisInput {
  productName: string;
  productDescription: string;
  industry: string[];
  targetCustomers: string[];
  knownCompetitors: string[];
}

export interface Source {
  title: string;
  url: string;
  note?: string;
}

export interface Competitor {
  name: string;
  category: CompetitorCategory;
  whyItMatters: string;
  differentiator: string;
  strength: string;
  weakness: string;
}

export interface FeatureMovementItem {
  competitor: string;
  whatChanged: string;
  whyItMatters: string;
}

export interface OpportunityItem {
  rank: number;
  opportunity: string;
  customerImpact: Level;
  competitiveUrgency: Level;
  implementationEffort: Level;
}

export interface CompetitiveReport {
  productName: string;
  industry: string;
  reportPeriod: string;
  executiveSummary: {
    biggestMarketChanges: string;
    emergingThemes: string;
    biggestThreats: string;
    biggestOpportunities: string;
  };
  competitors: Competitor[];
  featureMovement: FeatureMovementItem[];
  marketTrends: {
    industryTrends: string;
    customerBehaviorShifts: string;
    aiTrends: string;
  };
  opportunityRadar: OpportunityItem[];
  recommendedActions: {
    investigateNext: string[];
    customerConversations: string[];
    roadmapOpportunities: string[];
  };
  sources: Source[];
  generatedAt: string;
}
