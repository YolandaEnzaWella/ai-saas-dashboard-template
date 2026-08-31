import type { Conversation } from "@/lib/types";

const codeReply = `Here is a minimal client for the Nexus streaming endpoint:

\`\`\`ts
const res = await fetch("https://api.nexus.ai/v1/chat", {
  method: "POST",
  headers: { Authorization: \`Bearer \${key}\`, "Content-Type": "application/json" },
  body: JSON.stringify({ model: "nexus-large", stream: true, messages }),
});

for await (const chunk of res.body!) {
  process.stdout.write(decoder.decode(chunk));
}
\`\`\`

A few things worth knowing:

- The stream emits \`data:\` frames, so parse line by line rather than as JSON.
- Set a client timeout above 60s — long tool calls hold the connection open.
- Retry on \`429\` with the \`Retry-After\` header; do not retry \`400\`.`;

const tableReply = `Based on last month's traffic, here is how the three candidate models compare:

| Model | Avg latency | Cost / 1K | Success rate |
| --- | --- | --- | --- |
| Nexus Large | 1.24s | $0.012 | 98.6% |
| Nexus Fast | 0.71s | $0.004 | 97.1% |
| Nexus Reason | 4.82s | $0.021 | 99.2% |

For ticket triage I would keep **Nexus Large**. Nexus Fast saves roughly $1,900 a month but the 1.5pt drop in success rate translates to about 270 misrouted tickets — more expensive than the savings.`;

export const conversations: Conversation[] = [
  {
    id: "cnv_01",
    title: "Streaming API client in TypeScript",
    agentId: "agt_code_reviewer",
    agentName: "Code Reviewer",
    model: "nexus-large",
    createdAt: "2026-08-31T08:20:00Z",
    updatedAt: "2026-08-31T08:46:00Z",
    pinned: true,
    messageCount: 4,
    preview: "Here is a minimal client for the Nexus streaming endpoint…",
    messages: [
      {
        id: "msg_01",
        conversationId: "cnv_01",
        role: "user",
        content: "Show me how to call the streaming chat endpoint from Node with proper error handling.",
        createdAt: "2026-08-31T08:20:00Z",
        tokenCount: 18,
      },
      {
        id: "msg_02",
        conversationId: "cnv_01",
        role: "assistant",
        content: codeReply,
        createdAt: "2026-08-31T08:20:24Z",
        tokenCount: 214,
        model: "nexus-large",
      },
      {
        id: "msg_03",
        conversationId: "cnv_01",
        role: "user",
        content: "What happens if the connection drops halfway through a tool call?",
        createdAt: "2026-08-31T08:44:00Z",
        tokenCount: 15,
      },
      {
        id: "msg_04",
        conversationId: "cnv_01",
        role: "assistant",
        content:
          "The run keeps executing server-side and the result is stored against the run id. Reconnect with `GET /v1/runs/{id}` to fetch whatever completed while you were disconnected — you will not be billed twice for the same run.",
        createdAt: "2026-08-31T08:46:00Z",
        tokenCount: 62,
        model: "nexus-large",
      },
    ],
  },
  {
    id: "cnv_02",
    title: "Which model for ticket triage?",
    agentId: "agt_support_triage",
    agentName: "Support Triage",
    model: "nexus-reason",
    createdAt: "2026-08-30T16:10:00Z",
    updatedAt: "2026-08-30T16:31:00Z",
    pinned: true,
    messageCount: 2,
    preview: "Based on last month's traffic, here is how the three candidates compare…",
    messages: [
      {
        id: "msg_05",
        conversationId: "cnv_02",
        role: "user",
        content: "Compare Nexus Large, Fast and Reason for our support triage workload and recommend one.",
        createdAt: "2026-08-30T16:10:00Z",
        tokenCount: 22,
      },
      {
        id: "msg_06",
        conversationId: "cnv_02",
        role: "assistant",
        content: tableReply,
        createdAt: "2026-08-30T16:31:00Z",
        tokenCount: 268,
        model: "nexus-reason",
      },
    ],
  },
  {
    id: "cnv_03",
    title: "Q3 churn analysis summary",
    agentId: "agt_churn_signal",
    agentName: "Churn Signal",
    model: "nexus-large",
    createdAt: "2026-08-29T13:05:00Z",
    updatedAt: "2026-08-29T13:22:00Z",
    pinned: false,
    messageCount: 2,
    preview: "Three accounts moved into the high-risk band this quarter…",
    messages: [
      {
        id: "msg_07",
        conversationId: "cnv_03",
        role: "user",
        content: "Summarize the Q3 churn signals for accounts above $2k MRR.",
        createdAt: "2026-08-29T13:05:00Z",
        tokenCount: 16,
      },
      {
        id: "msg_08",
        conversationId: "cnv_03",
        role: "assistant",
        content: `Three accounts moved into the high-risk band this quarter:

1. **Northwind Systems** — token usage down 61% since July, two unresolved P1 tickets.
2. **Halcyon Retail** — invoice INV-2026-0742 is 18 days overdue and their admin seat went inactive.
3. **Verity Health** — steady usage, but their champion left; no logins from the new lead in 24 days.

The common driver is a **stalled champion**, not product dissatisfaction. I would prioritize a re-onboarding call with Verity Health first — highest MRR, easiest to recover.`,
        createdAt: "2026-08-29T13:22:00Z",
        tokenCount: 196,
        model: "nexus-large",
      },
    ],
  },
  {
    id: "cnv_04",
    title: "Rewrite onboarding email sequence",
    agentId: "agt_content_writer",
    agentName: "Content Writer",
    model: "nexus-fast",
    createdAt: "2026-08-28T10:40:00Z",
    updatedAt: "2026-08-28T10:52:00Z",
    pinned: false,
    messageCount: 2,
    preview: "Here are the five emails rewritten with a single call to action each…",
    messages: [
      {
        id: "msg_09",
        conversationId: "cnv_04",
        role: "user",
        content: "Rewrite our five onboarding emails. One call to action each, no marketing fluff.",
        createdAt: "2026-08-28T10:40:00Z",
        tokenCount: 20,
        attachments: [{ name: "onboarding-v2.docx", size: "48 KB", type: "document" }],
      },
      {
        id: "msg_10",
        conversationId: "cnv_04",
        role: "assistant",
        content: `Here are the five emails rewritten with a single call to action each:

**Day 0 — Create your first agent**
Subject: Your workspace is ready
One task: point them at the agent builder. Nothing else.

**Day 2 — Connect a data source**
Subject: Give your agent something to read

**Day 5 — Invite a teammate**
Subject: Agents get better when your team edits them

**Day 9 — Watch usage**
Subject: Where your tokens went this week

**Day 14 — Upgrade nudge**
Subject: You are at 78% of the free tier

I cut the "welcome to the future of AI" opener from all five — it delayed the action by two paragraphs.`,
        createdAt: "2026-08-28T10:52:00Z",
        tokenCount: 224,
        model: "nexus-fast",
      },
    ],
  },
  {
    id: "cnv_05",
    title: "Invoice PDF extraction schema",
    agentId: "agt_data_extractor",
    agentName: "Data Extractor",
    model: "nexus-large",
    createdAt: "2026-08-27T09:15:00Z",
    updatedAt: "2026-08-27T09:38:00Z",
    pinned: false,
    messageCount: 2,
    preview: "A flat schema works better here than a nested one…",
    messages: [
      {
        id: "msg_11",
        conversationId: "cnv_05",
        role: "user",
        content: "What JSON schema should I use for extracting line items from supplier invoices?",
        createdAt: "2026-08-27T09:15:00Z",
        tokenCount: 17,
      },
      {
        id: "msg_12",
        conversationId: "cnv_05",
        role: "assistant",
        content: `A flat schema works better here than a nested one — models drift less on repeated arrays when each item has few fields:

\`\`\`json
{
  "invoice_number": "string",
  "issued_at": "YYYY-MM-DD",
  "currency": "ISO-4217",
  "line_items": [
    { "description": "string", "qty": "number", "unit_price": "number" }
  ],
  "total": "number"
}
\`\`\`

Keep totals out of the line items and recompute them yourself — that turns a hallucinated number into a validation error instead of a silent bad record.`,
        createdAt: "2026-08-27T09:38:00Z",
        tokenCount: 188,
        model: "nexus-large",
      },
    ],
  },
  {
    id: "cnv_06",
    title: "Weekly standup recap",
    agentId: "agt_meeting_notes",
    agentName: "Meeting Notes",
    model: "nexus-mini",
    createdAt: "2026-08-26T15:00:00Z",
    updatedAt: "2026-08-26T15:04:00Z",
    pinned: false,
    messageCount: 2,
    preview: "Decisions, action items and open questions from the standup…",
    messages: [
      {
        id: "msg_13",
        conversationId: "cnv_06",
        role: "user",
        content: "Summarize this standup transcript into decisions and action items.",
        createdAt: "2026-08-26T15:00:00Z",
        tokenCount: 14,
        attachments: [{ name: "standup-2026-08-26.txt", size: "12 KB", type: "text" }],
      },
      {
        id: "msg_14",
        conversationId: "cnv_06",
        role: "assistant",
        content: `**Decisions**
- Ship the rate-limit change behind a flag on Thursday.
- Hold the pricing page redesign until after the Q3 review.

**Action items**
- Priya — patch the PDF timeout, due Aug 28.
- Ibrahim — draft the flag rollout plan, due Aug 27.
- Mei — collect three customer quotes for the launch post, due Sep 1.

**Open questions**
- Do we need a migration for existing webhook subscribers?`,
        createdAt: "2026-08-26T15:04:00Z",
        tokenCount: 142,
        model: "nexus-mini",
      },
    ],
  },
];

export function getConversation(id: string) {
  return conversations.find((conversation) => conversation.id === id);
}
