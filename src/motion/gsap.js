import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

// Remesure height after page height changes
gsap.registerPlugin(
  ScrollTrigger,
  Flip,

  MotionPathPlugin,
);

// Added seprate eases so that its fixed and consistent
export const eases = {
  race: "power4.out", // entrance
  snap: "expo.inOut", // long-travel
  launch: "power3.in", // leaving
  linear: "none", // scroll-animation
};

// fixed durations
export const durations = {
  micro: 0.2,
  ui: 0.4,
  reveal: 0.75,
  jump: 1.1,
};

export const stagger = 0.06;

// This is only while in developement
if (import.meta.env.DEV) {
  window.__gsap = gsap;
}

export { gsap, ScrollTrigger, Flip, MotionPathPlugin };
