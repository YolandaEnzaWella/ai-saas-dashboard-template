import { seededRandom } from "@/lib/utils";

export const agentPerformance = [
  { agent: "Support Triage", responseMs: 1240, successRate: 98.6, errorRate: 1.4, runs: 18420 },
  { agent: "Sales Researcher", responseMs: 4820, successRate: 96.1, errorRate: 3.9, runs: 2140 },
  { agent: "Data Extractor", responseMs: 2960, successRate: 91.4, errorRate: 8.6, runs: 9860 },
  { agent: "Code Reviewer", responseMs: 6120, successRate: 97.3, errorRate: 2.7, runs: 3260 },
  { agent: "Content Writer", responseMs: 980, successRate: 99.2, errorRate: 0.8, runs: 1420 },
  { agent: "Meeting Notes", responseMs: 720, successRate: 99.7, errorRate: 0.3, runs: 640 },
];

export const conversationTrend = Array.from({ length: 14 }, (_, i) => {
  const random = seededRandom(300 + i);
  const date = new Date(Date.UTC(2026, 7, 18) + i * 86_400_000);
  const weekday = date.getUTCDay();
  const factor = weekday === 0 || weekday === 6 ? 0.5 : 1;
  return {
    date: date.toISOString().slice(5, 10),
    conversations: Math.round(420 * factor * (0.85 + random() * 0.35)),
    avgSessionMin: Number((6 + random() * 5).toFixed(1)),
    newUsers: Math.round(18 * factor * (0.7 + random() * 0.6)),
  };
});

export const channelSplit = [
  { name: "Web app", value: 46 },
  { name: "API", value: 31 },
  { name: "Slack", value: 14 },
  { name: "Mobile", value: 9 },
];

export const intentSplit = [
  { name: "Support", value: 34 },
  { name: "Research", value: 22 },
  { name: "Extraction", value: 19 },
  { name: "Writing", value: 15 },
  { name: "Other", value: 10 },
];

/** Hour-of-week activity matrix for the heatmap (FR-ANL-01). */
export const activityHeatmap = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, dayIndex) => ({
  day,
  hours: Array.from({ length: 24 }, (_, hour) => {
    const random = seededRandom(dayIndex * 100 + hour + 7);
    const workHours = hour >= 8 && hour <= 19;
    const weekend = dayIndex >= 5;
    const base = weekend ? 12 : workHours ? 78 : 22;
    return Math.round(base * (0.55 + random() * 0.75));
  }),
}));

export const latencyDistribution = [
  { bucket: "<0.5s", runs: 4820 },
  { bucket: "0.5–1s", runs: 9640 },
  { bucket: "1–2s", runs: 12480 },
  { bucket: "2–5s", runs: 6240 },
  { bucket: "5–10s", runs: 1840 },
  { bucket: ">10s", runs: 420 },
];

export const errorBreakdown = [
  { reason: "Tool timeout", count: 412, share: 41.2 },
  { reason: "Rate limited", count: 268, share: 26.8 },
  { reason: "Schema validation", count: 174, share: 17.4 },
  { reason: "Context overflow", count: 92, share: 9.2 },
  { reason: "Upstream 5xx", count: 54, share: 5.4 },
];

export const topUsers = [
  { name: "Hana Yamamoto", avatar: "HY", conversations: 482, tokens: 4_220_000, avgSessionMin: 11.4 },
  { name: "Priya Raghavan", avatar: "PR", conversations: 414, tokens: 3_000_000, avgSessionMin: 9.2 },
  { name: "Daniel Reyes", avatar: "DR", conversations: 388, tokens: 3_400_000, avgSessionMin: 8.7 },
  { name: "Ibrahim Diallo", avatar: "ID", conversations: 266, tokens: 2_340_000, avgSessionMin: 12.1 },
  { name: "Mei Chen", avatar: "MC", conversations: 198, tokens: 1_540_000, avgSessionMin: 7.4 },
];

export const retentionCohorts = [
  { cohort: "Jun 2026", week0: 100, week1: 78, week2: 64, week3: 58, week4: 54 },
  { cohort: "Jul 2026", week0: 100, week1: 81, week2: 69, week3: 62, week4: 59 },
  { cohort: "Aug 2026", week0: 100, week1: 84, week2: 72, week3: 66, week4: 0 },
];
