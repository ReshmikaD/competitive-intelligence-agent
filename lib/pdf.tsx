import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import type { CompetitiveReport, Competitor, Level } from "./types";

const COLORS = {
  ink: "#111114",
  mist: "#6B6B72",
  mistStrong: "#54545C",
  line: "#E8E8EC",
  paper: "#FAFAFA",
  accent: "#0D9488",
  accentSoft: "#E1F5F3",
  high: "#E34D4D",
  med: "#DD9A2B",
  low: "#1FA37A",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 44,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: COLORS.ink,
  },
  coverEyebrow: {
    fontSize: 9,
    color: COLORS.accent,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  coverTitle: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
  },
  coverMeta: {
    fontSize: 11,
    color: COLORS.mist,
    marginBottom: 2,
  },
  sectionEyebrow: {
    fontSize: 8,
    color: COLORS.accent,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
    paddingBottom: 8,
  },
  card: {
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: COLORS.mistStrong,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  cardBody: {
    fontSize: 10,
    lineHeight: 1.5,
    color: COLORS.ink,
  },
  competitorName: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  badge: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#fff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 4,
  },
  groupLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: COLORS.mistStrong,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 10,
    marginBottom: 6,
  },
  row: { flexDirection: "row" },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.ink,
    paddingBottom: 4,
    marginBottom: 4,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: COLORS.mistStrong,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
    paddingVertical: 5,
  },
  tableCell: { fontSize: 9, color: COLORS.ink },
  bulletRow: { flexDirection: "row", marginBottom: 4, paddingRight: 4 },
  bulletDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.accent,
    marginTop: 3.5,
    marginRight: 6,
  },
  bulletText: { fontSize: 9.5, lineHeight: 1.5, flex: 1 },
  sourceRow: { marginBottom: 6 },
  sourceTitle: { fontSize: 9.5, fontFamily: "Helvetica-Bold" },
  sourceUrl: { fontSize: 8.5, color: COLORS.accent },
  sourceNote: { fontSize: 8.5, color: COLORS.mist, marginTop: 1 },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 44,
    right: 44,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: COLORS.mist,
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
    paddingTop: 8,
  },
});

function levelColor(level: Level) {
  return level === "High" ? COLORS.high : level === "Medium" ? COLORS.med : COLORS.low;
}

function LevelChip({ level }: { level: Level }) {
  return (
    <Text style={[styles.badge, { backgroundColor: levelColor(level), alignSelf: "flex-start" }]}>
      {level}
    </Text>
  );
}

function CategoryBadge({ category }: { category: Competitor["category"] }) {
  const color =
    category === "Direct" ? COLORS.high : category === "Indirect" ? COLORS.med : COLORS.accent;
  return (
    <Text style={[styles.badge, { backgroundColor: color, alignSelf: "flex-start" }]}>
      {category}
    </Text>
  );
}

function Footer() {
  return (
    <Text
      style={styles.footer}
      render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
      fixed
    />
  );
}

function ReportDocument({ report }: { report: CompetitiveReport }) {
  const direct = report.competitors.filter((c) => c.category === "Direct");
  const indirect = report.competitors.filter((c) => c.category === "Indirect");
  const emerging = report.competitors.filter((c) => c.category === "Emerging");
  const radar = [...report.opportunityRadar].sort((a, b) => a.rank - b.rank);

  return (
    <Document
      title={`${report.productName} — Competitive Intelligence Report`}
      author="Competitive Intelligence Agent"
    >
      {/* Cover + Executive Summary */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.coverEyebrow}>Competitive Intelligence Report</Text>
        <Text style={styles.coverTitle}>{report.productName}</Text>
        <Text style={styles.coverMeta}>{report.industry}</Text>
        <Text style={styles.coverMeta}>{report.reportPeriod}</Text>
        <Text style={[styles.coverMeta, { marginBottom: 20 }]}>
          Generated {new Date(report.generatedAt).toLocaleDateString()}
        </Text>

        <Text style={styles.sectionTitle}>Executive Summary</Text>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Biggest market changes</Text>
          <Text style={styles.cardBody}>{report.executiveSummary.biggestMarketChanges}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Emerging themes</Text>
          <Text style={styles.cardBody}>{report.executiveSummary.emergingThemes}</Text>
        </View>
        <View style={[styles.card, { borderColor: COLORS.high }]}>
          <Text style={[styles.cardLabel, { color: COLORS.high }]}>Biggest threats</Text>
          <Text style={styles.cardBody}>{report.executiveSummary.biggestThreats}</Text>
        </View>
        <View style={[styles.card, { borderColor: COLORS.low }]}>
          <Text style={[styles.cardLabel, { color: COLORS.low }]}>Biggest opportunities</Text>
          <Text style={styles.cardBody}>{report.executiveSummary.biggestOpportunities}</Text>
        </View>

        <Footer />
      </Page>

      {/* Competitor Landscape */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionEyebrow}>Section 2</Text>
        <Text style={styles.sectionTitle}>Competitor Landscape</Text>

        {([
          ["Direct Competitors", direct],
          ["Indirect Competitors", indirect],
          ["Emerging Players", emerging],
        ] as const).map(([label, items]) =>
          items.length === 0 ? null : (
            <View key={label}>
              <Text style={styles.groupLabel}>
                {label} ({items.length})
              </Text>
              {items.map((c) => (
                <View key={c.name} style={styles.card} wrap={false}>
                  <CategoryBadge category={c.category} />
                  <Text style={styles.competitorName}>{c.name}</Text>
                  <Text style={[styles.cardBody, { marginBottom: 6 }]}>{c.whyItMatters}</Text>
                  <Text style={styles.cardBody}>
                    <Text style={{ fontFamily: "Helvetica-Bold" }}>Differentiator: </Text>
                    {c.differentiator}
                  </Text>
                  <Text style={styles.cardBody}>
                    <Text style={{ fontFamily: "Helvetica-Bold" }}>Strength: </Text>
                    {c.strength}
                  </Text>
                  <Text style={styles.cardBody}>
                    <Text style={{ fontFamily: "Helvetica-Bold" }}>Weakness: </Text>
                    {c.weakness}
                  </Text>
                </View>
              ))}
            </View>
          )
        )}

        <Footer />
      </Page>

      {/* Feature Movement + Market Trends */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionEyebrow}>Section 3</Text>
        <Text style={styles.sectionTitle}>Feature Movement</Text>
        {report.featureMovement.map((f, i) => (
          <View key={i} style={styles.card} wrap={false}>
            <Text style={styles.cardLabel}>{f.competitor}</Text>
            <Text style={[styles.cardBody, { fontFamily: "Helvetica-Bold", marginBottom: 4 }]}>
              {f.whatChanged}
            </Text>
            <Text style={styles.cardBody}>{f.whyItMatters}</Text>
          </View>
        ))}

        <Text style={[styles.sectionEyebrow, { marginTop: 16 }]}>Section 4</Text>
        <Text style={styles.sectionTitle}>Market Trends</Text>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Industry trends</Text>
          <Text style={styles.cardBody}>{report.marketTrends.industryTrends}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Customer behavior shifts</Text>
          <Text style={styles.cardBody}>{report.marketTrends.customerBehaviorShifts}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>AI trends</Text>
          <Text style={styles.cardBody}>{report.marketTrends.aiTrends}</Text>
        </View>

        <Footer />
      </Page>

      {/* Opportunity Radar + Recommended Actions */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionEyebrow}>Section 5</Text>
        <Text style={styles.sectionTitle}>Opportunity Radar</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { width: 24 }]}>#</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Opportunity</Text>
          <Text style={[styles.tableHeaderCell, { width: 55 }]}>Impact</Text>
          <Text style={[styles.tableHeaderCell, { width: 55 }]}>Urgency</Text>
          <Text style={[styles.tableHeaderCell, { width: 55 }]}>Effort</Text>
        </View>
        {radar.map((o) => (
          <View key={o.rank} style={styles.tableRow} wrap={false}>
            <Text style={[styles.tableCell, { width: 24 }]}>#{o.rank}</Text>
            <Text style={[styles.tableCell, { flex: 1, fontFamily: "Helvetica-Bold" }]}>
              {o.opportunity}
            </Text>
            <View style={{ width: 55 }}>
              <LevelChip level={o.customerImpact} />
            </View>
            <View style={{ width: 55 }}>
              <LevelChip level={o.competitiveUrgency} />
            </View>
            <View style={{ width: 55 }}>
              <LevelChip level={o.implementationEffort} />
            </View>
          </View>
        ))}

        <Text style={[styles.sectionEyebrow, { marginTop: 18 }]}>Section 6</Text>
        <Text style={styles.sectionTitle}>Recommended Actions</Text>
        {([
          ["Investigate next", report.recommendedActions.investigateNext],
          ["Customer conversations", report.recommendedActions.customerConversations],
          ["Roadmap opportunities", report.recommendedActions.roadmapOpportunities],
        ] as const).map(([label, items]) => (
          <View key={label} style={{ marginBottom: 10 }} wrap={false}>
            <Text style={styles.groupLabel}>{label}</Text>
            {items.map((item, i) => (
              <View key={i} style={styles.bulletRow}>
                <View style={styles.bulletDot} />
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>
        ))}

        <Footer />
      </Page>

      {/* Sources */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionEyebrow}>Appendix</Text>
        <Text style={styles.sectionTitle}>Resources Consulted</Text>
        <Text style={[styles.cardBody, { color: COLORS.mist, marginBottom: 14 }]}>
          This report was produced using live web research — competitor websites, product
          pages, and industry news were read directly rather than relying on general
          knowledge alone. Below are the specific sources consulted while researching this
          report.
        </Text>
        {report.sources.length === 0 ? (
          <Text style={styles.cardBody}>No external sources were recorded for this report.</Text>
        ) : (
          report.sources.map((s, i) => (
            <View key={i} style={styles.sourceRow} wrap={false}>
              <Text style={styles.sourceTitle}>{s.title}</Text>
              <Text style={styles.sourceUrl}>{s.url}</Text>
              {s.note && <Text style={styles.sourceNote}>{s.note}</Text>}
            </View>
          ))
        )}

        <Footer />
      </Page>
    </Document>
  );
}

export async function renderReportPdf(report: CompetitiveReport): Promise<Buffer> {
  return renderToBuffer(<ReportDocument report={report} />);
}
