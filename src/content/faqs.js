/**
 * FAQs section content — single source of truth for the accordion.
 * See docs/FAQS_ARCHITECTURE.md (structure), docs/DESIGN_SYSTEM.md (theme),
 * docs/MOTION.md (motion rules).
 *
 * Answers are grounded in real data only: src/content/events.js (dates,
 * team sizes, gear, deadlines, prizes) and src/content/contact.js (leads,
 * emails). The F1 flavour lives in the CHROME — `freq`, `category`,
 * `channel`, `lead` — while questions and answers stay plain English.
 * Never state a fact here that isn't in those files.
 */

import { eventLeads, emails, showEventLeads } from "./contact";

const leadLine = (branch) =>
  (showEventLeads ? eventLeads[branch] : [])
    .map((l) => `${l.name} — ${l.phone}`)
    .join("  ·  ") || "Listed in the site footer";

export const faqsSection = {
  expandAll: "Open all",
  collapseAll: "Close all",
};

export const faqs = [
  {
    id: "eligibility",
    freq: "01",
    category: "Eligibility",
    channel: "0x2A1F",
    question: "Who can take part in IEEE Day 2026?",
    chips: ["All universities", "IEEE & non-IEEE ok", "Cross-college teams"],
    lead: "Who races",
    answer:
      "IEEE Day 2026 is open to engineering students across India — undergraduate, graduate and polytechnic. You don't need to be an IEEE member: IEEE and non-IEEE students race side by side, and teams mixing members from different colleges are welcome.",
    points: [
      {
        icon: "badge",
        title: "Student credential check",
        text: "Carry a valid college student ID — it's checked at on-site registration.",
      },
      {
        icon: "users",
        title: "Mixed crews welcome",
        text: "Teammates from different campuses or branches can race together.",
      },
    ],
    checks: ["Undergrad, grad & polytechnic welcome", "No IEEE membership needed"],
  },
  {
    id: "experience",
    freq: "02",
    category: "Experience",
    channel: "0x489B",
    question: "Do I need prior experience to take part?",
    chips: ["Beginners welcome", "Each card lists its stack"],
    lead: "No experience required",
    answer:
      "Most of the grid is beginner-friendly. Every event card lists what it leans on — Tech Grand Prix needs basic Python and aptitude, HackSprint is about building a web app in six hours, and the robotics events reward time spent tinkering. Read the specs on the card and pick what fits you.",
    checks: ["Starter-friendly events", "Skills listed per event"],
  },
  {
    id: "team-size",
    freq: "03",
    category: "Team composition",
    channel: "0x61C2",
    question: "How big can my team be?",
    chips: ["1 – 5 members", "Varies by event"],
    lead: "Crew size",
    answer:
      "Between one and five, depending on the race. Most events run 2–4, the three robotics events take 3–5, TinkerCase and Dream Forge open up to 1–4, and DataHeist runs 1–3 — so solo drivers have a grid too.",
    facts: [
      { label: "Most events", value: "2 – 4" },
      { label: "Robo events", value: "3 – 5" },
      { label: "TinkerCase / Dream Forge", value: "1 – 4" },
      { label: "DataHeist", value: "1 – 3" },
    ],
  },
  {
    id: "entry-fee",
    freq: "04",
    category: "Entry fee",
    channel: "0x7E01",
    question: "Is there an entry fee?",
    chips: ["Free entry", "No tickets"],
    lead: "Zero fee",
    answer:
      "No — entry is free for all nine events. Registering happens on each event's Unstop page and costs nothing; just turn up ready to race.",
  },
  {
    id: "registration",
    freq: "05",
    category: "Registration",
    channel: "0x8DF4",
    question: "How do I register, and when do entries close?",
    chips: ["Unstop sign-up", "Deadlines vary"],
    lead: "How to enter",
    answer:
      "Tap Register on any event card — it opens that event's Unstop page. Closing dates vary, so check yours:",
    facts: [
      { label: "HackSprint", value: "16 Oct · 7:30 PM" },
      { label: "GTBIT events", value: "17 Oct · 7:30 PM" },
      { label: "DTU online rounds", value: "13 Oct" },
    ],
    goto: "events",
    gotoLabel: "Go to the event grid",
  },
  {
    id: "gear",
    freq: "06",
    category: "Gear & kit",
    channel: "0x9B20",
    question: "What should I bring on the day?",
    chips: ["See the gear row", "Laptop / phone"],
    lead: "What to bring",
    answer:
      "Check the Gear row on each event card before you leave home. HackSprint and TinkerCase expect your own laptop, The Code Voyage runs on a laptop or phone, and DataHeist allows internet during its round.",
  },
  {
    id: "dates-venues",
    freq: "07",
    category: "Circuit & dates",
    channel: "0xC3D7",
    question: "Where is it happening, and when?",
    chips: ["DTU × GTBIT", "16 – 18 Oct"],
    lead: "Two circuits",
    answer:
      "IEEE Day 2026 runs across two campuses. DTU hosts TinkerCase, Dream Forge and DataHeist — online rounds from 10 October, showcase day on 16 October. GTBIT hosts the race weekend: HackSprint and the robotics events on 17 October, then Tech Grand Prix and The Code Voyage on 18 October.",
    facts: [
      { label: "DTU · online + showcase", value: "10 – 16 Oct" },
      { label: "GTBIT · race weekend", value: "17 – 18 Oct" },
    ],
    goto: "contact",
    gotoLabel: "See venues in the footer",
  },
  {
    id: "prizes",
    freq: "08",
    category: "Prizes",
    channel: "0xE514",
    question: "What can my team win?",
    chips: ["₹3,000 + goodies", "Certificates"],
    lead: "Prize pool",
    answer:
      "HackSprint puts up ₹3,000 plus goodies, split across the podium — the winning team and both runner-up spots take home goodies and certificates. For every other event, check its Unstop page for the current prize pool.",
    facts: [
      { label: "HackSprint pool", value: "₹3,000 + goodies" },
      { label: "Podium finishers", value: "Goodies + certificate" },
    ],
  },
  {
    id: "support",
    freq: "09",
    category: "Support",
    channel: "0xF6A9",
    question: "Who do I contact if I'm stuck?",
    chips: ["Leads in the footer", "Two branch emails"],
    lead: "Get in touch",
    answer:
      "Event leads for each campus are listed in the footer with their phone numbers — the quickest way to reach us on event day. You can also email either branch directly.",
    points: [
      {
        icon: "users",
        title: "DTU event leads",
        text: leadLine("dtu"),
      },
      {
        icon: "users",
        title: "GTBIT event leads",
        text: leadLine("gtbit"),
      },
      {
        icon: "mail",
        title: "By email",
        text: `${emails.dtu}  ·  ${emails.gtbit}`,
      },
    ],
    goto: "contact",
    gotoLabel: "Find us in the footer",
  },
];
