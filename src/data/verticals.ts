import { Target, ShoppingCart, Zap, Store, Home, type LucideIcon } from "lucide-react";

/**
 * Yawn automation catalog — 5 buyer verticals × 5 productized templates.
 * Ported from the original theWRENCH catalog, rewritten lightly into Yawn's
 * voice. Prices + statuses mirror the master index.
 */

export type CardStatus = "spec" | "slot" | "built";

export interface TemplateCard {
  id: string;
  title: string;
  status: CardStatus;
  outcome: string;
  price: string;
  flagship?: boolean;
}

export interface Faq {
  q: string;
  a: string;
}

export interface Vertical {
  code: string;
  name: string;
  icon: LucideIcon;
  buyer: string;
  blurb: string;
  star?: boolean;
  cards: TemplateCard[];
  faqs: Faq[];
}

export const VERTICALS: Vertical[] = [
  {
    code: "SAL",
    name: "Sales",
    icon: Target,
    buyer: "SDR / AE teams, agencies running outbound, solo closers",
    blurb: "Leads go cold in the gap between the form and the first follow-up — Yawn closes that gap with AI automation that captures, enriches, and works every lead the second it arrives.",
    faqs: [
      { q: "How do I automate lead follow-up so nothing slips through?", a: "Yawn builds an AI multi-touch sequence (email + SMS) that fires the moment a lead comes in, personalizes the opener from the lead's own data, and auto-stops the cadence the instant they reply — so reps only work leads that are actually warm." },
      { q: "What's the fastest way to get inbound leads into my CRM without manual entry?", a: "Our Lead Capture → CRM Auto-Intake automation enriches, deduplicates, and routes every inbound lead into your CRM and pings the owning rep within seconds of the form submit." },
      { q: "How can I stop deals from going stale in my pipeline?", a: "The Stale-Deal / Pipeline-Rot Alerter runs on a schedule and flags every deal that's crossed its activity threshold, grouped by owner, so nothing rots silently in a forgotten stage." },
    ],
    cards: [
      { id: "SAL-01", title: "Lead Capture → CRM Auto-Intake", status: "spec", outcome: "Every inbound lead lands in the CRM — enriched, deduped, and pinged to the rep in seconds. Zero manual entry.", price: "$750–$1,000" },
      { id: "SAL-02", title: "AI Multi-Touch Lead Follow-Up", status: "spec", outcome: "An AI-personalized opener plus an SMS + email cadence that auto-stops and flags the lead Hot the moment they reply.", price: "$1,500–$2,500" },
      { id: "SAL-03", title: "Meeting-Booked → CRM + AI Call-Prep", status: "spec", outcome: "The instant a call is booked, the deal advances and the rep gets a one-page AI prep brief in Slack + email.", price: "$2,000–$3,000" },
      { id: "SAL-04", title: "AI Proposal / Quote Generator", status: "slot", outcome: "From deal notes + line items: an on-brand proposal PDF, logged to the CRM and queued for one-click send + e-sign.", price: "$3,500–$4,500" },
      { id: "SAL-05", title: "Stale-Deal / Pipeline-Rot Alerter", status: "spec", outcome: "A scheduled digest flags every deal past its activity threshold, grouped by owner — nothing rots silently.", price: "$850–$1,200" },
    ],
  },
  {
    code: "ECM",
    name: "E-commerce",
    icon: ShoppingCart,
    buyer: "Shopify / Woo store owners doing $5K+/mo",
    blurb: "Every unrecovered cart and silent low-stock item is revenue your store is quietly dropping — Yawn automates the recovery, restock, and win-back flows that plug those leaks.",
    faqs: [
      { q: "How do I automatically recover abandoned carts?", a: "Yawn's Abandoned Cart Recovery template runs a 3-touch email sequence that escalates to a discount and stops automatically the moment the shopper buys." },
      { q: "How can I get more reviews and UGC from customers without asking manually?", a: "The Post-Purchase Review & UGC Request automation times an ask to happy buyers for a review and photo, while routing unhappy customers to support instead of a public review." },
      { q: "What's the best way to win back customers who haven't reordered?", a: "AI Win-Back / Reactivation finds customers past their typical reorder window and sends AI-personalized offers that reference exactly what they bought before." },
    ],
    cards: [
      { id: "ECM-01", title: "Abandoned Cart Recovery", status: "spec", outcome: "A 3-touch sequence that chases every abandoned cart, escalates to a discount, and stops the second they buy.", price: "$1,000–$1,500" },
      { id: "ECM-02", title: "Post-Purchase Review & UGC Request", status: "spec", outcome: "A timed sequence that asks happy buyers for a review + photo, and routes unhappy ones to support instead.", price: "$1,100–$1,600" },
      { id: "ECM-03", title: "Order-Status & Shipping-Update Comms", status: "built", outcome: "Branded emails at every shipping milestone so customers stop asking 'where's my order?' and tickets drop.", price: "$750–$1,000" },
      { id: "ECM-04", title: "Low-Stock + Restock Alert", status: "spec", outcome: "Real-time low-stock alerts to the owner, plus an automatic 'back in stock' blast to the product waitlist.", price: "$2,000–$3,000" },
      { id: "ECM-05", title: "AI Win-Back / Reactivation", status: "spec", outcome: "Finds customers past their reorder window and sends AI-personalized win-back offers referencing what they bought.", price: "$1,800–$2,800" },
    ],
  },
  {
    code: "PRD",
    name: "Productivity",
    icon: Zap,
    buyer: "Solopreneurs, knowledge workers, ops leads",
    blurb: "Copy-paste and inbox triage quietly eat hours every week — Yawn automates the sorting, drafting, and reporting so you buy those hours back.",
    faqs: [
      { q: "How do I automate email triage so my inbox sorts itself?", a: "AI Email Triage & Response Drafts pre-sorts every email into urgent, follow-up, info, or junk, and drafts a ready-to-edit reply for the ones that actually matter." },
      { q: "How can I turn meeting notes into tasks automatically?", a: "Meeting Transcript → Action Items → Tasks converts a call's action items into real tasks in Notion, ClickUp, or Linear the moment the call ends, with a recap posted to Slack." },
      { q: "Is there a way to get a daily summary of what I need to do?", a: "The 7 AM AI Daily Brief sends one Slack DM each morning covering today's meetings, emails needing a reply, and tasks due — prioritized before you've had coffee." },
    ],
    cards: [
      { id: "PRD-01", title: "AI Email Triage & Response Drafts", status: "spec", outcome: "Every email pre-sorted into urgent / follow-up / info / junk, with a ready-to-edit reply drafted for the ones that matter.", price: "$1,000–$1,500" },
      { id: "PRD-02", title: "Meeting Transcript → Action Items → Tasks", status: "spec", outcome: "The moment a call ends, its action items become real tasks in Notion / ClickUp / Linear, with a recap in Slack.", price: "$1,800–$2,600" },
      { id: "PRD-03", title: "7 AM AI Daily Brief", status: "built", outcome: "One Slack DM at 7 AM: today's meetings, the emails needing a reply, and the tasks due — prioritized before coffee.", price: "$850–$1,200" },
      { id: "PRD-04", title: "Doc & Report Generator", status: "spec", outcome: "A finished, formatted Google Doc generated on schedule from a template + live data, dropped in Drive and linked in Slack.", price: "$2,200–$3,200" },
      { id: "PRD-05", title: "Inbound PDF/File → Structured Data → Sheet", status: "spec", outcome: "Any inbound file is read, fields extracted + validated, and appended as a clean row — low-confidence ones flagged for a human.", price: "$3,600–$4,800" },
    ],
  },
  {
    code: "SMB",
    name: "Small Business",
    icon: Store,
    buyer: "5–50 employee local & service firms",
    blurb: "Inquiries, invoices, and no-shows fall through the cracks without a system watching them — Yawn automates client intake, billing follow-up, and reputation management so nothing gets dropped.",
    faqs: [
      { q: "How do I automate client intake and booking for a service business?", a: "Client Intake → Booking + Confirmation turns every inquiry into a booked or one-click bookable appointment and a logged contact, with zero double entry between your forms and your calendar." },
      { q: "What's the easiest way to get invoices paid faster without chasing manually?", a: "Invoice → Payment → Auto Follow-Up sends polite, branded reminders on unpaid invoices automatically and stops the moment the invoice is paid." },
      { q: "How can I reduce appointment no-shows automatically?", a: "The Appointment No-Show Reducer sends 24-hour and 2-hour reminders with one-tap confirm/reschedule, and nudges no-shows to rebook instead of vanishing from the calendar." },
    ],
    cards: [
      { id: "SMB-01", title: "Client Intake → Booking + Confirmation", status: "spec", outcome: "Every inquiry becomes a booked (or one-click bookable) appointment and a logged contact — with zero double entry.", price: "$750–$1,000" },
      { id: "SMB-02", title: "Invoice → Payment → Auto Follow-Up", status: "spec", outcome: "Every unpaid invoice chases itself with polite branded reminders — and the chasing stops the second it's paid.", price: "$850–$1,200" },
      { id: "SMB-03", title: "New-Hire Onboarding Orchestration", status: "spec", outcome: "Add a hire and the whole Day-1 machine fires: welcome email, accounts checklist, calendar invite, manager heads-up.", price: "$1,500–$2,500" },
      { id: "SMB-04", title: "Review & Reputation Engine", status: "spec", outcome: "Happy customers get nudged to Google/Yelp; unhappy ones get routed to you first — rating climbs, problems caught in private.", price: "$2,000–$3,000" },
      { id: "SMB-05", title: "Appointment No-Show Reducer", status: "spec", outcome: "Reminders at 24h + 2h with one-tap confirm/reschedule — and no-shows get nudged to rebook instead of vanishing.", price: "$850–$1,200" },
    ],
  },
  {
    code: "WHL",
    name: "Wholesaling / REI",
    icon: Home,
    buyer: "Wholesalers, investors, acquisition & dispo teams",
    blurb: "The wholesaler who replies to a seller lead first usually wins the deal — Yawn's flagship automation follows up in seconds, every time, so you're never the second call.",
    star: true,
    faqs: [
      { q: "How do I follow up with seller leads faster than competing wholesalers?", a: "Yawn's AI Lead Follow-Up Sequence sends an instant personalized multi-channel touch to every seller lead, then runs a 14-day cadence that flips the lead to Hot the second they reply." },
      { q: "What's the fastest way to skip-trace a property owner and get their contact info?", a: "Skip-Trace / Owner-Lookup Intake auto-enriches new leads with the owner's phone, email, and mailing address, deduplicates them, and drops them straight into your CRM and follow-up queue." },
      { q: "How can I automate matching a new deal to the right cash buyers?", a: "Cash-Buyer Dispo Blast + Match auto-matches a new deal against your cash-buyer database and blasts it only to buyers whose buy box actually fits, instead of your whole list." },
      { q: "Is there a way to automatically calculate ARV and MAO for a deal?", a: "Deal Analyzer Intake → ARV/MAO Brief takes a submitted address and returns a consistent deal brief with comps, ARV, MAO, and rehab computed, saved as a PDF and logged for the team." },
    ],
    cards: [
      { id: "WHL-01", title: "AI Lead Follow-Up Sequence", status: "built", flagship: true, outcome: "Every seller lead gets an instant personalized multi-channel touch + a 14-day cadence that flips to Hot the second they reply.", price: "$1,250–$1,750" },
      { id: "WHL-02", title: "Cash-Buyer Dispo Blast + Match", status: "spec", outcome: "A new deal auto-matches your cash-buyer database and blasts only buyers whose buy box actually fits.", price: "$2,000–$3,500" },
      { id: "WHL-03", title: "Skip-Trace / Owner-Lookup Intake", status: "spec", outcome: "New leads auto-enriched with owner phone/email/mailing, deduped, and dropped straight into the CRM + follow-up queue.", price: "$2,000–$3,000" },
      { id: "WHL-04", title: "County / Motivated-List Ingestion + Dedupe", status: "spec", outcome: "Weekly lists pulled, normalized, deduped against the CRM, enriched — the genuinely-new records drop into the pipeline.", price: "$850–$1,250" },
      { id: "WHL-05", title: "Deal Analyzer Intake → ARV/MAO Brief", status: "spec", outcome: "Submit an address, get a consistent deal brief: comps pulled, ARV/MAO/rehab computed, saved as PDF and logged.", price: "$3,500–$4,500" },
    ],
  },
];

export function getVertical(code: string): Vertical | undefined {
  return VERTICALS.find((v) => v.code.toLowerCase() === code.toLowerCase());
}

export const STATUS_LABEL: Record<CardStatus, string> = {
  spec: "spec",
  slot: "open slot",
  built: "built",
};
