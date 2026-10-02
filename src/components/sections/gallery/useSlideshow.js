import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../../motion";

/** How long each photo holds before the wipe carries the next one in. */
export const SLIDE_DURATION = 5;

// This hook manages the fullscreen slideshow
export function useSlideshow({ index, reduced, fillRef, onAdvance }) {
  const tween = useRef(null);
  const holds = useRef(new Set());
  const playingRef = useRef(!reduced);
  const [playing, setPlaying] = useState(!reduced);

  const apply = useCallback(() => {
    const current = tween.current;
    if (!current) return;
    if (holds.current.size) current.pause();
    else current.resume();
  }, []);

  const hold = useCallback(
    (reason, on) => {
      const set = holds.current;
      const before = set.size;
      if (on) set.add(reason);
      else set.delete(reason);
      if (!before === !set.size) return;
      apply();
    },
    [apply],
  );

  const toggle = useCallback(() => {
    const next = !playingRef.current;
    playingRef.current = next;
    setPlaying(next);
    hold("button", !next);
  }, [hold]);

  useGSAP(
    () => {
      if (reduced || !fillRef.current) return undefined;

      tween.current = gsap.fromTo(
        fillRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: SLIDE_DURATION,
          ease: "none",
          overwrite: true,
          onComplete: onAdvance,
        },
      );
      // A photo changed while paused must not restart the clock.
      if (holds.current.size) tween.current.pause();

      return () => {
        tween.current?.kill();
        tween.current = null;
      };
    },

    {
      dependencies: [index, reduced, fillRef, onAdvance],
      revertOnUpdate: true,
    },
  );

  useEffect(() => {
    if (reduced) return undefined;
    const onVisibility = () => hold("hidden", document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [hold, reduced]);

  return { playing, toggle, hold };
}
