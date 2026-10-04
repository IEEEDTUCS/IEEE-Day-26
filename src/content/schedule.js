import { events } from "./events";

export const scheduleSection = {
  meta: "16–18 Oct 2026 · DTU & GTBIT",
  // TODO: confirm heading copy with the team
  headingWords: ["Event", "Schedule"],
  headingLabel: "Event schedule",
};

// Schedule content
export const scheduleDays = [
  {
    id: "day-1",
    plate: "Day 01",
    weekday: "Fri",
    date: "16 Oct",
    campus: "DTU campus",
    eventTitles: ["DataHeist", "Dream Forge 3.0", "TinkerCase 4.0"],
  },
  {
    id: "day-2",
    plate: "Day 02",
    weekday: "Sat",
    date: "17 Oct",
    campus: "GTBIT campus",
    eventTitles: [
      "HackSprint",
      "Takeshi's Bots: Robo Maze",
      "Overdrive: Robo Race",
      "Dohyo: Robo Sumo",
    ],
  },
  {
    id: "day-3",
    plate: "Day 03",
    weekday: "Sun",
    date: "18 Oct",
    campus: "GTBIT campus",
    eventTitles: ["The Code Voyage", "Tech Grand Prix"],
  },
];

const TIME = /(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i;
const HOURS = /^([\d.]+)\s*hours?$/i;
const MINUTES = /^([\d.]+)\s*min(?:ute)?s?$/i;

function readStart(event, date) {
  const match = (event.dossier?.facts ?? [])
    .filter((fact) => fact.value.includes(date))
    .map((fact) => TIME.exec(fact.value))
    .find(Boolean);
  if (!match) return null;

  const [, hour, minutes, ampm] = match;
  return {
    time: `${Number(hour)}:${minutes ?? "00"}`,
    ampm: ampm.toUpperCase(),
  };
}

function readDuration(event) {
  const entry = [
    ...(event.dossier?.facts ?? []),
    ...(event.dossier?.specs ?? []),
  ].find((f) => f.label === "Duration");
  if (!entry) return null;

  const hours = HOURS.exec(entry.value);
  if (hours) return `${hours[1]} hrs`;
  const minutes = MINUTES.exec(entry.value);
  if (minutes) return `${minutes[1]} min`;
  // Something the parser hasn't met: show it rather than drop it.
  return entry.value;
}

/** Minutes past midnight, so 1:30 PM sorts after 10:30 AM. Untimed events go last. */
function sortKey(start) {
  if (!start) return Number.POSITIVE_INFINITY;
  const [hour, minutes] = start.time.split(":").map(Number);
  return ((hour % 12) + (start.ampm === "PM" ? 12 : 0)) * 60 + minutes;
}

export function getScheduleDays() {
  return scheduleDays.map((day) => ({
    ...day,
    events: day.eventTitles
      .map((title) => events.find((e) => e.title === title))
      .filter(Boolean)
      .map((event) => ({
        id: event.id,
        title: event.title,
        tag: event.tag,
        tagline: event.tagline,
        teamLabel: event.teamLabel,
        featured: Boolean(event.featured),
        start: readStart(event, day.date),
        duration: readDuration(event),
      }))
      .sort((a, b) => sortKey(a.start) - sortKey(b.start)),
  }));
}
