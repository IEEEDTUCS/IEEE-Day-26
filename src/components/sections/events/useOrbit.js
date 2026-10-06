import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, eases, useReducedMotion } from "../../../motion";

// The ring leans hard so the viewer looks down on the orbit and the cards
// rake over the pilot's head. OrbitCarousel derives its stage geometry
// (and its JSX default transform) from this value — change it in one place.
export const ORBIT_TILT = -14;

const REVOLUTION = 25; // seconds per full revolution (faster spin)

/**
 * Owns every piece of orbit motion for the Events section.
 *
 * The rotation angle lives in a ref and is written straight to the DOM on each
 * GSAP tick (transform only, never React state). React state is limited to the
 * one discrete UI value — the front card — which the card row highlights.
 *
 * The orbit idles at timeScale 0 when: the dossier is open (`enabled: false`),
 * the section is off screen, the tab is hidden, or motion is reduced (no tween
 * at all). Pause is always timeScale 0, never restart, so the orbit freezes
 * and resumes exactly where it stands (docs/MOTION.md marquee rule).
 */
export function useOrbit({ scope, count, enabled = true }) {
  const ringRef = useRef(null);
  const angle = useRef(0);
  const idleRef = useRef(null);
  const glideRef = useRef(null);
  const inView = useRef(true);
  const frontRef = useRef(0);
  const enabledRef = useRef(enabled);

  const [front, setFront] = useState(0);

  const reduced = useReducedMotion();
  const slot = 360 / count;

  const render = useCallback(() => {
    const ring = ringRef.current;
    if (!ring) return;
    // Written by hand, not gsap.set: the order must be rotateX then rotateY
    // (tilt applied after the spin, like the reference), which GSAP's
    // single-transform writer does not guarantee when both axes are set.
    ring.style.transform = `rotateX(${ORBIT_TILT}deg) rotateY(${angle.current % 360}deg)`;

    // Card i faces the viewer when (i * slot + angle) ≡ 0 (mod 360).
    const next = ((Math.round(-angle.current / slot) % count) + count) % count;
    if (next !== frontRef.current) {
      frontRef.current = next;
      setFront(next);
    }
  }, [count, slot]);

  const applyTimeScale = useCallback(() => {
    const tween = idleRef.current;
    if (!tween) return;
    const hidden = typeof document !== "undefined" && document.hidden;
    tween.timeScale(enabledRef.current && inView.current && !hidden ? 1 : 0);
  }, []);

  const startIdle = useCallback(() => {
    if (reduced) return;
    idleRef.current?.kill();
    // Renormalise so a restarted tween never grows unbounded.
    angle.current = ((angle.current % 360) + 360) % 360;
    idleRef.current = gsap.to(angle, {
      current: "+=360",
      duration: REVOLUTION,
      ease: "none",
      repeat: -1,
      onUpdate: render,
    });
    applyTimeScale();
  }, [applyTimeScale, render, reduced]);

  // Snap the ring to an absolute angle, then resume the cruise.
  const glideTo = useCallback(
    (target) => {
      idleRef.current?.kill();
      idleRef.current = null;
      glideRef.current?.kill();

      if (reduced) {
        angle.current = target;
        render();
        return;
      }

      glideRef.current = gsap.to(angle, {
        current: target,
        duration: 0.55,
        ease: eases.snap,
        onUpdate: render,
        onComplete: startIdle,
      });
    },
    [reduced, render, startIdle],
  );

  // Rotate the shortest way so `index` faces the viewer (card focus calls this
  // so keyboard users always land on a visible card).
  const rotateTo = useCallback(
    (index) => {
      const wanted = -index * slot;
      glideTo(Math.round((angle.current - wanted) / 360) * 360 + wanted);
    },
    [glideTo, slot],
  );

  useGSAP(
    () => {
      render();
      if (reduced) return undefined;

      startIdle();

      const trigger = ScrollTrigger.create({
        trigger: scope.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          inView.current = self.isActive;
          applyTimeScale();
        },
      });

      return () => {
        trigger.kill();
        idleRef.current?.kill();
        glideRef.current?.kill();
      };
    },
    { scope, dependencies: [reduced, render] },
  );

  // Mirror `enabled` into the ref the tween callbacks read, and re-apply.
  useEffect(() => {
    enabledRef.current = enabled;
    applyTimeScale();
  }, [enabled, applyTimeScale]);

  useEffect(() => {
    const onVisibility = () => applyTimeScale();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [applyTimeScale]);

  const controls = useMemo(() => ({ front, rotateTo }), [front, rotateTo]);

  return { ringRef, controls };
}
