import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../../../motion";

// Two rows of reels and their configs
const ROWS = [
  { duration: 70, reverse: false },
  { duration: 60, reverse: true },
];

const SLOW = 0.6;
const RESUME = 0.8;
const CUT = 0.25;
const ARM = 0.6;

// This hook manages the animation of the two rows of reels
export function useReelMarquee({ scope, reduced, modalOpen = false }) {
  // State and refs for the two rows
  const [trackRefs] = useState(() => ROWS.map(() => ({ current: null })));
  const tweens = useRef([]);
  const rowHolds = useRef(ROWS.map(() => new Set()));
  const globalHolds = useRef(new Set());
  const armed = useRef(false);
  const playingRef = useRef(true);
  const [playing, setPlaying] = useState(true);

  const applyRow = useCallback((row, duration) => {
    const tween = tweens.current[row];
    if (!tween) return;
    const go =
      armed.current && !globalHolds.current.size && !rowHolds.current[row].size;
    gsap.to(tween, {
      timeScale: go ? 1 : 0,
      duration,
      ease: "power2.out",
      overwrite: true,
    });
  }, []);

  const applyAll = useCallback(
    (duration) => {
      tweens.current.forEach((_, row) => applyRow(row, duration));
    },
    [applyRow],
  );

  // Stopping animation on hold
  const hold = useCallback(
    (row, reason, on) => {
      const set = rowHolds.current[row];
      if (!set) return;
      const before = set.size;
      if (on) set.add(reason);
      else set.delete(reason);
      if (!before === !set.size) return;
      applyRow(row, on ? SLOW : RESUME);
    },
    [applyRow],
  );

  const holdAll = useCallback(
    (reason, on) => {
      const set = globalHolds.current;
      const before = set.size;
      if (on) set.add(reason);
      else set.delete(reason);
      if (!before === !set.size) return;
      applyAll(on ? CUT : RESUME);
    },
    [applyAll],
  );

  // Starting animation but stops when hovered or offscreen
  const arm = useCallback(() => {
    if (armed.current) return;
    armed.current = true;
    applyAll(ARM);
  }, [applyAll]);

  const toggle = useCallback(() => {
    const next = !playingRef.current;
    playingRef.current = next;
    setPlaying(next);
    holdAll("button", !next);
  }, [holdAll]);

  useGSAP(
    () => {
      if (reduced) return undefined;
      if (trackRefs.some((ref) => !ref.current)) return undefined;

      tweens.current = ROWS.map((row, i) => {
        const shared = { duration: row.duration, ease: "none", repeat: -1 };
        const tween = row.reverse
          ? gsap.fromTo(
              trackRefs[i].current,
              { xPercent: -50 },
              { xPercent: 0, ...shared },
            )
          : gsap.to(trackRefs[i].current, { xPercent: -50, ...shared });
        // Held until the entrance arms it.
        tween.timeScale(0);
        return tween;
      });
      applyAll(0);

      // Nothing animates off screen, or in a tab nobody is looking at.
      const st = ScrollTrigger.create({
        trigger: scope.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => holdAll("offscreen", !self.isActive),
      });
      const onVisibility = () => holdAll("hidden", document.hidden);
      document.addEventListener("visibilitychange", onVisibility);

      return () => {
        document.removeEventListener("visibilitychange", onVisibility);
        st.kill();
        tweens.current.forEach((tween) => tween.kill());
        tweens.current = [];
      };
    },
    { scope, dependencies: [reduced, applyAll, holdAll, trackRefs] },
  );

  // The lightbox covers the page and has its own controls.
  useEffect(() => {
    if (modalOpen) {
      // When the modal opens, all rows are held and their hold sets cleared.
      rowHolds.current.forEach((set) => set.clear());
    }
    holdAll("modal", modalOpen);
  }, [modalOpen, holdAll]);

  return { trackRefs, playing, toggle, hold, arm };
}
