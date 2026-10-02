import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, durations } from "./gsap";
import { prefersReducedMotion } from "./useReducedMotion";

// We will use lenis only when reduced motion is not allowed

let lenis = null;

export function getLenis() {
  return lenis;
}

function smoothScrollAllowed() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  if (prefersReducedMotion()) return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

// fixed nav height
function navHeight() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(
    "--nav-height",
  );
  return parseFloat(raw) || 0;
}

// Animations explained in gsap.js
const expoOut = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

// Scrolling functions
export function scrollToSection(id, { immediate = false } = {}) {
  const el = document.getElementById(id);
  if (!el) return;

  if (lenis) {
    lenis.scrollTo(el, {
      offset: -navHeight(),
      immediate,
      duration: immediate ? 0 : durations.jump,
      easing: expoOut,
    });
    return;
  }

  window.scrollTo({ top: el.offsetTop - navHeight(), behavior: "auto" });
}

export function scrollToTop() {
  if (lenis) {
    lenis.scrollTo(0, { duration: durations.jump, easing: expoOut });
    return;
  }
  window.scrollTo({ top: 0, behavior: "auto" });
}

// React hook to use lenis for smooth scrolling. Import in App.jsx
export function useLenis() {
  useEffect(() => {
    if (!smoothScrollAllowed()) return undefined;

    const instance = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis = instance;

    const onScroll = () => ScrollTrigger.update();
    instance.on("scroll", onScroll);

    const raf = (time) => instance.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      instance.off("scroll", onScroll);
      instance.destroy();
      lenis = null;
    };
  }, []);
}
