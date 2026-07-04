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

export interface Vertical {
  code: string;
  name: string;
  icon: LucideIcon;
  buyer: string;
  blurb: string;
  star?: boolean;
  cards: TemplateCard[];
}

export const VERTICALS: Vertical[] = [
  {
    code: "SAL",
    name: "Sales",
    icon: Target,
    buyer: "SDR / AE teams, agencies running outbound, solo closers",
    blurb: "Stop leaking leads between the form and the follow-up.",
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
    blurb: "Recover the revenue your store quietly drops on the floor.",
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
    blurb: "Buy back the hours you lose to copy-paste and triage.",
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
    blurb: "Stop dropping balls between the inquiry and the invoice.",
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
    blurb: "Hit every seller lead first — the flagship play.",
    star: true,
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
