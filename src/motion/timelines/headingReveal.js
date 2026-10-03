import { gsap, eases } from "..";

// Heading reveal animation

export function buildHeadingReveal({
  text,
  stripe,
  x = 20,
  skewX = -6,
  stripeDuration = 0.42,
  textDuration = 0.6,
  // When the stripe starts retracting, relative to the moment it is full width.
  retractAt = "<0.04",
} = {}) {
  const tl = gsap.timeline();
  if (!text || !stripe) return tl;

  gsap.set(text, { opacity: 0, x, skewX });
  gsap.set(stripe, { scaleX: 0, transformOrigin: "left center" });

  return tl
    .to(stripe, { scaleX: 1, duration: stripeDuration, ease: eases.snap })
    .set(text, { opacity: 1 })
    .to(text, { x: 0, skewX: 0, duration: textDuration, ease: eases.race }, "<")
    .to(
      stripe,
      {
        scaleX: 0,
        transformOrigin: "right center",
        duration: stripeDuration,
        ease: eases.snap,
      },
      retractAt,
    );
}
