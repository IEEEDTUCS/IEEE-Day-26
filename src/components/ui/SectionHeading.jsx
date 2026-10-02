// Fixed section heading component to reuse
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, eases, useReducedMotion } from "../../motion";

export function SectionHeading({
  children,
  id,
  align = "center",
  reveal = false,
  bar = true,
  // Overridable so a dark section can set its own size and colour. The default
  // is what every light section renders today — don't change it.
  headingClassName = "text-h2 text-charcoal",
  // Where the reveal fires, and how far into that moment. A section with its
  // own entrance passes its own start so the stripe lands on the same beat.
  start = "top 80%",
  delay = 0,
  className = "",
}) {
  const scope = useRef(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!reveal || reduced) return;
      const text = scope.current.querySelector("[data-heading-text]");
      const stripe = scope.current.querySelector("[data-heading-stripe]");

      gsap.set(text, { opacity: 0, x: 20, skewX: -6 });
      gsap.set(stripe, { scaleX: 0, transformOrigin: "left center" });

      gsap
        .timeline({
          delay,
          scrollTrigger: {
            trigger: scope.current,
            start,
            once: true,
          },
        })
        .to(stripe, { scaleX: 1, duration: 0.42, ease: eases.snap })
        .set(text, { opacity: 1 })
        .to(text, { x: 0, skewX: 0, duration: 0.6, ease: eases.race }, "<")
        .to(
          stripe,
          {
            scaleX: 0,
            transformOrigin: "right center",
            duration: 0.42,
            ease: eases.snap,
          },
          "<0.04",
        );
    },
    { scope, dependencies: [reveal, reduced, start, delay] },
  );

  return (
    <div
      ref={scope}
      className={`${align === "center" ? "flex flex-col items-center" : ""} ${className}`}
    >
      <span className="relative inline-block">
        <h2 id={id} data-heading-text className={headingClassName}>
          {children}
        </h2>
        {/* Collapsed by default: the timeline sweeps it open and shut. If JS
            never runs — or motion is reduced — it must not sit over the text. */}
        {reveal && (
          <span
            data-heading-stripe
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-1 inset-y-0 origin-left scale-x-0 bg-red"
          />
        )}
      </span>
      {bar && <div aria-hidden="true" className="mt-5 h-bar w-16 bg-red" />}
    </div>
  );
}
