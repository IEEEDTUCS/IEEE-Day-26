// Footer, nav logos and shared host data

export const event = {
  name: "IEEE Day",
  year: 2026,
  dateLabel: "16–18 Oct 2026",
};

export const hosts = [
  {
    id: "dtu",
    name: "IEEE DTU SB",
    shortName: "DTU",
    logo: {
      src: "/logos/ieee_dtu_white.png",
      alt: "Delhi Technological University IEEE Student Branch",
      width: 160,
      height: 44,
    },
    navMark: {
      src: "/logos/ieee-dtu-sb-nav.webp",
      alt: "Delhi Technological University IEEE Student Branch",
      width: 398,
      height: 108,
    },
    navSeal: {
      src: "/logos/dtu-seal-nav.webp",
      alt: "Delhi Technological University",
      width: 120,
      height: 120,
    },
    socials: {
      instagram: "https://www.instagram.com/ieee.dtu",
      linkedin: "https://www.linkedin.com/company/ieee-dtu/",
      facebook: "https://www.facebook.com/ieeedtu",
    },
  },
  {
    id: "gtbit",
    name: "IEEE GTBIT SB",
    shortName: "GTBIT",
    logo: {
      src: "/logos/ieee_gtbit_white.png",
      alt: "IEEE GTBIT Student Branch",
      width: 52,
      height: 52,
    },
    navMark: {
      src: "/logos/ieee-gtbit-sb-nav.webp",
      alt: "IEEE GTBIT Student Branch",
      width: 120,
      height: 120,
    },
    navSeal: {
      src: "/logos/gtbit-seal-nav.webp",
      alt: "Guru Tegh Bahadur Institute of Technology",
      width: 120,
      height: 120,
    },
    socials: {
      instagram: "https://www.instagram.com/ieeegtbit",
      linkedin:
        "https://www.linkedin.com/company/ieee-student-branch-at-gtbit/",
      facebook: "https://www.facebook.com/ieeegtbit",
    },
  },
];

// Linktree
export const linktree = {
  label: "Know more",
  href: "https://ieeedtu.in/ieee-day/linktree",
};

// Show event switch
export const showEventLeads = true;

export const eventLeads = {
  dtu: [
    { name: "Mayank Kanojia", phone: "+91 92501 10578" },
    { name: "Prashay Joon", phone: "+91 70425 27004" },
  ],
  gtbit: [
    { name: "Gurprajas Kaur Saluja", phone: "+91 93199 62424" },
    { name: "Prathamjot Singh Bharaj", phone: "+91 98117 98407" },
    { name: "Maiesha Mehra", phone: "+91 98991 18656" },
  ],
};

// Placeholder slots shown while a branch's list is EMPTY. A branch that has
// leads shows exactly those, so two leads never trail a stray third slot.
export const LEAD_SLOTS = 3;

export const venues = [
  {
    id: "dtu",
    label: "DTU campus",
    name: "Delhi Technological University",
    lines: ["Shahbad Daulatpur, Main Bawana Road,", "Delhi-110042, India"],
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Delhi+Technological+University",
  },
  {
    id: "gtbit",
    label: "GTBIT campus",
    name: "Guru Tegh Bahadur Institute of Technology",
    // TODO: confirm this address with IEEE GTBIT SB
    lines: ["G-8 Area, Rajouri Garden,", "New Delhi-110064, India"],
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Guru+Tegh+Bahadur+Institute+of+Technology",
  },
];

export const emails = {
  dtu: "contact@ieeedtu.in",
  gtbit: "contact@gtbit.ac.in",
};

export const copyright = "© 2026 IEEE DTU SB × IEEE GTBIT SB";

export const footerCopy = {
  landmark: "Site footer",
  hostedBy: "Hosted by",
  backToTop: "Back to top",
  followUs: "Follow us",
  eventLeads: "Event leads",
  eventVenue: "Event venue",
  email: "Email",
  directions: "Directions",
  navLabel: "Footer",

  socialLabel: (branch, network) => `${branch} on ${network}`,

  socialTodo: (branch, network) => `TODO: ${branch} ${network} URL`,
  linktreeLabel: "Know more — opens our Linktree in a new tab",
  linktreeTodo: "TODO: Linktree URL",

  directionsLabel: (name, label) =>
    `${label}: ${name} on Google Maps, opens in a new tab`,
  todo: {
    leadName: (branch, n) => `[TODO: ${branch} lead ${n}]`,
    leadPhone: "[TODO: phone]",

    email: (branch) => `[TODO: ${branch} SB email]`,
  },
};
