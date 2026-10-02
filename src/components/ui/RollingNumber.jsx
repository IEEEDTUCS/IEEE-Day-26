import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, eases, useReducedMotion } from "../../motion";

// Rolling Number in gallery header

export function RollingNumber({
  value,
  direction = 1,
  className = "",
  pad = 2,
  ...rest
}) {
  const scope = useRef(null);
  const incoming = useRef(null);
  const outgoing = useRef(null);
  const lastValue = useRef(value);
  const reduced = useReducedMotion();

  const format = (v) => (pad > 0 ? String(v).padStart(pad, "0") : String(v));

  useGSAP(
    () => {
      const from = lastValue.current;
      lastValue.current = value;
      if (from === value || !outgoing.current) return;

      outgoing.current.textContent = format(from);

      if (reduced) {
        gsap.set(incoming.current, { yPercent: 0, opacity: 1 });
        gsap.set(outgoing.current, { opacity: 0 });
        return;
      }

      const sign = direction >= 0 ? 1 : -1;
      gsap
        .timeline()
        .fromTo(
          incoming.current,
          { yPercent: 110 * sign, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.55, ease: eases.snap },
          0,
        )
        .fromTo(
          outgoing.current,
          { yPercent: 0, opacity: 1 },
          {
            yPercent: -110 * sign,
            opacity: 0,
            duration: 0.55,
            ease: eases.snap,
          },
          0,
        );
    },
    { scope, dependencies: [value, direction, reduced] },
  );

  return (
    <span
      ref={scope}
      className={`relative inline-block overflow-hidden align-bottom ${
        pad > 0 ? "tabular" : ""
      } ${className}`}
      {...rest}
    >
      {/* Sizer: invisible but fixes the height */}
      <span className="invisible block whitespace-nowrap">{format(value)}</span>
      {/* filled by useGSAP when value changes */}
      <span
        ref={outgoing}
        aria-hidden="true"
        className="absolute inset-0 block whitespace-nowrap opacity-0"
      />
      <span ref={incoming} className="absolute inset-0 block whitespace-nowrap">
        {format(value)}
      </span>
    </span>
  );
}
