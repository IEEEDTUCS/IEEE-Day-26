import { gsap, eases } from "..";

export const WIPE_DURATION = 0.85;

// Stripe wipe animation in gallery
export function buildStripeSweep({
  stripe,
  flash,
  direction = 1,
  width = 0,
  duration = WIPE_DURATION,
  reduced = false,
}) {
  const tl = gsap.timeline();
  if (reduced) {
    if (stripe) gsap.set(stripe, { autoAlpha: 0 });
    if (flash) gsap.set(flash, { opacity: 0 });
    return tl;
  }

  const sign = direction >= 0 ? 1 : -1;

  if (stripe && width) {
    tl.fromTo(
      stripe,
      { x: sign > 0 ? -220 : width + 220, autoAlpha: 1 },
      {
        x: sign > 0 ? width + 220 : -220,
        duration,
        ease: eases.snap,
        onComplete: () => gsap.set(stripe, { autoAlpha: 0 }),
      },
      0,
    );
  }

  if (flash) {
    const lead = duration * 0.24;
    tl.fromTo(
      flash,
      { opacity: 0 },
      { opacity: 0.16, duration: lead, ease: "none" },
      lead,
    ).to(flash, { opacity: 0, duration: lead * 2, ease: "none" }, lead * 2);
  }

  return tl;
}

// Gallery replay wipe animation
export function buildReplayWipe({
  outgoing,
  incoming,
  stripe,
  flash,
  direction = 1,
  width = 0,
  reduced = false,
  settle = 7,
}) {
  if (!incoming?.wrapper) return null;

  if (reduced) {
    gsap.set(incoming.wrapper, { autoAlpha: 1, xPercent: 0, zIndex: 2 });
    gsap.set(incoming.image, { xPercent: 0, scale: 1 });
    if (incoming.shade) gsap.set(incoming.shade, { opacity: 0 });
    if (outgoing?.wrapper) gsap.set(outgoing.wrapper, { autoAlpha: 0 });
    if (stripe) gsap.set(stripe, { autoAlpha: 0 });
    if (flash) gsap.set(flash, { opacity: 0 });
    return null;
  }

  const sign = direction >= 0 ? 1 : -1;
  const d = WIPE_DURATION;
  const tl = gsap.timeline();

  // one image goes out, other comes in  with animation
  if (outgoing?.wrapper) {
    tl.set(outgoing.wrapper, { autoAlpha: 1, zIndex: 1 }, 0).to(
      outgoing.image,
      { xPercent: -6 * sign, scale: 1.04, duration: d, ease: eases.snap },
      0,
    );
    if (outgoing.shade) {
      tl.to(
        outgoing.shade,
        { opacity: 0.62, duration: d, ease: eases.snap },
        0,
      );
    }
  }

  // incoming image comes in with animation
  tl.set(incoming.wrapper, { autoAlpha: 1, zIndex: 2 }, 0)
    .fromTo(
      incoming.wrapper,
      { xPercent: -100 * sign },
      { xPercent: 0, duration: d, ease: eases.snap },
      0,
    )
    .fromTo(
      incoming.image,
      { xPercent: 100 * sign, scale: 1.12 },
      { xPercent: 0, duration: d, ease: eases.snap },
      0,
    );
  if (incoming.shade) tl.set(incoming.shade, { opacity: 0 }, 0);

  // The stripe rides the reveal edge. Same move as the open uses.
  tl.add(buildStripeSweep({ stripe, flash, direction, width, duration: d }), 0);

  // settle image after animation
  if (settle > 0) {
    tl.to(incoming.image, { scale: 1, duration: settle, ease: eases.race }, 0);
  } else {
    tl.set(incoming.image, { scale: 1 }, d);
  }

  if (outgoing?.wrapper) tl.set(outgoing.wrapper, { autoAlpha: 0 }, d + 0.01);

  return tl;
}
