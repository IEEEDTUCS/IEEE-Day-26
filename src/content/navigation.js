/** Order here = order of sections on the page. `inNav: false` sections exist but aren't linked. */
export const sections = [
  { id: "home", label: "Home", inNav: true },
  { id: "about", label: "About", inNav: true },
  { id: "events", label: "Events", inNav: true },
  { id: "speakers", label: "Speakers", inNav: true },
  { id: "schedule", label: "Schedule", inNav: true },
  { id: "gallery", label: "Gallery", inNav: true },
  { id: "faqs", label: "FAQs", inNav: true },
  { id: "register", label: "Register", inNav: false },
  { id: "contact", label: "Contact", inNav: false },
];

export const navLinks = sections.filter((s) => s.inNav);
