import type { UsageBreakdownRow, UsagePoint } from "@/lib/types";
import { seededRandom } from "@/lib/utils";

/**
 * Daily usage series generated from a fixed seed: the numbers look organic
 * (weekend dips, a mid-month ramp) but never change between renders.
 */
function buildSeries(days: number, seed: number): UsagePoint[] {
  const random = seededRandom(seed);
  const end = Date.UTC(2026, 7, 31);
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(end - (days - 1 - i) * 86_400_000);
    const weekday = date.getUTCDay();
    const weekendFactor = weekday === 0 || weekday === 6 ? 0.45 : 1;
    const ramp = 0.72 + (i / days) * 0.5;
    const noise = 0.85 + random() * 0.32;
    const input = Math.round(148_000 * weekendFactor * ramp * noise);
    const output = Math.round(input * (0.36 + random() * 0.12));
    const requests = Math.round((input + output) / 940);
    return {
      date: date.toISOString().slice(0, 10),
      inputTokens: input,
      outputTokens: output,
      requests,
      cost: Number((((input + output) / 1000) * 0.0094).toFixed(2)),
    };
  });
}

export const usageDaily = buildSeries(30, 42);
export const usageWeekly: UsagePoint[] = Array.from({ length: 12 }, (_, week) => {
  const slice = buildSeries(7, 100 + week);
  const sum = (key: "inputTokens" | "outputTokens" | "requests" | "cost") =>
    slice.reduce((total, point) => total + point[key], 0);
  return {
    date: `W${week + 1}`,
    inputTokens: sum("inputTokens"),
    outputTokens: sum("outputTokens"),
    requests: sum("requests"),
    cost: Number(sum("cost").toFixed(2)),
  };
});

export const usageMonthly: UsagePoint[] = [
  "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
].map((month, index) => {
  const random = seededRandom(200 + index);
  const base = 2_600_000 + index * 320_000;
  const input = Math.round(base * (0.9 + random() * 0.25));
  const output = Math.round(input * 0.41);
  return {
    date: month,
    inputTokens: input,
    outputTokens: output,
    requests: Math.round((input + output) / 940),
    cost: Number((((input + output) / 1000) * 0.0094).toFixed(2)),
  };
});

export const usageByRange = {
  "7d": usageDaily.slice(-7),
  "30d": usageDaily,
  "12w": usageWeekly,
  "12m": usageMonthly,
} as const;

export type UsageRange = keyof typeof usageByRange;

export const quota = {
  limit: 20_000_000,
  used: 16_420_000,
  resetsOn: "2026-09-01",
  softAlertAt: 0.8,
  spendLimit: 2500,
  spendUsed: 1842.4,
};

export const usageByAgent: UsageBreakdownRow[] = [
  { id: "agt_support_triage", label: "Support Triage", type: "agent", inputTokens: 3_420_000, outputTokens: 1_400_000, requests: 18420, cost: 45.31, changePct: 12.4 },
  { id: "agt_sales_researcher", label: "Sales Researcher", type: "agent", inputTokens: 2_180_000, outputTokens: 940_000, requests: 2140, cost: 29.33, changePct: -4.2 },
  { id: "agt_data_extractor", label: "Data Extractor", type: "agent", inputTokens: 1_980_000, outputTokens: 760_000, requests: 9860, cost: 25.76, changePct: 31.8 },
  { id: "agt_code_reviewer", label: "Code Reviewer", type: "agent", inputTokens: 1_540_000, outputTokens: 640_000, requests: 3260, cost: 20.49, changePct: 8.1 },
  { id: "agt_content_writer", label: "Content Writer", type: "agent", inputTokens: 1_180_000, outputTokens: 460_000, requests: 1420, cost: 15.41, changePct: -1.6 },
  { id: "agt_meeting_notes", label: "Meeting Notes", type: "agent", inputTokens: 300_000, outputTokens: 120_000, requests: 640, cost: 3.95, changePct: 2.9 },
];

export const usageByModel: UsageBreakdownRow[] = [
  { id: "nexus-large", label: "Nexus Large", type: "model", inputTokens: 5_400_000, outputTokens: 2_280_000, requests: 28420, cost: 92.16, changePct: 9.7 },
  { id: "nexus-reason", label: "Nexus Reason", type: "model", inputTokens: 3_720_000, outputTokens: 1_580_000, requests: 5400, cost: 111.30, changePct: 18.2 },
  { id: "nexus-fast", label: "Nexus Fast", type: "model", inputTokens: 2_240_000, outputTokens: 880_000, requests: 12140, cost: 12.48, changePct: -6.4 },
  { id: "nexus-mini", label: "Nexus Mini", type: "model", inputTokens: 240_000, outputTokens: 80_000, requests: 640, cost: 0.32, changePct: 1.1 },
];

export const usageByMember: UsageBreakdownRow[] = [
  { id: "usr_09", label: "Hana Yamamoto", type: "member", inputTokens: 2_980_000, outputTokens: 1_240_000, requests: 9820, cost: 39.65, changePct: 14.2 },
  { id: "usr_02", label: "Daniel Reyes", type: "member", inputTokens: 2_420_000, outputTokens: 980_000, requests: 6140, cost: 31.96, changePct: 5.4 },
  { id: "usr_03", label: "Priya Raghavan", type: "member", inputTokens: 2_140_000, outputTokens: 860_000, requests: 8420, cost: 28.20, changePct: 22.6 },
  { id: "usr_08", label: "Ibrahim Diallo", type: "member", inputTokens: 1_640_000, outputTokens: 700_000, requests: 3260, cost: 22.00, changePct: -3.1 },
  { id: "usr_05", label: "Mei Chen", type: "member", inputTokens: 1_120_000, outputTokens: 420_000, requests: 1980, cost: 14.48, changePct: 7.8 },
  { id: "usr_12", label: "Marcus Bell", type: "member", inputTokens: 620_000, outputTokens: 240_000, requests: 1140, cost: 8.08, changePct: -0.4 },
];

/** Month-over-month comparison for FR-USG-06. */
export const monthOverMonth = usageMonthly.slice(-2).map((point, index) => ({
  label: index === 0 ? "July 2026" : "August 2026",
  tokens: point.inputTokens + point.outputTokens,
  requests: point.requests,
  cost: point.cost,
}));

export const usageReports = [
  { id: "rpt_01", name: "August 2026 — full usage", period: "Aug 1 – Aug 31, 2026", rows: 18420, size: "1.4 MB", generatedAt: "2026-08-31T06:00:00Z", format: "CSV" },
  { id: "rpt_02", name: "Q3 cost by agent", period: "Jul 1 – Aug 31, 2026", rows: 240, size: "84 KB", generatedAt: "2026-08-30T06:00:00Z", format: "PDF" },
  { id: "rpt_03", name: "July 2026 — full usage", period: "Jul 1 – Jul 31, 2026", rows: 16240, size: "1.2 MB", generatedAt: "2026-08-01T06:00:00Z", format: "CSV" },
  { id: "rpt_04", name: "Per-member breakdown", period: "Aug 1 – Aug 31, 2026", rows: 12, size: "18 KB", generatedAt: "2026-08-28T06:00:00Z", format: "CSV" },
];
