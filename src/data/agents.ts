import type { Agent } from "@/lib/types";

export const agentModels = [
  { id: "nexus-large", name: "Nexus Large", context: "200K", costPer1k: 0.012 },
  { id: "nexus-fast", name: "Nexus Fast", context: "128K", costPer1k: 0.004 },
  { id: "nexus-reason", name: "Nexus Reason", context: "256K", costPer1k: 0.021 },
  { id: "nexus-mini", name: "Nexus Mini", context: "64K", costPer1k: 0.001 },
] as const;

export const agentCategories = [
  "Support",
  "Sales",
  "Engineering",
  "Data",
  "Marketing",
  "Operations",
];

export const availableTools = [
  { id: "web_search", name: "Web Search", description: "Query the public web for fresh context." },
  { id: "code_exec", name: "Code Interpreter", description: "Run sandboxed Python for analysis." },
  { id: "vector_db", name: "Knowledge Base", description: "Retrieve chunks from your vector store." },
  { id: "http", name: "HTTP Request", description: "Call any REST endpoint with auth headers." },
  { id: "email", name: "Email Sender", description: "Send transactional email on completion." },
  { id: "crm", name: "CRM Lookup", description: "Read and write records in your CRM." },
];

function runs(seed: number, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const statuses = ["success", "success", "success", "failed", "success"] as const;
    return {
      id: `run_${seed}_${i}`,
      startedAt: new Date(Date.UTC(2026, 7, 31, 9, 0) - i * 3600_000 * 2.5).toISOString(),
      durationMs: 820 + ((seed * (i + 3)) % 2600),
      status: (i === 2 && seed % 2 === 0 ? "failed" : statuses[i % statuses.length]) as
        | "success"
        | "failed"
        | "running",
      tokens: 1200 + ((seed * 137 * (i + 1)) % 4800),
      trigger: ["API", "Schedule", "Slack", "Webhook", "Manual"][i % 5],
    };
  });
}

export const agents: Agent[] = [
  {
    id: "agt_support_triage",
    name: "Support Triage",
    description:
      "Classifies inbound tickets, drafts a first reply and routes anything urgent to a human.",
    model: "nexus-large",
    systemPrompt:
      "You are a senior support engineer. Classify the ticket by severity, product area and sentiment. Draft a concise, empathetic first reply. Escalate to a human whenever the customer mentions data loss, billing disputes or security.",
    status: "active",
    enabled: true,
    category: "Support",
    createdAt: "2026-01-14T10:00:00Z",
    updatedAt: "2026-08-31T09:04:00Z",
    owner: "Hana Yamamoto",
    runs30d: 18420,
    successRate: 98.6,
    avgResponseMs: 1240,
    tokens30d: 4_820_000,
    tools: [
      { id: "vector_db", name: "Knowledge Base", description: "Help center articles" },
      { id: "crm", name: "CRM Lookup", description: "Customer plan and history" },
      { id: "email", name: "Email Sender", description: "Send the drafted reply" },
    ],
    steps: [
      { id: "s1", title: "Ticket received", type: "trigger", description: "Webhook from the helpdesk" },
      { id: "s2", title: "Classify severity", type: "llm", description: "Severity, area, sentiment" },
      { id: "s3", title: "Search knowledge base", type: "tool", description: "Top 5 relevant articles" },
      { id: "s4", title: "Urgent?", type: "condition", description: "Escalate P0/P1 to on-call" },
      { id: "s5", title: "Draft and send reply", type: "output", description: "Reply + internal note" },
    ],
    history: runs(3, 8),
    versions: [
      { version: "v4.2", createdAt: "2026-08-31T09:04:00Z", author: "Hana Yamamoto", summary: "Tighter escalation rules for billing disputes" },
      { version: "v4.1", createdAt: "2026-08-12T13:20:00Z", author: "Daniel Reyes", summary: "Added CRM lookup tool" },
      { version: "v4.0", createdAt: "2026-07-02T08:45:00Z", author: "Hana Yamamoto", summary: "Migrated to Nexus Large" },
    ],
  },
  {
    id: "agt_sales_researcher",
    name: "Sales Researcher",
    description: "Builds an account brief from public sources before every discovery call.",
    model: "nexus-reason",
    systemPrompt:
      "Research the given company. Produce a one-page brief: what they sell, recent funding, tech stack signals, and three tailored discovery questions. Cite every claim with a source URL.",
    status: "active",
    enabled: true,
    category: "Sales",
    createdAt: "2026-02-08T10:00:00Z",
    updatedAt: "2026-08-28T15:10:00Z",
    owner: "Daniel Reyes",
    runs30d: 2140,
    successRate: 96.1,
    avgResponseMs: 4820,
    tokens30d: 3_120_000,
    tools: [
      { id: "web_search", name: "Web Search", description: "Public company research" },
      { id: "crm", name: "CRM Lookup", description: "Existing account context" },
    ],
    steps: [
      { id: "s1", title: "Meeting booked", type: "trigger", description: "Calendar event created" },
      { id: "s2", title: "Gather sources", type: "tool", description: "Search news, careers, docs" },
      { id: "s3", title: "Synthesize brief", type: "llm", description: "One page with citations" },
      { id: "s4", title: "Attach to CRM", type: "output", description: "Write note on the opportunity" },
    ],
    history: runs(7, 8),
    versions: [
      { version: "v2.3", createdAt: "2026-08-28T15:10:00Z", author: "Daniel Reyes", summary: "Require citations on every claim" },
      { version: "v2.2", createdAt: "2026-06-19T09:00:00Z", author: "Priya Raghavan", summary: "Switched to Nexus Reason" },
    ],
  },
  {
    id: "agt_data_extractor",
    name: "Data Extractor",
    description: "Turns messy PDFs and invoices into validated structured JSON.",
    model: "nexus-large",
    systemPrompt:
      "Extract the requested fields from the supplied document into strict JSON matching the provided schema. Never invent values — return null for anything you cannot find, and include a confidence score per field.",
    status: "error",
    enabled: true,
    category: "Data",
    createdAt: "2026-03-21T10:00:00Z",
    updatedAt: "2026-08-30T11:09:00Z",
    owner: "Priya Raghavan",
    runs30d: 9860,
    successRate: 91.4,
    avgResponseMs: 2960,
    tokens30d: 2_740_000,
    tools: [
      { id: "code_exec", name: "Code Interpreter", description: "Schema validation" },
      { id: "http", name: "HTTP Request", description: "Post results downstream" },
    ],
    steps: [
      { id: "s1", title: "File uploaded", type: "trigger", description: "Drive or API upload" },
      { id: "s2", title: "Extract fields", type: "llm", description: "Schema-constrained output" },
      { id: "s3", title: "Validate JSON", type: "tool", description: "Reject on schema mismatch" },
      { id: "s4", title: "Confidence low?", type: "condition", description: "Route to human review" },
      { id: "s5", title: "Deliver payload", type: "output", description: "POST to your endpoint" },
    ],
    history: runs(11, 8),
    versions: [
      { version: "v3.1", createdAt: "2026-08-30T11:09:00Z", author: "Priya Raghavan", summary: "Fixed timeout on 40+ page PDFs" },
      { version: "v3.0", createdAt: "2026-07-25T12:00:00Z", author: "Priya Raghavan", summary: "Per-field confidence scores" },
    ],
  },
  {
    id: "agt_content_writer",
    name: "Content Writer",
    description: "Drafts blog posts and release notes in the company tone of voice.",
    model: "nexus-fast",
    systemPrompt:
      "Write in the Nexus voice: direct, concrete, no hype. Lead with the reader's problem. Keep paragraphs under four lines and never use the words 'revolutionary' or 'seamless'.",
    status: "active",
    enabled: true,
    category: "Marketing",
    createdAt: "2026-04-02T10:00:00Z",
    updatedAt: "2026-08-25T10:30:00Z",
    owner: "Mei Chen",
    runs30d: 1420,
    successRate: 99.2,
    avgResponseMs: 980,
    tokens30d: 1_640_000,
    tools: [{ id: "vector_db", name: "Knowledge Base", description: "Brand and style guide" }],
    steps: [
      { id: "s1", title: "Brief submitted", type: "trigger", description: "Form or Notion page" },
      { id: "s2", title: "Load style guide", type: "tool", description: "Retrieve tone rules" },
      { id: "s3", title: "Draft article", type: "llm", description: "Outline then full draft" },
      { id: "s4", title: "Publish draft", type: "output", description: "Create CMS entry" },
    ],
    history: runs(5, 8),
    versions: [
      { version: "v1.9", createdAt: "2026-08-25T10:30:00Z", author: "Mei Chen", summary: "Banned hype vocabulary" },
    ],
  },
  {
    id: "agt_code_reviewer",
    name: "Code Reviewer",
    description: "Reviews pull requests for correctness, security and test coverage gaps.",
    model: "nexus-reason",
    systemPrompt:
      "Review the diff. Report only defects you can trace to a concrete failure scenario. Rank by severity. Suggest a minimal patch for each finding and never comment on formatting.",
    status: "active",
    enabled: true,
    category: "Engineering",
    createdAt: "2026-05-11T10:00:00Z",
    updatedAt: "2026-08-29T17:45:00Z",
    owner: "Ibrahim Diallo",
    runs30d: 3260,
    successRate: 97.3,
    avgResponseMs: 6120,
    tokens30d: 2_180_000,
    tools: [
      { id: "http", name: "HTTP Request", description: "Fetch the diff" },
      { id: "code_exec", name: "Code Interpreter", description: "Run static checks" },
    ],
    steps: [
      { id: "s1", title: "PR opened", type: "trigger", description: "Git provider webhook" },
      { id: "s2", title: "Fetch diff", type: "tool", description: "Changed files only" },
      { id: "s3", title: "Analyze", type: "llm", description: "Severity-ranked findings" },
      { id: "s4", title: "Post review", type: "output", description: "Inline comments" },
    ],
    history: runs(13, 8),
    versions: [
      { version: "v2.0", createdAt: "2026-08-29T17:45:00Z", author: "Ibrahim Diallo", summary: "Skip formatting-only comments" },
    ],
  },
  {
    id: "agt_meeting_notes",
    name: "Meeting Notes",
    description: "Summarizes call transcripts into decisions, owners and follow-ups.",
    model: "nexus-mini",
    systemPrompt:
      "Summarize the transcript into three sections: Decisions, Action items (with owner and due date), Open questions. Keep it under 300 words.",
    status: "idle",
    enabled: true,
    category: "Operations",
    createdAt: "2026-05-30T10:00:00Z",
    updatedAt: "2026-08-18T09:00:00Z",
    owner: "Marcus Bell",
    runs30d: 640,
    successRate: 99.7,
    avgResponseMs: 720,
    tokens30d: 420_000,
    tools: [{ id: "email", name: "Email Sender", description: "Send recap to attendees" }],
    steps: [
      { id: "s1", title: "Transcript ready", type: "trigger", description: "Recording finished" },
      { id: "s2", title: "Summarize", type: "llm", description: "Decisions and actions" },
      { id: "s3", title: "Email recap", type: "output", description: "Send to all attendees" },
    ],
    history: runs(17, 8),
    versions: [
      { version: "v1.4", createdAt: "2026-08-18T09:00:00Z", author: "Marcus Bell", summary: "Cap summaries at 300 words" },
    ],
  },
  {
    id: "agt_churn_signal",
    name: "Churn Signal",
    description: "Scores accounts weekly for churn risk and explains the drivers.",
    model: "nexus-large",
    systemPrompt:
      "Given usage, support and billing signals, score churn risk 0-100. Explain the top three drivers in plain language and recommend one specific action for the account manager.",
    status: "idle",
    enabled: false,
    category: "Sales",
    createdAt: "2026-06-15T10:00:00Z",
    updatedAt: "2026-08-05T14:00:00Z",
    owner: "Daniel Reyes",
    runs30d: 120,
    successRate: 94.8,
    avgResponseMs: 3400,
    tokens30d: 180_000,
    tools: [{ id: "crm", name: "CRM Lookup", description: "Account signals" }],
    steps: [
      { id: "s1", title: "Weekly schedule", type: "trigger", description: "Every Monday 07:00" },
      { id: "s2", title: "Pull signals", type: "tool", description: "Usage, tickets, invoices" },
      { id: "s3", title: "Score and explain", type: "llm", description: "Risk score + drivers" },
      { id: "s4", title: "Notify owner", type: "output", description: "Slack the account manager" },
    ],
    history: runs(19, 6),
    versions: [
      { version: "v1.1", createdAt: "2026-08-05T14:00:00Z", author: "Daniel Reyes", summary: "Added billing signals" },
    ],
  },
  {
    id: "agt_onboarding_buddy",
    name: "Onboarding Buddy",
    description: "Answers new-hire questions from internal docs during the first 30 days.",
    model: "nexus-fast",
    systemPrompt:
      "Answer only from the internal handbook. If the answer is not in the docs, say so and point the person to the right team. Always link the source page.",
    status: "draft",
    enabled: false,
    category: "Operations",
    createdAt: "2026-08-20T10:00:00Z",
    updatedAt: "2026-08-26T11:20:00Z",
    owner: "Amara Okafor",
    runs30d: 0,
    successRate: 0,
    avgResponseMs: 0,
    tokens30d: 0,
    tools: [{ id: "vector_db", name: "Knowledge Base", description: "Internal handbook" }],
    steps: [
      { id: "s1", title: "Question asked", type: "trigger", description: "Slack DM" },
      { id: "s2", title: "Retrieve docs", type: "tool", description: "Handbook search" },
      { id: "s3", title: "Answer with source", type: "output", description: "Reply with link" },
    ],
    history: [],
    versions: [
      { version: "v0.3", createdAt: "2026-08-26T11:20:00Z", author: "Amara Okafor", summary: "Draft — pending handbook indexing" },
    ],
  },
];

export function getAgent(id: string) {
  return agents.find((agent) => agent.id === id);
}

export function modelName(id: string) {
  return agentModels.find((model) => model.id === id)?.name ?? id;
}
