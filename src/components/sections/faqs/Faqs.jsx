/**
 * FAQs section — shell + the only piece of section state.
 *
 * State: `openIds` (a Set) lives here; FaqItem is presentational and receives
 * `open` + `onToggle`. Multi-open is deliberate — users can compare answers.
 *
 * Motion (docs/MOTION.md): racing-stripe heading reveal, a one-shot
 * fade/rise stagger on the rows when the section enters view, then only
 * user-driven panel transitions below. No reveals on answer copy (rule 5).
 * ScrollTrigger.refresh() fires after each toggle (rule 8 — an accordion
 * changes page height). Reduced motion skips the entrance entirely; panel
 * transitions collapse to ~0ms via the global reduced-motion rule.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, eases, useReducedMotion } from "../../../motion";
import { faqs, faqsSection } from "../../../content";
import { SectionHeading } from "../../ui";
import { FaqItem } from "./FaqItem";

const HEADING_ID = "faqs-heading";
const REFRESH_MS = 450; // just past the 400ms panel transition

export function Faqs() {
  const scope = useRef(null);
  const reduced = useReducedMotion();
  const [openIds, setOpenIds] = useState(() => new Set());

  const toggle = useCallback((id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const allOpen = openIds.size === faqs.length;

  const toggleAll = useCallback(() => {
    setOpenIds(allOpen ? new Set() : new Set(faqs.map((f) => f.id)));
  }, [allOpen]);

  // Accordion changes page height — refresh triggers after it settles (MOTION rule 8).
  const refreshTimer = useRef(0);
  useEffect(() => {
    clearTimeout(refreshTimer.current);
    refreshTimer.current = setTimeout(() => ScrollTrigger.refresh(), REFRESH_MS);
    return () => clearTimeout(refreshTimer.current);
  }, [openIds]);

  // Section entrance: heading stripe reveal (SectionHeading) + rows rise in.
  // Initial states set here, never in CSS, so no-JS shows everything (rule 3).
  useGSAP(
    () => {
      if (reduced) return;
      const q = gsap.utils.selector(scope);

      gsap.set(q("[data-faq-item]"), { opacity: 0, y: 18 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: scope.current,
            start: "top 78%",
            once: true,
          },
        })
        .to(q("[data-faq-item]"), {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: eases.race,
          stagger: 0.06,
          clearProps: "transform",
        });
    },
    { scope, dependencies: [reduced] },
  );

  return (
    <section
      id="faqs"
      ref={scope}
      aria-labelledby={HEADING_ID}
      className="relative overflow-hidden border-t border-silver bg-paper py-28 sm:py-36"
    >
      <div className="container-page relative z-10">
        <SectionHeading reveal id={HEADING_ID} align="center" start="top 78%">
          Frequently Asked <span className="text-red">Questions</span>
        </SectionHeading>

        <p
          data-faq-item
          className="mx-auto mt-6 max-w-[62ch] text-center text-[17px] leading-relaxed text-charcoal/80"
        >
          {faqsSection.intro}
        </p>

        {/* Multi-open control */}
        <div data-faq-item className="mt-7 flex justify-center">
          <button
            type="button"
            onClick={toggleAll}
            className="cursor-pointer border border-charcoal px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-charcoal transition-colors duration-(--duration-fast) hover:bg-charcoal hover:text-paper"
          >
            {allOpen ? faqsSection.collapseAll : faqsSection.expandAll}
          </button>
        </div>

        {/* The list — stacked tiles, 14px tile gap */}
        <div className="mx-auto mt-10 flex max-w-[70rem] flex-col gap-3.5">
          {faqs.map((faq) => (
            <FaqItem
              key={faq.id}
              faq={faq}
              open={openIds.has(faq.id)}
              onToggle={toggle}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
