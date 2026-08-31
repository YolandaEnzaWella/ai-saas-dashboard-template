import type { Prompt } from "@/lib/types";

export const promptCategories = [
  "Support",
  "Sales",
  "Engineering",
  "Marketing",
  "Analysis",
  "Internal",
];

export const prompts: Prompt[] = [
  {
    id: "prm_01",
    title: "Ticket First Reply",
    description: "Empathetic first response with a proposed fix and clear next step.",
    category: "Support",
    tags: ["support", "email", "tone"],
    content:
      "You are replying to {{customer_name}} about a {{severity}} issue with {{product_area}}.\n\nWrite a reply that:\n1. Acknowledges the impact in one sentence — no apologies longer than that.\n2. States what you know so far.\n3. Gives one concrete next step with a timeframe.\n\nSign off as {{agent_name}}.",
    variables: ["customer_name", "severity", "product_area", "agent_name"],
    status: "published",
    uses: 12480,
    rating: 4.8,
    updatedAt: "2026-08-30T12:00:00Z",
    author: "Hana Yamamoto",
    versions: [
      { version: "v3.0", createdAt: "2026-08-30T12:00:00Z", author: "Hana Yamamoto", note: "Cut the apology paragraph" },
      { version: "v2.4", createdAt: "2026-07-11T10:00:00Z", author: "Daniel Reyes", note: "Added severity variable" },
    ],
  },
  {
    id: "prm_02",
    title: "Release Notes Writer",
    description: "Turns a changelog diff into user-facing release notes.",
    category: "Marketing",
    tags: ["changelog", "product"],
    content:
      "Turn the following commits into release notes for {{release_version}}:\n\n{{commits}}\n\nGroup into New, Improved, Fixed. Each line must say what changed for the user, not what changed in the code. Skip anything invisible to users.",
    variables: ["release_version", "commits"],
    status: "published",
    uses: 3420,
    rating: 4.6,
    updatedAt: "2026-08-31T08:22:00Z",
    author: "Daniel Reyes",
    versions: [
      { version: "v2.1", createdAt: "2026-08-31T08:22:00Z", author: "Daniel Reyes", note: "Drop internal-only changes" },
    ],
  },
  {
    id: "prm_03",
    title: "Discovery Call Brief",
    description: "One-page account brief with tailored discovery questions.",
    category: "Sales",
    tags: ["research", "sales"],
    content:
      "Research {{company_name}} ({{company_domain}}).\n\nProduce:\n- What they sell, in one sentence\n- Recent funding or leadership changes\n- Tech stack signals from job posts\n- Three discovery questions specific to {{our_product}}\n\nCite every claim with a URL.",
    variables: ["company_name", "company_domain", "our_product"],
    status: "published",
    uses: 2180,
    rating: 4.9,
    updatedAt: "2026-08-24T09:30:00Z",
    author: "Daniel Reyes",
    versions: [
      { version: "v1.7", createdAt: "2026-08-24T09:30:00Z", author: "Daniel Reyes", note: "Require citations" },
    ],
  },
  {
    id: "prm_04",
    title: "Code Review Checklist",
    description: "Severity-ranked review focused on correctness and security.",
    category: "Engineering",
    tags: ["review", "security"],
    content:
      "Review this diff from {{repository}} on branch {{branch}}.\n\nReport only defects with a concrete failure scenario. For each: severity, file:line, one-sentence description, minimal patch. Ignore formatting entirely.",
    variables: ["repository", "branch"],
    status: "published",
    uses: 5640,
    rating: 4.7,
    updatedAt: "2026-08-19T16:00:00Z",
    author: "Ibrahim Diallo",
    versions: [
      { version: "v2.2", createdAt: "2026-08-19T16:00:00Z", author: "Ibrahim Diallo", note: "Require failure scenario" },
    ],
  },
  {
    id: "prm_05",
    title: "Churn Risk Explainer",
    description: "Explains a churn score in plain language for account managers.",
    category: "Analysis",
    tags: ["churn", "retention"],
    content:
      "Account {{account_name}} scored {{risk_score}}/100 for churn risk.\n\nSignals:\n{{signals}}\n\nExplain the top three drivers in language an account manager can repeat on a call, then recommend one specific action this week.",
    variables: ["account_name", "risk_score", "signals"],
    status: "published",
    uses: 940,
    rating: 4.4,
    updatedAt: "2026-08-12T11:00:00Z",
    author: "Priya Raghavan",
    versions: [
      { version: "v1.3", createdAt: "2026-08-12T11:00:00Z", author: "Priya Raghavan", note: "Single recommended action" },
    ],
  },
  {
    id: "prm_06",
    title: "Invoice Field Extraction",
    description: "Strict JSON extraction with per-field confidence.",
    category: "Analysis",
    tags: ["extraction", "json"],
    content:
      "Extract the following fields from the attached document into JSON matching {{schema}}.\n\nRules:\n- Return null for anything not present. Never guess.\n- Add a confidence score 0-1 per field.\n- Recompute totals yourself and flag mismatches.",
    variables: ["schema"],
    status: "published",
    uses: 8120,
    rating: 4.5,
    updatedAt: "2026-08-08T14:20:00Z",
    author: "Priya Raghavan",
    versions: [
      { version: "v2.0", createdAt: "2026-08-08T14:20:00Z", author: "Priya Raghavan", note: "Per-field confidence" },
    ],
  },
  {
    id: "prm_07",
    title: "Onboarding Answer",
    description: "Handbook-grounded answers for new hires.",
    category: "Internal",
    tags: ["hr", "rag"],
    content:
      "Answer {{question}} using only the handbook excerpts below.\n\n{{context}}\n\nIf the answer is not in the excerpts, say so and name the team to ask. Always link the source page.",
    variables: ["question", "context"],
    status: "draft",
    uses: 0,
    rating: 0,
    updatedAt: "2026-08-26T11:20:00Z",
    author: "Amara Okafor",
    versions: [
      { version: "v0.2", createdAt: "2026-08-26T11:20:00Z", author: "Amara Okafor", note: "Draft" },
    ],
  },
  {
    id: "prm_08",
    title: "Weekly Digest",
    description: "Condenses a week of workspace activity into a five-bullet digest.",
    category: "Internal",
    tags: ["summary", "digest"],
    content:
      "Summarize this week for {{team_name}} in five bullets: what shipped, what broke, spend vs budget, one risk, one win.\n\nData:\n{{activity}}",
    variables: ["team_name", "activity"],
    status: "draft",
    uses: 0,
    rating: 0,
    updatedAt: "2026-08-22T09:00:00Z",
    author: "Marcus Bell",
    versions: [
      { version: "v0.1", createdAt: "2026-08-22T09:00:00Z", author: "Marcus Bell", note: "Initial draft" },
    ],
  },
];

export function getPrompt(id: string) {
  return prompts.find((prompt) => prompt.id === id);
}
