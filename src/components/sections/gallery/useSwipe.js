import { useEffect } from "react";

const THRESHOLD = 44; // px that stripe must travel

// Horizontal swipe detection for gallery
export function useSwipe(ref, { onNext, onPrev, enabled = true }) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return undefined;

    let startX = 0;
    let startY = 0;
    let tracking = false;

    const down = (e) => {
      if (e.pointerType === "mouse") return;
      tracking = true;
      startX = e.clientX;
      startY = e.clientY;
    };

    const up = (e) => {
      if (!tracking) return;
      tracking = false;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      // Ignore mostly-vertical drags so page scrolling still wins.
      if (Math.abs(dx) < THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) onNext?.();
      else onPrev?.();
    };

    const cancel = () => {
      tracking = false;
    };

    el.addEventListener("pointerdown", down, { passive: true });
    el.addEventListener("pointerup", up, { passive: true });
    el.addEventListener("pointercancel", cancel, { passive: true });
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", cancel);
    };
  }, [ref, onNext, onPrev, enabled]);
}
