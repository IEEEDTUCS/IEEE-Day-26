import { useEffect } from "react";
import { scrollToSection } from "../motion";

// Hook to scroll to # section on reload
export function useInitialScroll() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    let settled = false;

    const stopCorrecting = () => {
      settled = true;
    };

    const apply = () => {
      if (settled) return;
      if (id && document.getElementById(id)) {
        scrollToSection(id, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    };

    const applySoon = () => requestAnimationFrame(apply);

    applySoon();

    // Stop correcting scroll when user interacts with page
    const events = ["wheel", "touchstart", "keydown", "pointerdown"];
    events.forEach((e) =>
      window.addEventListener(e, stopCorrecting, { passive: true, once: true }),
    );

    if (document.readyState === "complete") applySoon();
    else window.addEventListener("load", applySoon, { once: true });

    document.fonts?.ready.then(applySoon).catch(() => {});

    return () => {
      settled = true;
      window.removeEventListener("load", applySoon);
      events.forEach((e) => window.removeEventListener(e, stopCorrecting));
    };
  }, []);
}
