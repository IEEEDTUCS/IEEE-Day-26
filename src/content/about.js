// About section content

import { event } from "./contact";

const [dateRange, ...dateRest] = event.dateLabel.split(" ");

export const about = {
  kicker: "Pre-race briefing",

  title: { tag: "About", word1: "IEEE", word2: "Day" },

  whatIs: {
    heading: "What is IEEE Day?",
    body: "IEEE Day celebrates the first time IEEE’s founding engineers came together to share technical ideas, in 1884. Every October, IEEE members, sections and student branches around the world mark it with talks, workshops and competitions.",
  },

  date: {
    label: "Race timetable",
    range: dateRange,
    monthYear: dateRest.join(" "),
    days: ["16", "17", "18"],
    ariaLabel: "16, 17 and 18 October",
  },

  stats: [
    { value: 10, suffix: "+", label: "Events", accent: true },
    { value: 3, label: "Days" },
    { value: 2, label: "Student branches" },
  ],

  alliance: {
    label: "Co-host alliance",
    heading: "Jointly hosted",
    headingAccent: "by",
    body: "IEEE Day 2026 is organised together by the IEEE Student Branches of Delhi Technological University and Guru Tegh Bahadur Institute of Technology.",
  },

  hostCards: [
    {
      hostId: "dtu",
      tag: "Host 01",
      blurb:
        "Drives technical innovation and research through student projects, events and hands-on learning.",
    },
    {
      hostId: "gtbit",
      tag: "Host 02",
      blurb:
        "Empowers students through technical initiatives, collaborative projects and room to grow.",
    },
  ],

  cta: { label: "Explore events", targetId: "events" },

  todoBlurb: (name) => `[TODO: 1–2 lines from ${name}]`,
};
