import { useMemo } from "react";
import { useMediaQuery } from "../../../hooks";
import { eventsSection } from "../../../content";
import { ORBIT_TILT } from "./useOrbit";
import { EventCard } from "./EventCard";

const CARD_SIZES = {
  small: { w: 172, h: 232 },
  large: { w: 250, h: 320 },
};

/**
 * The stage: 3D ring of cards with the mech pilot standing beneath it.
 *
 * Geometry notes (docs/EVENTS_ARCHITECTURE.md §5):
 * - `perspective` lives on the stage wrapper, `preserve-3d` on the ring — cards
 *   placed at `rotateY(i·slot) translateZ(radius)` fan around a cylinder.
 * - The ring's `transform` is written ONLY by GSAP (useOrbit). React must never
 *   put a `transform` key in the ring's style prop or a re-render would wipe
 *   the live rotation.
 * - Radius derives from card width and count so the ring never self-intersects.
 */
export function OrbitCarousel({
  ringRef,
  events,
  front,
  onSelect,
  onFocusCard,
}) {
  const large = useMediaQuery("(min-width: 768px)");
  const { w: cardW, h: cardH } = large ? CARD_SIZES.large : CARD_SIZES.small;

  const radius = useMemo(() => {
    const n = Math.max(events.length, 1);
    const raw = (cardW / (2 * Math.sin(Math.PI / n))) * 1.18;
    return Math.round(Math.min(Math.max(raw, 260), 620));
  }, [cardW, events.length]);

  // Perspective geometry: the front card sits `radius` toward the viewer (so
  // it projects larger and dips below the ring centre), the back card sits
  // `radius` away (smaller, risen above it). Reserve stage room for BOTH
  // projected edges so nothing clips the stage or wanders into the intro.
  const P = 1400;
  const tiltRad = Math.abs(ORBIT_TILT) * (Math.PI / 180);
  const zFront = radius * Math.cos(tiltRad);
  const frontScale = P / (P - zFront);
  const backScale = P / (P + zFront);
  const dropFront = radius * Math.sin(tiltRad) * frontScale;
  const riseBack = radius * Math.sin(tiltRad) * backScale;
  const halfFront = (cardH / 2) * frontScale;
  const halfBack = (cardH / 2) * backScale;
  const topReserve = Math.ceil(riseBack + halfBack + 8);
  const bottomReserve = Math.ceil(dropFront + halfFront + 24);
  const stageHeight = topReserve + bottomReserve;
  const ringCenter = topReserve;

  return (
    <div className="relative flex flex-col items-center">
      <div
        className="relative z-10 w-full"
        style={{
          height: stageHeight,
          perspective: `${P}px`,
          perspectiveOrigin: `50% ${ringCenter}px`,
        }}
      >
        <div
          ref={ringRef}
          className="absolute left-1/2"
          style={{
            top: ringCenter - cardH / 2,
            width: cardW,
            height: cardH,
            marginLeft: -cardW / 2,
            transform: `rotateX(${ORBIT_TILT}deg) rotateY(0deg)`,
            transformStyle: "preserve-3d",
            willChange: "transform",
            "--n": String(events.length),
            "--radius": `${radius}px`,
          }}
        >
          {events.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              index={index}
              isFront={front === index}
              onFocus={() => onFocusCard(index)}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>

      {/*
        The pilot stands at the very end of the section, pulled up so the
        front of the orbit passes over his head — the ring reads as one scene
        with the figure, not two stacked blocks. Perspective + a slight
        forward tilt on the wrapper make him lean out toward the viewer; the
        entrance/idle motion lives on the img (Events.jsx) so the two never
        fight over the same transform.
      */}
      <div
        aria-hidden="false"
        className="absolute top-0"
        style={{ perspective: "1100px" }}
      >
        <div style={{ transform: "rotate(-2deg) rotateX(-10deg)" }}>
          <img
            data-orbit-figure
            src={eventsSection.figure.src}
            alt={eventsSection.figure.alt}
            width={444}
            height={556}
            loading="lazy"
            decoding="async"
            className="block w-[320px] select-none sm:w-[420px] md:w-[520px] lg:w-[580px]"
          />
        </div>
      </div>
    </div>
  );
}
