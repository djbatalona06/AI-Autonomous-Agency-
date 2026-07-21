/**
 * Staging table for the n8n Workflow Scout (see docs/brainstorming/n8n-workflow-scout/).
 * One entry per scraped/brainstormed workflow idea, keyed to the same vertical
 * codes as VERTICALS in verticals.ts (SAL, ECM, WHL, PRD, SMB).
 *
 * Deliberately NOT imported by any page — this is a review backlog, not a
 * live data source. Promote an idea by turning it into a TemplateCard in
 * verticals.ts once it's been built and validated.
 */

export type BrainstormTier = "simple" | "medium" | "complex" | "addon";

export interface BrainstormIdea {
  id: string;
  vertical: "SAL" | "ECM" | "WHL" | "PRD" | "SMB";
  title: string;
  pitch: string;
  nodeChain: string[];
  tier: BrainstormTier;
  priceBand: string;
  sources: string[];
  dateAdded: string;
}

export const BRAINSTORM_IDEAS: BrainstormIdea[] = [
  // Sales
  {
    id: "SAL-B01",
    vertical: "SAL",
    title: "Cold-Reply Classifier & Router",
    pitch: "Classifies inbox replies into interested / not-interested / objection / wrong-person and routes each to the right next step instead of sitting unread.",
    nodeChain: ["IMAP/Gmail Trigger", "Claude/GPT classify", "Switch (4 branches)", "CRM task create", "Apollo/Clearbit re-search", "Slack alert"],
    tier: "medium",
    priceBand: "$2,200–$3,200",
    sources: ["https://builtbyjoey.com/blog/n8n-workflow-templates-lead-generation/"],
    dateAdded: "2026-07-17",
  },
  {
    id: "SAL-B02",
    vertical: "SAL",
    title: "LinkedIn Job-Signal Outreach",
    pitch: "Watches for job-change/hiring signals and fires AI-personalized outreach while the signal is still warm.",
    nodeChain: ["Schedule Trigger", "Apify LinkedIn signal actor", "Gemini/Claude personalize", "Dedupe vs CRM", "Sheets/CRM queue", "Email/LinkedIn send"],
    tier: "medium",
    priceBand: "$2,500–$3,500",
    sources: ["https://connectsafely.ai/articles/n8n-templates-workflow-automation-examples"],
    dateAdded: "2026-07-17",
  },
  {
    id: "SAL-B03",
    vertical: "SAL",
    title: "CRM Database Reactivation Engine",
    pitch: "Finds CRM contacts dormant 90+ days, segments them, and runs an AI-personalized win-back sequence per segment.",
    nodeChain: ["Schedule Trigger", "CRM query (dormant)", "Segment", "Claude per-segment copy", "Saleshandy/SendGrid sequence", "Reply tracker"],
    tier: "complex",
    priceBand: "$3,500–$4,500",
    sources: ["https://builtbyjoey.com/blog/n8n-workflow-templates-lead-generation/"],
    dateAdded: "2026-07-17",
  },
  {
    id: "SAL-B04",
    vertical: "SAL",
    title: "Post-Call AI Summary → CRM Timeline",
    pitch: "Transcribes and summarizes every sales call, then pushes notes straight to the CRM contact timeline.",
    nodeChain: ["Webhook call-ended", "Download recording", "Whisper transcribe", "GPT summarize", "CRM note create", "Associate with contact"],
    tier: "medium",
    priceBand: "$1,800–$2,600",
    sources: ["https://nextautomation.us/resources/free-templates/6-real-estate-n8n-templates-20260209"],
    dateAdded: "2026-07-17",
  },
  {
    id: "SAL-B05",
    vertical: "SAL",
    title: "AI Lead Scorer & Auto-Router",
    pitch: "Scores inbound leads 0-100 against ICP criteria and routes hot/mid/low leads down three different paths.",
    nodeChain: ["Webhook form/CRM event", "HTTP Request enrich", "Claude score 0-100", "Switch hot/mid/low", "Slack + calendar link", "24h nurture / newsletter"],
    tier: "medium",
    priceBand: "$2,200–$3,000",
    sources: ["https://goodspeed.studio/blog/n8n-templates"],
    dateAdded: "2026-07-17",
  },

  // E-commerce
  {
    id: "ECM-B01",
    vertical: "ECM",
    title: "LTV-Segmented Cart Recovery",
    pitch: "Routes abandoned-cart outreach differently by customer lifetime value — high-LTV carts get a human sales touch, not just an email.",
    nodeChain: ["Shopify Webhook checkout-created", "HTTP Request fetch LTV", "Switch high/mid/low", "Premium email+SMS+Slack", "Email+SMS", "Single email"],
    tier: "complex",
    priceBand: "$3,000–$4,000",
    sources: ["https://n8nlab.io/blog/n8n-workflow-automation-shopify", "https://www.youtube.com/watch?v=y03IthePB1E"],
    dateAdded: "2026-07-17",
  },
  {
    id: "ECM-B02",
    vertical: "ECM",
    title: "AI Cross-Sell Recommender in Recovery Flow",
    pitch: "Adds AI-picked complementary products into the cart-recovery email to lift AOV, not just recover the sale.",
    nodeChain: ["Shopify Webhook cart-abandoned", "Shopify GraphQL history", "Claude/OpenAI cross-sell picks", "HTML template compile", "Klaviyo send", "Twilio SMS fallback"],
    tier: "complex",
    priceBand: "$3,800–$4,800",
    sources: ["https://n8nlab.io/blog/n8n-workflow-automation-shopify"],
    dateAdded: "2026-07-17",
  },
  {
    id: "ECM-B03",
    vertical: "ECM",
    title: "Proactive Shipping-Exception / WISMO Reducer",
    pitch: "Detects carrier delays and notifies the customer before they open a 'where's my order' ticket.",
    nodeChain: ["Schedule poll carrier API", "HTTP Request tracking status", "IF delay detected", "Claude draft notice", "Email/SMS", "Sheets log"],
    tier: "medium",
    priceBand: "$2,000–$3,000",
    sources: ["https://n8nlab.io/blog/n8n-workflow-automation-shopify"],
    dateAdded: "2026-07-17",
  },
  {
    id: "ECM-B04",
    vertical: "ECM",
    title: "Post-Recovery Retargeting Sync",
    pitch: "Hashes and pushes unrecovered-cart customers into a Facebook Custom Audience once the email sequence is exhausted.",
    nodeChain: ["Wait cart still unrecovered", "Code hash identifiers", "Facebook Graph API add audience", "Sheets attribution log"],
    tier: "addon",
    priceBand: "$600–$900",
    sources: ["https://n8n.io/workflows/11805-recover-shopify-abandoned-carts-with-email-sms-whatsapp-and-facebook-retargeting/"],
    dateAdded: "2026-07-17",
  },
  {
    id: "ECM-B05",
    vertical: "ECM",
    title: "Category-Aware Reorder Win-Back",
    pitch: "Computes reorder windows per product category instead of a flat 60/90-day default, so win-back timing actually fits the product.",
    nodeChain: ["Schedule Trigger", "Shopify Order query", "Code compute per-category window", "Filter past window", "Claude personalized offer", "Klaviyo send"],
    tier: "medium",
    priceBand: "$2,200–$3,200",
    sources: ["https://www.intuz.com/blog/best-n8n-workflow-templates/"],
    dateAdded: "2026-07-17",
  },

  // Wholesaling / REI
  {
    id: "WHL-B01",
    vertical: "WHL",
    title: "Zillow/MLS Investment Scanner + AI Scoring",
    pitch: "Scrapes listings on a schedule and scores each one 1-100 for investment potential before the competition sees it.",
    nodeChain: ["Apify Actor Trigger", "Code dedupe vs prior run", "Claude score 1-100", "Filter threshold", "Sheets log", "Slack/email alert"],
    tier: "complex",
    priceBand: "$3,000–$4,000",
    sources: ["https://nextautomation.us/resources/free-templates/6-real-estate-n8n-templates-20260209"],
    dateAdded: "2026-07-17",
  },
  {
    id: "WHL-B02",
    vertical: "WHL",
    title: "High-Equity Absentee-Owner Alert",
    pitch: "Scheduled BatchData scan diffs against the prior run and alerts on new high-equity, absentee-owner properties.",
    nodeChain: ["Schedule Trigger", "HTTP Request BatchData search", "Code diff vs previous", "Filter high-equity/absentee", "HTTP Request owner lookup", "Email+Slack alert"],
    tier: "medium",
    priceBand: "$2,000–$3,000",
    sources: ["https://n8n.io/workflows/3665-automated-property-lead-generation-with-batchdata-and-crm-integration/"],
    dateAdded: "2026-07-17",
  },
  {
    id: "WHL-B03",
    vertical: "WHL",
    title: "AI Cash-Buyer Scoring & LLC Enrichment",
    pitch: "Classifies raw buyer records by investor likelihood, enriches the LLC, checks phone hygiene, and scores 1-5 before it ever reaches dispo.",
    nodeChain: ["Schedule 6am", "Sheets buyers_raw", "Claude classify JSON", "HTTP Request LLC enrichment", "Code phone hygiene", "Code buyer score 1-5", "Sheets buyers_clean"],
    tier: "medium",
    priceBand: "$2,500–$3,500",
    sources: ["https://www.youtube.com/watch?v=ecIS1FJc-Xs"],
    dateAdded: "2026-07-17",
  },
  {
    id: "WHL-B04",
    vertical: "WHL",
    title: "Two-Way SMS Reply Classifier",
    pitch: "Classifies inbound seller/buyer text replies as hot/criteria/stop/wrong-number and routes each automatically.",
    nodeChain: ["Webhook inbound reply", "Claude classify", "Switch 4 branches", "CRM tag update", "Slack alert (hot)", "Suppress list update (stop)"],
    tier: "medium",
    priceBand: "$1,800–$2,500",
    sources: ["https://www.youtube.com/watch?v=ecIS1FJc-Xs"],
    dateAdded: "2026-07-17",
  },
  {
    id: "WHL-B05",
    vertical: "WHL",
    title: "GHL Call-Recording Auto-Summary for Acquisitions",
    pitch: "Transcribes and summarizes acquisitions calls straight into the GoHighLevel contact timeline.",
    nodeChain: ["Webhook GHL call-ended", "Download recording", "Whisper transcribe", "GPT summarize", "Push note to GHL timeline"],
    tier: "simple",
    priceBand: "$1,500–$2,200",
    sources: ["https://nextautomation.us/resources/free-templates/6-real-estate-n8n-templates-20260209"],
    dateAdded: "2026-07-17",
  },

  // Productivity
  {
    id: "PRD-B01",
    vertical: "PRD",
    title: "Cross-Channel Executive Priority Digest",
    pitch: "Audits email, calendar, and meeting transcripts together to flag meetings that never got a follow-up, then builds one ranked action plan.",
    nodeChain: ["Schedule 8am weekdays", "Gmail priority", "Calendar last 3 days", "Fireflies transcripts", "Code flag no-follow-up", "Claude ranked action plan", "Sheets append", "Slack DM"],
    tier: "complex",
    priceBand: "$3,500–$4,500",
    sources: ["https://n8n.io/workflows/4723-ai-personal-assistant/"],
    dateAdded: "2026-07-17",
  },
  {
    id: "PRD-B02",
    vertical: "PRD",
    title: "Live Meeting Notetaker → Supabase",
    pitch: "A bot joins the call in real time, transcribes, summarizes, and writes action items straight to the database — no webhook dependency.",
    nodeChain: ["Recall.ai bot joins call", "Real-time transcript stream", "OpenAI summarize+extract", "Supabase/Postgres insert", "Notion/Slack recap"],
    tier: "medium",
    priceBand: "$2,500–$3,500",
    sources: ["https://www.jotform.com/ai/agents/n8n-ai-agent-workflow-example/"],
    dateAdded: "2026-07-17",
  },
  {
    id: "PRD-B03",
    vertical: "PRD",
    title: "Invoice/Receipt Vision Extractor",
    pitch: "Reads incoming invoice PDFs with GPT-4o Vision and appends clean structured rows, flagging low-confidence ones for a human.",
    nodeChain: ["Gmail label watch", "Download PDF", "GPT-4o Vision extract", "IF confidence check", "Sheets append", "Slack flag for review"],
    tier: "medium",
    priceBand: "$2,600–$3,600",
    sources: ["https://www.intuz.com/blog/best-n8n-workflow-templates/", "https://dev.to/emperorakashi20/12-n8n-workflow-templates-you-can-import-and-use-today-2026-edition-2084"],
    dateAdded: "2026-07-17",
  },
  {
    id: "PRD-B04",
    vertical: "PRD",
    title: "Proposal Follow-Up Nudge Timer",
    pitch: "Starts a timer when a proposal goes out and escalates from a Slack reminder to an AI-drafted follow-up if nothing comes back.",
    nodeChain: ["Webhook/Gmail proposal sent", "Wait 3 days", "IF no reply", "Slack reminder", "Wait 4 more days", "Claude draft follow-up", "Gmail draft for review"],
    tier: "simple",
    priceBand: "$1,200–$1,800",
    sources: ["https://www.iloveblogs.blog/guides/n8n-workflow-templates-freelancers"],
    dateAdded: "2026-07-17",
  },
  {
    id: "PRD-B05",
    vertical: "PRD",
    title: "Weekly Ops Report Auto-Compiler",
    pitch: "Pulls Stripe/QuickBooks and CRM data every Monday and drafts a formatted weekly report doc, no manual pull required.",
    nodeChain: ["Schedule Monday AM", "HTTP Request Stripe/QuickBooks", "HTTP Request CRM pipeline", "Code merge+deltas", "Claude draft report", "Google Docs create", "Drive save+Slack link"],
    tier: "complex",
    priceBand: "$3,200–$4,200",
    sources: ["https://www.intuz.com/blog/best-n8n-workflow-templates/"],
    dateAdded: "2026-07-17",
  },

  // Small Business
  {
    id: "SMB-B01",
    vertical: "SMB",
    title: "Pre-Appointment Info/Doc Verification Check",
    pitch: "Checks 48 hours out whether a required doc/deposit/info is on file, and auto-creates a front-desk task if it's missing.",
    nodeChain: ["Schedule daily", "HTTP Request upcoming appts", "IF doc on file?", "Notion/Airtable task create", "Email client reminder"],
    tier: "medium",
    priceBand: "$1,600–$2,400",
    sources: ["https://n8nlab.io/blog/best-n8n-automations-private-practices"],
    dateAdded: "2026-07-17",
  },
  {
    id: "SMB-B02",
    vertical: "SMB",
    title: "Aging-Bucket Billing Escalation Ladder",
    pitch: "Buckets overdue invoices at 14/30/60 days with a progressively firmer tone, and escalates 60-day accounts straight to the owner.",
    nodeChain: ["Schedule weekly", "HTTP Request QuickBooks/Xero overdue", "Code bucket 14/30/60", "Switch 3 branches", "Email polite/firm", "Slack owner escalation"],
    tier: "medium",
    priceBand: "$2,000–$2,800",
    sources: ["https://n8nlab.io/blog/best-n8n-automations-private-practices", "https://www.scalahosting.com/blog/n8n-workflow-templates/"],
    dateAdded: "2026-07-17",
  },
  {
    id: "SMB-B03",
    vertical: "SMB",
    title: "Post-Service Care & Rebooking Nudge",
    pitch: "Sends a personalized care message a day after service, then gently nudges toward rebooking a week later if they haven't already.",
    nodeChain: ["Webhook appt completed", "Wait 24h", "Claude care message", "Email send", "Wait 7 more days", "IF rebooked?", "Email rebooking prompt"],
    tier: "medium",
    priceBand: "$1,600–$2,200",
    sources: ["https://n8nlab.io/blog/best-n8n-automations-private-practices"],
    dateAdded: "2026-07-17",
  },
  {
    id: "SMB-B04",
    vertical: "SMB",
    title: "WhatsApp Instant Confirmation with Tracking/Directions",
    pitch: "Fires an instant WhatsApp confirmation with tracking or directions the moment an order or booking comes in.",
    nodeChain: ["Webhook new order/booking", "Code format details", "WhatsApp Business API send"],
    tier: "simple",
    priceBand: "$900–$1,400",
    sources: ["https://dev.to/emperorakashi20/12-n8n-workflow-templates-you-can-import-and-use-today-2026-edition-2084"],
    dateAdded: "2026-07-17",
  },
  {
    id: "SMB-B05",
    vertical: "SMB",
    title: "New-Client Welcome & Auto-Provisioning",
    pitch: "The moment a contract is signed, provisions the welcome email, Drive client folder, CRM record, and task-manager project — zero manual setup.",
    nodeChain: ["Webhook contract signed", "Gmail welcome email", "Google Drive create folder+subfolders", "CRM create record", "Task manager create project"],
    tier: "medium",
    priceBand: "$1,800–$2,600",
    sources: ["https://www.iloveblogs.blog/guides/n8n-workflow-templates-freelancers"],
    dateAdded: "2026-07-17",
  },
];

export function getBrainstormIdeas(vertical: BrainstormIdea["vertical"]): BrainstormIdea[] {
  return BRAINSTORM_IDEAS.filter((idea) => idea.vertical === vertical);
}
