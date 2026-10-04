/**
 * One FAQ row — broadcast-style accordion tile (docs/FAQS_ARCHITECTURE.md).
 *
 * Collapsed: status strip (FREQ nn // category + channel addr), heavy italic
 * question, red PUSH key. Open: border snaps red, key flips to a minus with an
 * ENGAGED label, and the panel below reveals chips, the answer block (red
 * accent bar), optional facts/points/checklists and an optional jump link.
 *
 * The whole header is one <button> (phrasing content only, no nested
 * interactive elements); the jump link lives inside the panel, which is only
 * tabbable while open (inert when collapsed). Panel motion is a CSS
 * grid-template-rows transition (0fr → 1fr) — layout, but bounded to one row
 * and cheaper than a JS height measure; content fades/rises on top of it.
 */

import { Plus, Minus, Check, Users, Mail, Award, ShieldCheck, ArrowRight } from "lucide-react";
import { scrollToSection } from "../../../motion";

// Point-card icon keys → Lucide components.
const POINT_ICONS = {
  badge: ShieldCheck,
  users: Users,
  mail: Mail,
  award: Award,
};

export function FaqItem({ faq, open, onToggle }) {
  const panelId = `faq-panel-${faq.id}`;
  const buttonId = `faq-button-${faq.id}`;

  const jump = (e) => {
    e.preventDefault();
    scrollToSection(faq.goto);
  };

  return (
    <div
      data-faq-item
      className={`group relative border-2 bg-paper transition-colors duration-(--duration-base) ${
        open ? "border-red" : "border-charcoal hover:border-red"
      }`}
    >
      {/* Status strip — the "frequency header" of the tile */}
      <span
        aria-hidden="true"
        className="flex items-center justify-between gap-3 border-b border-charcoal/15 bg-silver/60 px-4 py-2 sm:px-5"
      >
        <span className="flex items-center gap-2.5">
          <span
            className={`size-2.5 shrink-0 transition-colors duration-(--duration-fast) ${
              open ? "bg-red" : "bg-steel group-hover:bg-red"
            }`}
          />
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-charcoal sm:text-[11px]">
            Freq {faq.freq} <span className="text-charcoal/50">//</span>{" "}
            {faq.category}
          </span>
        </span>
        <span className="hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/75 tabular sm:block">
          Channel addr: {faq.channel}
        </span>
      </span>

      {/* Header button — question + PUSH key */}
      <button
        type="button"
        id={buttonId}
        onClick={() => onToggle(faq.id)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full cursor-pointer items-center gap-4 px-4 py-4 text-left transition-transform duration-(--duration-fast) ease-race sm:gap-6 sm:px-5 sm:py-5"
      >
        <span className="heading min-w-0 flex-1 text-[clamp(1.1rem,2.2vw,1.55rem)] uppercase leading-[1.12] text-charcoal">
          {faq.question}
        </span>

        {/* PUSH / ENGAGED key — decorative, the whole header is the control */}
        <span
          aria-hidden="true"
          className="flex shrink-0 flex-col items-center gap-1.5"
        >
          <span
            className={`grid size-12 place-items-center border-2 transition-colors duration-(--duration-fast) sm:size-14 ${
              open
                ? "border-red bg-paper text-red"
                : "border-red bg-red text-paper group-hover:border-red-deep group-hover:bg-red-deep"
            }`}
          >
            {open ? (
              <Minus size={20} strokeWidth={3} />
            ) : (
              <Plus size={20} strokeWidth={3} />
            )}
          </span>
          <span
            className={`text-[8px] font-bold uppercase tracking-[0.16em] sm:text-[9px] ${
              open ? "text-red" : "text-charcoal/80"
            }`}
          >
            {open ? "Engaged" : "Push"}
          </span>
        </span>
      </button>

      {/* Panel — collapses to 0fr when closed; inert keeps it out of the tab order */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-(--duration-ui) ease-race ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`px-4 pt-1 pb-5 transition-[opacity,transform] duration-(--duration-ui) ease-race sm:px-5 sm:pb-6 ${
              open
                ? "translate-y-0 opacity-100"
                : "translate-y-2 opacity-0"
            }`}
          >
            {/* Chips */}
            <ul className="flex flex-wrap gap-2">
              {faq.chips.map((chip, i) => (
                <li
                  key={chip}
                  className={`border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${
                    i === 0
                      ? "border-red text-red"
                      : "border-charcoal/35 text-charcoal"
                  }`}
                >
                  {chip}
                </li>
              ))}
            </ul>

            {/* Answer block — red accent bar, lead-in label */}
            <p className="mt-4 max-w-[70ch] border-l-4 border-red bg-silver/45 px-4 py-4 text-[15px] leading-relaxed text-charcoal sm:px-5">
              <span className="mr-1 font-extrabold uppercase tracking-[0.04em] text-red">
                {faq.lead}:
              </span>
              {faq.answer}
            </p>

            {/* Facts — timing-board cells */}
            {faq.facts && (
              <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {faq.facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="border border-silver bg-silver/30 px-3 py-2.5"
                  >
                    <dt className="text-[9px] font-semibold uppercase tracking-[0.16em] text-charcoal/75">
                      {fact.label}
                    </dt>
                    <dd className="statement mt-1 text-[13px] text-charcoal">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            {/* Point cards */}
            {faq.points && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {faq.points.map((point) => {
                  const Icon = POINT_ICONS[point.icon] ?? ShieldCheck;
                  return (
                    <div key={point.title} className="border border-silver p-4">
                      <span className="flex items-center gap-2">
                        <Icon
                          size={16}
                          strokeWidth={2.5}
                          className="shrink-0 text-red"
                          aria-hidden="true"
                        />
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-charcoal">
                          {point.title}
                        </span>
                      </span>
                      <span className="mt-2 block text-[13.5px] leading-relaxed text-charcoal/85">
                        {point.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Checklist */}
            {faq.checks && (
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                {faq.checks.map((check) => (
                  <li
                    key={check}
                    className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-charcoal"
                  >
                    <Check
                      size={14}
                      strokeWidth={3}
                      className="shrink-0 text-red"
                      aria-hidden="true"
                    />
                    {check}
                  </li>
                ))}
              </ul>
            )}

            {/* Footer row — jump link + build stamp */}
            <span className="mt-5 flex items-center justify-between gap-4 border-t border-silver pt-3">
              {faq.goto ? (
                <button
                  type="button"
                  onClick={jump}
                  className="group/jump inline-flex cursor-pointer items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-red transition-colors duration-(--duration-fast) hover:text-red-deep"
                >
                  {faq.gotoLabel}
                  <ArrowRight
                    size={14}
                    strokeWidth={3}
                    aria-hidden="true"
                    className="transition-transform duration-(--duration-fast) group-hover/jump:translate-x-1"
                  />
                </button>
              ) : (
                <span />
              )}
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-charcoal/60">
                Verified // IEEE Day 26
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
