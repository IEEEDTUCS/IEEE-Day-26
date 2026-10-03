import { useCallback, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import {
  gsap,
  Flip,
  eases,
  buildReplayWipe,
  buildStripeSweep,
  getLenis,
} from "../../../motion";
import { galleryLabel } from "../../../content";
import { RollingNumber } from "../../ui";
import { IconButton } from "./IconButton";
import { PauseButton } from "./PauseButton";
import { Filmstrip } from "./Filmstrip";
import { ChevronLeft, ChevronRight, Close } from "./Icons";
import { useSwipe } from "./useSwipe";
import { useSlideshow } from "./useSlideshow";

const FOCUSABLE =
  'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const CORNERS = ["left-top", "right-top", "left-bottom", "right-bottom"];

// Corner brackets that appear around photos
function Brackets() {
  return CORNERS.map((corner) => {
    const [x, y] = corner.split("-");
    return (
      <span
        key={corner}
        data-bracket
        aria-hidden="true"
        className="pointer-events-none absolute h-[18px] w-[18px] border-red"
        style={{
          [x]: "10px",
          [y]: "10px",
          transformOrigin: `${x} ${y}`,
          [`border${x === "left" ? "Left" : "Right"}Width`]: 2,
          [`border${y === "top" ? "Top" : "Bottom"}Width`]: 2,
        }}
      />
    );
  });
}

// The box that contains the photo and racing strip
const BOX =
  "relative max-h-full w-full overflow-hidden lg:h-full lg:w-auto lg:max-w-full";

// Stacked slides
function Slide({ photo, register, brackets = false }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      <div
        ref={(el) => register(photo.src, "wrapper", el)}
        className={`${BOX} opacity-0`}
        style={{
          "--ar": `${photo.width}/${photo.height}`,
          aspectRatio: "var(--ar)",
        }}
      >
        <div
          ref={(el) => register(photo.src, "image", el)}
          className="absolute inset-0"
        >
          <img
            src={photo.src}
            alt=""
            width={photo.width}
            height={photo.height}
            className="h-full w-full object-contain"
          />
        </div>
        <div
          ref={(el) => register(photo.src, "shade", el)}
          className="absolute inset-0 bg-shade opacity-0"
        />
        {brackets && <Brackets />}
      </div>
    </div>
  );
}

// Fullscreen lighbox with photo and controls
export function Lightbox({
  photos,
  index,
  prevIndex,
  direction,
  reduced,
  onGoTo,
  onNext,
  onPrev,
  onClose,
  originRef,
  returnFocusTo,
}) {
  const dialog = useRef(null);
  const panel = useRef(null);
  const stage = useRef(null);
  const plate = useRef(null);
  const stripe = useRef(null);
  const overlayBox = useRef(null);
  const flash = useRef(null);
  const layers = useRef({});
  const progress = useRef(null);
  const closing = useRef(false);

  const {
    playing: slideshowPlaying,
    toggle: toggleSlideshow,
    hold: holdSlideshow,
  } = useSlideshow({
    index,
    reduced,
    fillRef: progress,
    onAdvance: onNext,
  });

  const photo = photos[index];
  const outgoingPhoto =
    prevIndex !== index && photos[prevIndex] ? photos[prevIndex] : null;

  const register = useCallback((src, role, el) => {
    const bag = layers.current[src] ?? (layers.current[src] = {});
    bag[role] = el;
  }, []);

  // Chrome elements that fade out on close
  const chromeTargets = useCallback(() => {
    const root = panel.current;
    if (!root) return [];
    return [
      root.querySelector("[data-lb-top]"),
      ...root.querySelectorAll("[data-lb-strip]"),
      ...root.querySelectorAll("[data-lb-arrow]"),
    ].filter(Boolean);
  }, []);

  // Close the lightbox, animating out of the clicked tile if possible.
  const requestClose = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    // Hold the slideshow so it doesn't advance while the close animation is running.
    holdSlideshow("closing", true);

    const target = originRef?.current;
    if (reduced || !target || !document.body.contains(target)) {
      onClose();
      return;
    }

    const current = layers.current[photo.src]?.wrapper;
    gsap
      .timeline({ onComplete: onClose })
      .to(chromeTargets(), {
        opacity: 0,
        y: -10,
        duration: 0.18,
        ease: eases.snap,
        stagger: 0.03,
      })
      .add(
        current
          ? Flip.fit(current, target, {
              scale: true,
              duration: 0.4,
              ease: eases.snap,
            })
          : gsap.to({}, { duration: 0.4 }),
        0.06,
      )
      .to(dialog.current, { opacity: 0, duration: 0.22, ease: "none" }, 0.24);
  }, [chromeTargets, holdSlideshow, onClose, originRef, photo.src, reduced]);

  useSwipe(stage, { onNext, onPrev });

  // Stop Lenis and lock the page while open (docs/MOTION.md rule 8).
  useEffect(() => {
    const lenis = getLenis();
    lenis?.stop();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      lenis?.start();
    };
  }, []);

  // Focus trap + keyboard. Focus returns to the opener once we've unmounted.
  useEffect(() => {
    const el = dialog.current;
    const previouslyFocused = returnFocusTo?.current ?? document.activeElement;

    Array.from(el?.querySelectorAll(FOCUSABLE) ?? [])
      .find((n) => n.offsetParent !== null)
      ?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        requestClose();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        onNext();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onPrev();
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = Array.from(el.querySelectorAll(FOCUSABLE)).filter(
        (n) => n.offsetParent !== null,
      );
      if (!nodes.length) return;
      const firstNode = nodes[0];
      const lastNode = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === firstNode) {
        e.preventDefault();
        lastNode.focus();
      } else if (!e.shiftKey && document.activeElement === lastNode) {
        e.preventDefault();
        firstNode.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
  }, [onNext, onPrev, requestClose, returnFocusTo]);

  // Open: the clicked tile expands into the photo, chrome follows it in.
  useGSAP(
    () => {
      const first = layers.current[photo.src];

      if (reduced) {
        gsap.set(first?.wrapper, { autoAlpha: 1 });
        return;
      }

      const brackets = dialog.current.querySelectorAll("[data-bracket]");

      gsap.set(first?.wrapper, { autoAlpha: 1 });
      gsap.set(chromeTargets(), { opacity: 0, y: -16 });
      gsap.set(brackets, { scale: 0, opacity: 0 });

      const tl = gsap.timeline();
      tl.fromTo(
        dialog.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2 },
        0,
      );

      // If the opener is a tile, grow out of it. If it's "View all", fade in from the centre.
      const from = originRef?.current;
      const target = first?.wrapper;
      const a = from?.getBoundingClientRect();
      const b = target?.getBoundingClientRect();

      if (a?.width && b?.width && document.body.contains(from)) {
        tl.fromTo(
          target,
          {
            x: a.left + a.width / 2 - (b.left + b.width / 2),
            y: a.top + a.height / 2 - (b.top + b.height / 2),
            scaleX: a.width / b.width,
            scaleY: a.height / b.height,
          },
          {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            duration: 0.45,
            ease: eases.snap,
          },
          0,
        );
      } else {
        // Opened from "View all" — there is no tile to grow out of.
        tl.fromTo(
          plate.current,
          { scale: 0.96, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.35, ease: eases.snap },
          0,
        );
      }

      tl.add(
        buildStripeSweep({
          stripe: stripe.current,
          flash: flash.current,
          direction: 1,
          width: overlayBox.current?.offsetWidth ?? 0,
          duration: 0.55,
        }),
        0.08,
      )
        .to(
          chromeTargets(),
          { opacity: 1, y: 0, duration: 0.35, ease: eases.race, stagger: 0.05 },
          0.22,
        )
        .to(
          brackets,
          {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            ease: eases.race,
            stagger: 0.04,
          },
          0.34,
        );
    },
    { scope: dialog },
  );

  // Photo change: the shared replay wipe.
  useGSAP(
    () => {
      if (prevIndex === index) return;
      const incoming = layers.current[photo.src];
      const outgoing = outgoingPhoto ? layers.current[outgoingPhoto.src] : null;
      if (!incoming?.wrapper) return;

      const tl = buildReplayWipe({
        outgoing,
        incoming,
        stripe: stripe.current,
        flash: flash.current,
        direction,
        width: overlayBox.current?.offsetWidth ?? 0,
        reduced,
        // A slow drift under a large static photo reads as a rendering fault.
        settle: 0,
      });

      // The brackets belong to the arriving photo, so they re-settle with it.
      const brackets = dialog.current.querySelectorAll("[data-bracket]");
      if (tl && brackets.length) {
        tl.fromTo(
          brackets,
          { scale: 0.6, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            ease: eases.race,
            stagger: 0.04,
          },
          0.5,
        );
      }
    },
    { scope: dialog, dependencies: [index, prevIndex, direction, reduced] },
  );

  return (
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${photos.length}`}
      className="fixed inset-0 z-[100] bg-pit-deep"
    >
      {/* Vignette, so the photo reads as lit rather than pasted on flat black. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 85% at 50% 42%, transparent 32%, var(--color-shade) 100%)",
        }}
      />

      <div ref={panel} className="relative flex h-full flex-col">
        {/* Top bar */}
        <div
          data-lb-top
          className="relative flex h-17 shrink-0 items-center justify-between px-4 lg:h-19 lg:px-10"
        >
          <span className="bg-red px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-paper lg:text-[12px]">
            {galleryLabel}
          </span>

          <div className="flex items-center gap-4 lg:gap-6">
            <span className="flex items-baseline">
              <RollingNumber
                value={index + 1}
                direction={direction}
                className="text-[22px] font-bold leading-none text-paper lg:text-[30px]"
              />
              <span className="ml-1.5 text-[12px] text-steel lg:text-[15px]">
                / {photos.length}
              </span>
            </span>
            {!reduced && (
              <PauseButton
                playing={slideshowPlaying}
                onToggle={toggleSlideshow}
                subject="slideshow"
                className="hidden lg:grid lg:[--btn:48px]"
              />
            )}
            <IconButton
              variant="outline"
              label="Close full screen"
              onClick={requestClose}
              className="lg:[--btn:48px]"
            >
              <Close size={18} />
            </IconButton>
          </div>

          {!reduced && (
            <span
              ref={progress}
              data-lb-progress
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-red"
            />
          )}
        </div>

        {/* Stage */}
        <div
          ref={stage}
          className="flex min-h-0 flex-1 items-center justify-center lg:gap-6 lg:px-10"
        >
          <IconButton
            variant="ghost"
            nudge="left"
            size={56}
            label="Previous photo"
            onClick={onPrev}
            className="hidden lg:grid"
            data-lb-arrow
          >
            <ChevronLeft size={20} />
          </IconButton>

          <div ref={plate} className="relative h-full min-h-0 w-full max-w-290">
            <Slide photo={photo} register={register} brackets />
            {outgoingPhoto && (
              <Slide photo={outgoingPhoto} register={register} />
            )}

            {/* Stripe and flash share the photo's exact box. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
            >
              <div
                ref={overlayBox}
                className={BOX}
                style={{
                  "--ar": `${photo.width}/${photo.height}`,
                  aspectRatio: "var(--ar)",
                }}
              >
                <div
                  ref={stripe}
                  className="pointer-events-none absolute inset-y-[-20%] left-0 w-0 opacity-0"
                >
                  <span className="absolute inset-y-0 left-0 w-32 skew-x-[-14deg] bg-red" />
                  <span className="absolute inset-y-0 left-32 w-bar skew-x-[-14deg] bg-paper" />
                  <span className="absolute inset-y-0 left-[-58px] w-[18px] skew-x-[-14deg] bg-red-deep" />
                  <span className="absolute left-[283px] top-[21%] h-[2px] w-[150px] skew-x-[-14deg] bg-paper/55" />
                  <span className="absolute left-[283px] top-[57%] h-[2px] w-[150px] skew-x-[-14deg] bg-red" />
                  <span className="absolute left-[283px] top-[82%] h-[2px] w-[150px] skew-x-[-14deg] bg-paper/30" />
                </div>
                <div
                  ref={flash}
                  className="pointer-events-none absolute inset-0 bg-paper opacity-0"
                />
              </div>
            </div>
          </div>

          <IconButton
            variant="red"
            nudge="right"
            size={56}
            label="Next photo"
            onClick={onNext}
            className="hidden lg:grid"
            data-lb-arrow
          >
            <ChevronRight size={20} />
          </IconButton>
        </div>

        {/* Mobile transport */}
        <div
          data-lb-arrow
          className="flex shrink-0 items-center justify-between px-4 pb-3 pt-1 lg:hidden"
        >
          <IconButton
            variant="ghost"
            nudge="left"
            size={52}
            label="Previous photo"
            onClick={onPrev}
          >
            <ChevronLeft size={18} />
          </IconButton>
          {!reduced && (
            <PauseButton
              playing={slideshowPlaying}
              onToggle={toggleSlideshow}
              size={52}
              subject="slideshow"
            />
          )}
          <IconButton
            variant="red"
            nudge="right"
            size={52}
            label="Next photo"
            onClick={onNext}
          >
            <ChevronRight size={18} />
          </IconButton>
        </div>

        <p className="sr-only" aria-live={slideshowPlaying ? "off" : "polite"}>
          {`Photo ${index + 1} of ${photos.length}`}
        </p>

        {/* Filmstrip */}
        <Filmstrip
          photos={photos}
          index={index}
          onJump={onGoTo}
          reduced={reduced}
        />
      </div>
    </div>
  );
}
