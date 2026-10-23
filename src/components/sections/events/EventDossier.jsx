import { useCallback, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { X } from "lucide-react";
import { gsap, eases, getLenis, useReducedMotion } from "../../../motion";
import { Button } from "../../ui";

const FOCUSABLE =
  'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * The event dossier (docs/card_events.svg) — opens from an orbit card.
 * Modal conventions follow the gallery Lightbox: Lenis stopped and page
 * scroll locked while open (MOTION.md rule 8), focus moved in and trapped,
 * Escape closes, focus restored to the card that opened it.
 */
export function EventDossier({ event, onClose, returnFocusTo }) {
  const scrim = useRef(null);
  const panel = useRef(null);
  const closing = useRef(false);
  const reduced = useReducedMotion();

  const d = event.dossier;
  const number = String(event.number).padStart(2, "0");

  const requestClose = useCallback(() => {
    if (closing.current) return;
    closing.current = true;

    if (reduced || !panel.current || !scrim.current) {
      onClose();
      return;
    }

    gsap
      .timeline({ onComplete: onClose })
      .to(panel.current, { opacity: 0, y: 16, duration: 0.25, ease: eases.snap }, 0)
      .to(scrim.current, { opacity: 0, duration: 0.2, ease: "none" }, 0.05);
  }, [onClose, reduced]);

  // Stop Lenis and lock the page while open (docs/MOTION.md rule 8).
  useEffect(() => {
    const lenis = getLenis();
    lenis?.stop();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      lenis?.start();
    };
  }, []);

  // Focus trap + keyboard. Focus returns to the opener once we've unmounted.
  useEffect(() => {
    const el = panel.current;
    const previouslyFocused = returnFocusTo?.current ?? document.activeElement;

    Array.from(el?.querySelectorAll(FOCUSABLE) ?? [])
      .find((n) => n.offsetParent !== null)
      ?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        requestClose();
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = Array.from(el.querySelectorAll(FOCUSABLE)).filter(
        (n) => n.offsetParent !== null,
      );
      if (!nodes.length) return;
      const firstNode = nodes[0];
      const lastNode = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === firstNode) {
        e.preventDefault();
        lastNode.focus();
      } else if (!e.shiftKey && document.activeElement === lastNode) {
        e.preventDefault();
        firstNode.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
  }, [requestClose, returnFocusTo]);

  // Open: scrim fades, panel rises into place.
  useGSAP(
    () => {
      if (reduced) return;
      gsap.from(scrim.current, { opacity: 0, duration: 0.2, ease: "none" });
      gsap.from(panel.current, { opacity: 0, y: 24, duration: 0.5, ease: eases.race });
    },
    { scope: panel },
  );

  return (
    <div
      ref={scrim}
      onClick={requestClose}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-charcoal/85 p-2 sm:p-6"
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dossier-title"
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        className="relative my-auto max-h-[calc(100dvh-2rem)] w-full max-w-4xl overflow-y-auto overscroll-contain border-2 border-charcoal bg-paper data-lenis-prevent sm:max-h-[calc(100dvh-3rem)]"
      >
        {/* Header — red broadcast bar with chips */}
        <div className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b-2 border-charcoal bg-red px-3 py-2.5 sm:px-4">
          <div className="flex items-center gap-2">
            <span className="border border-white/30 bg-charcoal px-2.5 py-1 text-[11px] font-bold tabular leading-tight text-paper">
              #{number}
            </span>
            <span className="border border-white/30 bg-charcoal px-2.5 py-1 text-[10px] font-extrabold uppercase leading-tight tracking-[0.18em] text-silver">
              {event.campus}
            </span>
            <span className="bg-paper px-2.5 py-1 text-[10px] font-bold uppercase leading-tight tracking-[0.18em] text-charcoal">
              {event.tag}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={requestClose}
              aria-label="Close event dossier"
              className="grid h-9 w-9 shrink-0 place-items-center border border-paper/70 text-paper transition-colors duration-(--duration-fast) hover:bg-paper hover:text-red"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Meta strip */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 border-b-2 border-charcoal px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] sm:px-6">
          <span>
            <span className="text-charcoal/60">Campus: </span>
            <strong className="text-red">{event.campus}</strong>
          </span>
          <span>
            <span className="text-charcoal/60">Circuit: </span>
            {d.circuit}
          </span>
          <span>
            <span className="text-charcoal/60">Discipline: </span>
            {d.discipline}
          </span>
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="h-2 w-2 bg-red" />
            {d.status}
          </span>
        </div>

        <div className="space-y-5 px-4 py-5 sm:px-6 lg:px-8">
          {/* Title block */}
          <div>
            <span aria-hidden="true" className="block h-1.5 w-16 bg-red-deep" />
            <h3
              id="dossier-title"
              className="heading mt-1.5 text-[clamp(2rem,5vw,3.5rem)] uppercase leading-[0.95] text-charcoal"
            >
              {event.title}
            </h3>
            <p className="mt-2 max-w-[68ch] text-base font-medium text-charcoal/85">
              {event.subtitle}
            </p>
          </div>

          <div className="grid items-start gap-5 lg:grid-cols-[1.55fr_1fr]">
            {/* Left: facts + brief */}
            <div className="space-y-5">
              {d.facts?.length ? (
                <dl className="grid grid-cols-3 border-2 border-charcoal">
                  {d.facts.map((fact, i) => (
                    <div
                      key={fact.label}
                      className={`px-2 py-3 text-center sm:px-3 ${
                        i > 0 ? "border-l-2 border-charcoal" : ""
                      }`}
                    >
                      <dt className="text-[9px] font-semibold uppercase tracking-[0.16em] text-charcoal/60">
                        {fact.label}
                      </dt>
                      <dd className="mt-1 text-sm font-bold text-charcoal">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              {/* Telemetry brief */}
              <div>
                <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-charcoal">
                  <span aria-hidden="true" className="h-3 w-1.5 bg-red" />
                  Telemetry brief // {event.tag}
                </p>
                <p className="mt-3 max-w-[68ch] text-[15px] leading-relaxed text-charcoal/85">
                  {d.brief}
                </p>
              </div>
            </div>

            {/* Right: prize, podium, specs */}
            <div className="border-2 border-charcoal">
              {d.prize?.total ? (
                <div className="border-b-2 border-charcoal bg-charcoal px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-silver">
                    {d.prize.label ?? "Prize pool"}
                  </p>
                  <p className="heading mt-1 text-3xl tabular text-red-bright">
                    {d.prize.total}
                  </p>
                </div>
              ) : (
                <a
                  href={event.register}
                  target="_blank"
                  rel="noreferrer"
                  className="group block border-b-2 border-charcoal bg-charcoal px-4 py-3 transition-colors hover:bg-red-deep"
                  aria-label={`Register for ${event.title} on Unstop`}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-silver group-hover:text-paper">
                    Registration
                  </p>
                  <p className="heading mt-1 flex items-center justify-between text-2xl text-paper group-hover:text-paper">
                    <span>Open on Unstop</span>
                    <span className="text-red-bright group-hover:text-paper">↗</span>
                  </p>
                </a>
              )}

              <ul className="divide-y divide-charcoal/15">
                {(d.prize?.podium ?? []).map((row) => (
                  <li key={row.place} className="flex items-center justify-between gap-3 px-4 py-2.5">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal">
                      {row.place}
                    </span>
                    <span className="text-sm font-bold tabular text-charcoal">{row.value}</span>
                  </li>
                ))}
              </ul>

              {d.specs?.length ? (
                <dl className="grid grid-cols-3 border-t-2 border-charcoal">
                  {d.specs.map((spec, i) => (
                    <div
                      key={spec.label}
                      className={`px-2 py-3 text-center ${i > 0 ? "border-l-2 border-charcoal" : ""}`}
                    >
                      <dt className="text-[9px] font-semibold uppercase tracking-[0.14em] text-charcoal/60">
                        {spec.label}
                      </dt>
                      <dd className="mt-1 text-[12px] font-bold text-charcoal">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
          </div>

          {/* Scrutineering rounds */}
          {d.rounds?.length ? (
            <div className="border-2 border-charcoal">
              <div className="border-b-2 border-charcoal bg-charcoal px-4 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-paper">
                  Scrutineering rounds
                </p>
              </div>
              <ol className="divide-y divide-charcoal/15">
                {d.rounds.map((round) => (
                  <li key={round.id} className="flex items-center gap-4 px-4 py-3">
                    <span className="shrink-0 bg-red px-2 py-1 text-[10px] font-bold leading-tight text-paper">
                      {round.id}
                    </span>
                    <span className="flex-1 text-sm font-medium text-charcoal">{round.title}</span>
                    <span className="shrink-0 text-[11px] font-bold uppercase tabular tracking-[0.12em] text-red">
                      {round.checkpoint}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-4 border-t-2 border-charcoal px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal">
            <span aria-hidden="true" className="h-2 w-2 shrink-0 bg-red" />
            {d.closesAt ? `Grid closing: ${d.closesAt}` : `Register on Unstop — see event page for deadlines`}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" onClick={requestClose}>
              Close
            </Button>
            {d.rulebook?.href ? (
              <Button
                variant="secondary"
                href={d.rulebook.href}
                target="_blank"
                rel="noreferrer"
                trailing="↗"
              >
                {d.rulebook.label}
              </Button>
            ) : null}
            <Button
              variant="primary"
              href={event.register}
              target="_blank"
              rel="noreferrer"
              trailing="↗"
            >
              Register for {event.title}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
