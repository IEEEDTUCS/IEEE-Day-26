import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, eases, useReducedMotion } from "../../../motion";
import { events, eventsSection } from "../../../content";
import { SectionHeading } from "../../ui";
import { OrbitCarousel } from "./OrbitCarousel";
import { EventDossier } from "./EventDossier";
import { useOrbit } from "./useOrbit";

/**
 * Events section — the orbit of telemetry cards over VIHAAN, with the event
 * dossier modal. Structure and state ownership: docs/EVENTS_ARCHITECTURE.md.
 *
 * This component owns the section's only state (`selected`); everything else
 * is presentational or lives in useOrbit.
 */
export function Events() {
  const scope = useRef(null);
  const opener = useRef(null);
  const [selected, setSelected] = useState(null);

  const reduced = useReducedMotion();
  const { ringRef, controls } = useOrbit({
    scope,
    count: events.length,
    enabled: selected === null,
  });

  const open = useCallback((event, el) => {
    opener.current = el;
    setSelected(event);
  }, []);

  const close = useCallback(() => setSelected(null), []);

  // The figure changes page height when it loads — refresh triggers (MOTION rule 8).
  useEffect(() => {
    const img = scope.current?.querySelector("[data-orbit-figure]");
    if (!img || img.complete) return undefined;
    const onLoad = () => ScrollTrigger.refresh();
    img.addEventListener("load", onLoad);
    return () => img.removeEventListener("load", onLoad);
  }, []);

  // Section entrance: intro blocks rise, cards fade in staggered, figure lands.
  // Initial states are set here, never in CSS, so no-JS shows everything.
  useGSAP(
    () => {
      if (reduced) return;
      const q = gsap.utils.selector(scope);

      gsap.set(q("[data-events-intro]"), { opacity: 0, y: 14 });
      gsap.set(q("[data-orbit-card]"), { opacity: 0 });
      // Drop in from above — the pilot falls into place, then leans out
      // toward the viewer (static tilt lives on the wrapper in OrbitCarousel).
      gsap.set(q("[data-orbit-figure]"), { opacity: 0, y: -70, rotation: -3 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: scope.current,
            start: "top 75%",
            once: true,
          },
        })
        .to(q("[data-events-intro]"), {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: eases.race,
          stagger: 0.06,
        })
        .to(
          q("[data-orbit-card]"),
          { opacity: 1, duration: 0.6, ease: eases.race, stagger: 0.06 },
          "-=0.2",
        )
        .to(
          q("[data-orbit-figure]"),
          {
            opacity: 1,
            y: 0,
            rotation: 0,
            duration: 0.9,
            ease: "back.out(1.4)",
          },
          "-=0.5",
        )
        // Once landed, the pilot keeps a slow idle hover — alive but not busy.
        .add(() => {
          gsap.to(q("[data-orbit-figure]"), {
            y: -12,
            duration: 1.9,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
          });
        });
    },
    { scope, dependencies: [reduced] },
  );

  return (
    <section
      id="events"
      ref={scope}
      className="relative overflow-hidden border-t border-silver bg-paper pt-28 sm:pt-36"
    >
      <div className="container-page relative z-20">
        <SectionHeading reveal align="center" start="top 75%">
          Explore <span className="text-red">Events</span>
        </SectionHeading>

        <p
          data-events-intro
          className="mx-auto mt-6 max-w-[62ch] text-center text-[17px] leading-relaxed text-charcoal/80"
        >
          {eventsSection.intro}
        </p>

      </div>

      <div className="container-page relative z-10 mt-12 sm:mt-16">
        <OrbitCarousel
          ringRef={ringRef}
          events={events}
          front={controls.front}
          onSelect={open}
          onFocusCard={controls.rotateTo}
        />
      </div>

      {selected && (
        <EventDossier event={selected} returnFocusTo={opener} onClose={close} />
      )}
    </section>
  );
}
