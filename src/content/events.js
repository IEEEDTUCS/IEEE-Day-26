/**
 * Events section content — the single source of truth for the orbit and dossier.
 * See docs/EVENTS_ARCHITECTURE.md §1/§7 (schema) and
 * docs/EVENTS_IMPLEMENTATION_PLAN.md §3 (extraction provenance).
 *
 * All nine events are REAL, extracted from the two Unstop fest pages:
 *  GTBIT — unstop.com/college-fests/ieee-day-2026-...-gtbit-517795
 *  DTU   — unstop.com/college-fests/ieee-day-2026-...-dtu-new-delhi-514223
 * `register` links point at each event's Unstop page. Omitted dossier fields
 * (prize, rounds, closesAt, rulebook) must render as hidden rows, never fakes.
 */

export const eventsSection = {
  intro:
    "IEEE Day 2026 runs across two campuses — DTU and GTBIT. Click any telemetry card for the full dossier, or hit Register straight from the card.",
  figure: {
    src: "/images/events/mech-pilot.png",
    alt: "VIHAAN, the cyber racing mech pilot rig, standing beneath the event orbit",
  },
};

export const events = [
  {
    id: "tech-grand-prix",
    number: 1,
    title: "Tech Grand Prix",
    tag: "Flagship",
    featured: true,
    tagline: "F1-style tech treasure hunt",
    subtitle:
      "An F1-themed on-ground treasure hunt — interconnected technical challenges where every correct solution unlocks the next leg of the race. Think fast, solve smart, hunt the QR.",
    dateLabel: "18 Oct",
    teamLabel: "2–4",
    register:
      "https://unstop.com/hackathons/tech-grand-prix-ieee-day-2026-guru-tegh-bahadur-institute-of-technology-gtbit-new-delhi-1763814",
    dossier: {
      circuit: "TRACK #01",
      discipline: "On-ground technical treasure hunt",
      status: "REGISTRATIONS OPEN",
      brief:
        "Teams race through a campus-wide chain of technical challenges: scan the starting QR, solve the task, submit the answer, follow the riddle to the next station. Every correct solution unlocks the next stage — first team to the finish takes the chequered flag.",
      facts: [
        { label: "Date", value: "18 Oct, 1:30 PM" },
        { label: "Team", value: "2 – 4" },
        { label: "Mode", value: "Offline · GTBIT" },
      ],
      specs: [
        { label: "Stack", value: "Python basics" },
        { label: "Format", value: "QR hunt" },
        { label: "Also", value: "Logic · Aptitude" },
      ],
      rounds: [
        {
          id: "R_01",
          title: "Scan the starting QR — first challenge",
          checkpoint: "Start",
        },
        {
          id: "R_02",
          title: "Solve and submit through Google Forms",
          checkpoint: "Relay",
        },
        {
          id: "R_03",
          title: "Riddle relay through the campus",
          checkpoint: "Finish",
        },
      ],
      closesAt: "20 October 2026 | 09:59 PM IST",
    },
  },
  {
    id: "hacksprint",
    number: 2,
    title: "HackSprint",
    tag: "Hackathon",
    tagline: "6-hour build-to-deploy sprint",
    subtitle:
      "A 6-hour hackathon taking teams from ideation to a working web app — with a surprise mid-race challenge that forces you to rethink and adapt.",
    dateLabel: "17 Oct",
    teamLabel: "2–4",
    register:
      "https://unstop.com/hackathons/hacksprint-guru-tegh-bahadur-institute-of-technology-gtbit-new-delhi-1760430",
    dossier: {
      circuit: "TRACK #02",
      discipline: "6-hour web hackathon",
      status: "REGISTRATIONS OPEN",
      brief:
        "Teams get a challenge domain and six hours to turn an idea into a working web application. Halfway through, a surprise challenge lands that forces a rethink — how creatively your team adapts could make all the difference. Ideation, development, deployment, pitch: the full journey in one sprint.",
      facts: [
        { label: "Date", value: "17 Oct, 10:00 AM" },
        { label: "Duration", value: "6 Hours" },
        { label: "Team", value: "2 – 4" },
      ],
      prize: {
        total: "₹3,000 + goodies",
        podium: [
          { place: "Winner", value: "Goodies + Certificate" },
          { place: "First runner-up", value: "Goodies + Certificate" },
          { place: "Second runner-up", value: "Goodies + Certificate" },
        ],
      },
      specs: [
        { label: "Build", value: "Web app" },
        { label: "Twist", value: "Surprise round" },
        { label: "Gear", value: "Own laptop" },
      ],
      rounds: [
        { id: "R_01", title: "Ideation & build sprint", checkpoint: "H+0" },
        {
          id: "R_02",
          title: "Surprise challenge drop — adapt the solution",
          checkpoint: "H+3",
        },
        {
          id: "R_03",
          title: "Deployment & pitch to the pit wall",
          checkpoint: "H+6",
        },
      ],
      closesAt: "16 October 2026 | 07:30 PM IST",
    },
  },
  {
    id: "code-voyage",
    number: 3,
    title: "The Code Voyage",
    tag: "Coding",
    tagline: "Pirate-themed coding battle",
    subtitle:
      "Two rounds — navigate a grid-based problem in pseudocode, then battle through a high-stakes technical bidding round where every decision shapes the score.",
    dateLabel: "18 Oct",
    teamLabel: "2–4",
    register:
      "https://unstop.com/hackathons/the-code-voyage-ieee-day-2026-guru-tegh-bahadur-institute-of-technology-gtbit-new-delhi-1763810",
    dossier: {
      circuit: "TRACK #03",
      discipline: "Two-round coding challenge",
      status: "REGISTRATIONS OPEN",
      brief:
        "CODE VOYAGE tests logic, pseudocode, technical knowledge and strategy across two rounds. Teams navigate a grid-based problem, then fight through a technical bidding round — navigate the code, master the challenge, claim the voyage.",
      facts: [
        { label: "Date", value: "18 Oct, 10:30 AM" },
        { label: "Rounds", value: "2" },
        { label: "Team", value: "2 – 4" },
      ],
      specs: [
        { label: "Submit", value: "Pseudocode" },
        { label: "Round 2", value: "Tech bidding" },
        { label: "Gear", value: "Laptop / phone" },
      ],
      rounds: [
        {
          id: "R_01",
          title: "Grid navigation — solve the path in pseudocode",
          checkpoint: "Round 1",
        },
        { id: "R_02", title: "Technical bidding round", checkpoint: "Round 2" },
      ],
      closesAt: "20 October 2026 | 09:59 PM IST",
    },
  },
  {
    id: "robo-maze",
    number: 4,
    title: "Takeshi's Bots: Robo Maze",
    tag: "Robotics",
    tagline: "Autonomous maze navigation",
    subtitle:
      "A fully autonomous robot navigates a covered 3 × 3 m maze — three attempts, five minutes each, fastest clean run conquers the castle.",
    dateLabel: "17 Oct",
    teamLabel: "3–5",
    register:
      "https://unstop.com/hackathons/takeshis-bots-robo-maze-ieee-day-2026-guru-tegh-bahadur-institute-of-technology-gtbit-new-delhi-1761786",
    dossier: {
      circuit: "TRACK #04",
      discipline: "Autonomous maze navigation",
      status: "REGISTRATIONS OPEN",
      brief:
        "Fully autonomous maze navigation testing accuracy, sensing, path planning and decision-making. Robots must independently cross a covered 3 × 3 m maze, beat the dead ends and reach the centre finish with no human or remote intervention. Navigate. Survive. Conquer the castle.",
      facts: [
        { label: "Date", value: "17 Oct, 4:00 PM" },
        { label: "Duration", value: "2 Hours" },
        { label: "Team", value: "3 – 5" },
      ],
      specs: [
        { label: "Maze", value: "3 × 3 m" },
        { label: "Run limit", value: "5 minutes" },
        { label: "Control", value: "Autonomous" },
      ],
      rounds: [
        {
          id: "R_01",
          title: "Attempt 1 — best valid time counts",
          checkpoint: "3 × 5 min",
        },
        { id: "R_02", title: "Attempt 2", checkpoint: "3 × 5 min" },
        { id: "R_03", title: "Attempt 3 — final run", checkpoint: "3 × 5 min" },
      ],
      closesAt: "20 October 2026 | 09:59 PM IST",
    },
  },
  {
    id: "robo-race",
    number: 5,
    title: "Overdrive: Robo Race",
    tag: "Robotics",
    tagline: "F1-style rover race",
    subtitle:
      "Wireless rovers race a Melbourne F1-style track with ramps, rollers, gravel pits and airborne sections — three laps per attempt, two attempts per team.",
    dateLabel: "17 Oct",
    teamLabel: "3–5",
    register:
      "https://unstop.com/hackathons/overdrive-robo-race-ieee-day-2026-guru-tegh-bahadur-institute-of-technology-gtbit-new-delhi-1761818",
    dossier: {
      circuit: "TRACK #05",
      discipline: "Wireless rover racing",
      status: "REGISTRATIONS OPEN",
      brief:
        "A high-speed wireless rover race testing speed, precision and control. Teams run a Melbourne F1-style track featuring ramps, rollers, gravel pits and airborne sections. Three laps per attempt, two attempts per team — balance aggressive driving with precision and avoid penalties. Accelerate. Control. Conquer.",
      facts: [
        { label: "Date", value: "17 Oct, 4:00 PM" },
        { label: "Duration", value: "2 Hours" },
        { label: "Team", value: "3 – 5" },
      ],
      specs: [
        { label: "Track", value: "F1-style" },
        { label: "Laps", value: "3 / attempt" },
        { label: "Control", value: "Wireless" },
      ],
      rounds: [
        {
          id: "R_01",
          title: "Attempt 1 — three laps, penalties apply",
          checkpoint: "2 attempts",
        },
        {
          id: "R_02",
          title: "Attempt 2 — best valid run counts",
          checkpoint: "2 attempts",
        },
      ],
      closesAt: "20 October 2026 | 09:59 PM IST",
    },
  },
  {
    id: "robo-sumo",
    number: 6,
    title: "Dohyo: Robo Sumo",
    tag: "Robotics",
    tagline: "Head-to-head robo combat",
    subtitle:
      "Two remote-controlled bots in a circular arena — push the opponent out or immobilise it across two-minute knockout matches.",
    dateLabel: "17 Oct",
    teamLabel: "3–5",
    register:
      "https://unstop.com/hackathons/dohyo-robo-sumo-ieee-day-2026-guru-tegh-bahadur-institute-of-technology-gtbit-new-delhi-1761820",
    dossier: {
      circuit: "TRACK #06",
      discipline: "Remote-control sumo",
      status: "REGISTRATIONS OPEN",
      brief:
        "A head-to-head pushing competition that puts power, traction, control and strategy to the test. Two remotely controlled robots face off in a circular arena — push the opponent completely outside the boundary or immobilise it. Two-minute matches, knockout rounds: every push decides the winner.",
      facts: [
        { label: "Date", value: "17 Oct, 4:30 PM" },
        { label: "Duration", value: "2 Hours" },
        { label: "Team", value: "3 – 5" },
      ],
      specs: [
        { label: "Arena", value: "Circular" },
        { label: "Match", value: "2 minutes" },
        { label: "Control", value: "Remote" },
      ],
      rounds: [
        {
          id: "R_01",
          title: "Group matches — best push record advances",
          checkpoint: "2 min",
        },
        { id: "R_02", title: "Knockout bracket & final", checkpoint: "KO" },
      ],
      closesAt: "20 October 2026 | 09:59 PM IST",
    },
  },
  {
    id: "tinkercase",
    number: 7,
    title: "TinkerCase 4.0",
    tag: "Hardware",
    tagline: "Hardware showcase & core electronics",
    subtitle:
      "IEEE DTU's hardware showcase: submit your idea online in a four-slide deck, then bring a fully assembled project to the on-campus showcase.",
    dateLabel: "10–16 Oct",
    teamLabel: "1–4",
    register:
      "https://unstop.com/competitions/tinkercase-40-ieee-day-2026-dtu-new-delhi-1755319",
    dossier: {
      circuit: "TRACK #07",
      discipline: "Hardware showcase & core electronics",
      status: "REGISTRATIONS OPEN",
      brief:
        "TinkerCase 4.0 is IEEE DTU's hardware showcase. Round one is an online idea submission (max four slides) via Unstop; qualified teams bring fully assembled hardware to the on-campus showcase — no assembly time on site. Seven tracks run in parallel, from green electronics to VLSI and open innovation.",
      facts: [
        { label: "Idea round", value: "10 Oct, 10 AM – 5 PM, online" },
        { label: "Showcase", value: "16 Oct, 1:00 PM, campus" },
        { label: "Team", value: "1 – 4" },
      ],
      specs: [
        { label: "Tracks", value: "7" },
        { label: "Deck", value: "≤ 4 slides" },
        { label: "Gear", value: "Own laptop" },
      ],
      rounds: [
        {
          id: "R_01",
          title: "Idea submission — online PPT via Unstop",
          checkpoint: "10 Oct",
        },
        {
          id: "R_02",
          title: "Hardware showcase — on-campus, assembled",
          checkpoint: "16 Oct",
        },
      ],
    },
  },
  {
    id: "dream-forge",
    number: 8,
    title: "Dream Forge 3.0",
    tag: "Case Study",
    tagline: "Real-world case study challenge",
    subtitle:
      "A case competition where teams solve a real-world business problem on the spot — online quiz, case breakdown, then a jury pitch.",
    dateLabel: "10–16 Oct",
    teamLabel: "1–4",
    register:
      "https://unstop.com/competitions/dream-forge-30-ieee-day-2026-dtu-new-delhi-1755311",
    dossier: {
      circuit: "TRACK #08",
      discipline: "Case study challenge",
      status: "REGISTRATIONS OPEN",
      brief:
        "Dream Forge 3.0 ignites the problem-solving and entrepreneurial mindset. It opens with an online quiz on business, innovation and current affairs (team leader only), then qualified teams receive a real-world business problem on the spot, prepare a PPT and pitch it to the jury the same day.",
      facts: [
        { label: "Quiz", value: "10 Oct, 10 AM – midnight, online" },
        { label: "Finals", value: "16 Oct, 11:00 AM, campus" },
        { label: "Team", value: "1 – 4" },
      ],
      specs: [
        { label: "Rounds", value: "3" },
        { label: "Quiz by", value: "Team leader" },
        { label: "Eligibility", value: "Cross-college" },
      ],
      rounds: [
        {
          id: "R_01",
          title: "Preliminary round — online quiz on Unstop",
          checkpoint: "10 Oct",
        },
        {
          id: "R_02",
          title: "Case problem & PPT preparation, on-campus",
          checkpoint: "16 Oct",
        },
        {
          id: "R_03",
          title: "Final PPT presentations before the jury",
          checkpoint: "16 Oct",
        },
      ],
      closesAt: "15 October 2026",
    },
  },
  {
    id: "dataheist",
    number: 9,
    title: "DataHeist",
    tag: "CTF & ML",
    tagline: "4-hour CTF × ML challenge",
    subtitle:
      "Crack a chain of challenges to uncover and validate datasets, then build the best predictive model for a real-world problem — all in four hours.",
    dateLabel: "13–16 Oct",
    teamLabel: "1–3",
    register:
      "https://unstop.com/hackathons/dataheist-ieee-day-2026-dtu-new-delhi-1755310",
    dossier: {
      circuit: "TRACK #09",
      discipline: "CTF × machine learning",
      status: "REGISTRATIONS OPEN",
      brief:
        "DataHeist is a four-hour CTF × machine-learning challenge: teams crack a series of challenges to uncover datasets, identify which data is useful, and build the best predictive model for a real-world problem. An online quiz on ML, basic CTF and statistics gates the offline round.",
      facts: [
        { label: "Quiz", value: "13 Oct, 10 AM – 2 PM, online" },
        { label: "Finals", value: "16 Oct, 11:00 AM" },
        { label: "Team", value: "1 – 3" },
      ],
      specs: [
        { label: "Duration", value: "4 hours" },
        { label: "Stack", value: "ML + CTF" },
        { label: "Internet", value: "Allowed" },
      ],
      rounds: [
        {
          id: "R_01",
          title: "Online quiz — ML, basic CTF, statistics",
          checkpoint: "13 Oct",
        },
        {
          id: "R_02",
          title: "Offline round — crack, clean, predict",
          checkpoint: "16 Oct",
        },
      ],
    },
  },
];
