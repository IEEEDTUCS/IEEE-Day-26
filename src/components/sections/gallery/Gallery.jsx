import { useCallback, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, eases, useReducedMotion } from "../../../motion";
import { galleryPhotos, galleryLabel } from "../../../content";
import { DotGrid, SectionHeading } from "../../ui";
import { Reel } from "./Reel";
import { Lightbox } from "./Lightbox";
import { PauseButton } from "./PauseButton";
import { useReelMarquee } from "./useReelMarquee";
import { Expand } from "./Icons";

const photos = galleryPhotos;
const ROW_ONE = photos.slice(0, 5);
const ROW_TWO = photos.slice(5);

// View all button
function ViewAllButton({ onClick, buttonRef, className = "", ...rest }) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      {...rest}
      className={`group relative flex h-11 items-center justify-center gap-2.5 overflow-hidden bg-red px-5 text-label font-semibold uppercase tracking-button text-paper ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-left scale-x-0 bg-red-deep transition-transform duration-(--duration-base) ease-race group-hover:scale-x-100"
      />
      <span className="relative">View all</span>
      <span className="relative">
        <Expand size={14} />
      </span>
    </button>
  );
}

export function Gallery() {
  const scope = useRef(null);
  const viewAll = useRef(null);
  const mobileViewAll = useRef(null);
  // The element the full screen expands out of — whichever tile was clicked.
  const origin = useRef(null);
  const opener = useRef(null);
  const reduced = useReducedMotion();

  const [open, setOpen] = useState(false);
  // State of fullscreen lightbox
  const [frame, setFrame] = useState({
    index: 0,
    prevIndex: 0,
    direction: 1,
  });

  const marquee = useReelMarquee({ scope, reduced, modalOpen: open });

  const goTo = useCallback((next, dir) => {
    setFrame((state) => {
      const count = photos.length;
      const index = ((next % count) + count) % count;
      if (index === state.index) return state;
      return {
        index,
        prevIndex: state.index,
        direction: dir ?? (index > state.index ? 1 : -1),
      };
    });
  }, []);

  const next = useCallback(
    () =>
      setFrame((s) => ({
        index: (s.index + 1) % photos.length,
        prevIndex: s.index,
        direction: 1,
      })),
    [],
  );

  const prev = useCallback(
    () =>
      setFrame((s) => ({
        index: (s.index - 1 + photos.length) % photos.length,
        prevIndex: s.index,
        direction: -1,
      })),
    [],
  );

  const openAt = useCallback((index, tile) => {
    origin.current = tile ?? null;
    opener.current = tile ?? null;
    setFrame((s) => ({ ...s, index, prevIndex: index }));
    setOpen(true);
  }, []);

  const openAll = useCallback(() => {
    origin.current = null;
    opener.current = viewAll.current ?? mobileViewAll.current;
    setFrame({ index: 0, prevIndex: 0, direction: 1 });
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  useGSAP(
    () => {
      if (reduced) return;
      const q = gsap.utils.selector(scope);
      const edge = q("[data-g-edge]");
      const label = q("[data-g-label]");
      const dots = q("[data-g-label] [data-dot]");
      const rows = q("[data-g-row]");
      const line = q("[data-g-speedline]");
      const actions = q("[data-g-actions]");

      gsap.set(edge, { scaleX: 0, transformOrigin: "left center" });
      gsap.set([...label, ...actions], { opacity: 0, y: 12 });
      gsap.set(rows[0], { opacity: 0, xPercent: 12 });
      gsap.set(rows[1], { opacity: 0, xPercent: -12 });
      gsap.set(line, { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: scope.current, start: "top 75%", once: true },
      });

      tl.to(edge, { scaleX: 1, duration: 1, ease: eases.snap }, 0)
        .to(label, { opacity: 1, y: 0, duration: 0.5, ease: eases.race }, 0.15)
        .to(
          rows[0],
          { opacity: 1, xPercent: 0, duration: 1.2, ease: eases.race },
          0.55,
        )
        .to(
          rows[1],
          { opacity: 1, xPercent: 0, duration: 1.2, ease: eases.race },
          0.75,
        )
        .to(line, { scaleX: 1, duration: 1, ease: eases.snap }, 0.9)
        .to(actions, { opacity: 1, y: 0, duration: 0.5, ease: eases.race }, 1.0)
        // Ramp into motion rather than snapping to full speed.
        .call(marquee.arm, null, 1.4);

      // Start-light sequence on the dot row.
      if (dots.length) {
        tl.set(dots, { backgroundColor: "var(--color-silver)" }, 0.15);
        dots.forEach((dot, i) => {
          tl.set(dot, { backgroundColor: "var(--color-red)" }, 0.15 + i * 0.13);
        });
        tl.set(dots, { backgroundColor: "var(--color-silver)" }, 1.0).set(
          dots[0],
          { backgroundColor: "var(--color-red)" },
          1.05,
        );
      }
    },
    { scope, dependencies: [reduced, marquee.arm] },
  );

  const reelProps = {
    total: photos.length,
    reduced,
    onOpen: openAt,
  };

  return (
    <section
      id="gallery"
      ref={scope}
      aria-labelledby="gallery-heading"
      className="relative overflow-hidden [--slant:30px] [--stripe:5px] md:[--slant:56px] md:[--stripe:6px]"
    >
      {/* Tilted top edge */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-charcoal"
        style={{
          clipPath: "polygon(0 var(--slant), 100% 0, 100% 100%, 0 100%)",
        }}
      />
      <div
        data-g-edge
        aria-hidden="true"
        className="absolute inset-x-0 top-0 origin-left bg-red"
        style={{
          height: "calc(var(--slant) + var(--stripe))",
          clipPath:
            "polygon(0 var(--slant), 100% 0, 100% var(--stripe), 0 calc(var(--slant) + var(--stripe)))",
        }}
      />

      <div className="relative flex flex-col gap-5 px-4 pb-11 pt-[62px] md:gap-8 md:px-8 md:pb-[72px] md:pt-[108px] lg:px-20">
        {/* Header */}
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="flex min-w-0 flex-col gap-3 md:gap-4">
            <div data-g-label className="flex items-center gap-3 md:gap-4">
              <span className="inline-flex origin-left scale-[0.8] md:scale-100">
                <DotGrid count={6} redIndex={0} size={9} gap={10} />
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-silver md:text-[11px]">
                {galleryLabel}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 md:block">
              <SectionHeading
                id="gallery-heading"
                align="left"
                bar={false}
                reveal
                start="top 75%"
                delay={0.2}
                className="min-w-0"
                headingClassName="font-heading text-[60px] font-black uppercase italic leading-[0.85] tracking-heading text-paper md:text-[72px] lg:text-[96px]"
              >
                Gallery
              </SectionHeading>

              {!reduced && (
                <span data-g-actions className="shrink-0 md:hidden">
                  <PauseButton
                    playing={marquee.playing}
                    onToggle={marquee.toggle}
                  />
                </span>
              )}
            </div>
          </div>

          <div
            data-g-actions
            className="hidden shrink-0 items-center gap-3 md:flex"
          >
            {!reduced && (
              <PauseButton
                playing={marquee.playing}
                onToggle={marquee.toggle}
              />
            )}
            <ViewAllButton buttonRef={viewAll} onClick={openAll} />
          </div>
        </header>

        {/* Reels */}
        <div className="-mx-4 flex flex-col gap-2.5 md:-mx-8 md:gap-4 lg:-mx-20">
          <Reel
            {...reelProps}
            photos={ROW_ONE}
            offset={0}
            row={0}
            trackRef={marquee.trackRefs[0]}
            onHold={(reason, on) => marquee.hold(0, reason, on)}
          />

          {/* Speed line */}
          <div
            data-g-speedline
            aria-hidden="true"
            className="flex h-[3px] items-stretch gap-2.5"
          >
            <span className="flex-1 bg-red" />
            <span className="w-[120px] bg-silver" />
            <span className="w-[60px] bg-track" />
          </div>

          <Reel
            {...reelProps}
            photos={ROW_TWO}
            offset={ROW_ONE.length}
            row={1}
            trackRef={marquee.trackRefs[1]}
            onHold={(reason, on) => marquee.hold(1, reason, on)}
          />
        </div>

        {/* Footer */}
        <ViewAllButton
          data-g-actions
          buttonRef={mobileViewAll}
          onClick={openAll}
          className="w-full md:hidden"
        />
      </div>

      {open && (
        <Lightbox
          photos={photos}
          index={frame.index}
          prevIndex={frame.prevIndex}
          direction={frame.direction}
          reduced={reduced}
          onGoTo={goTo}
          onNext={next}
          onPrev={prev}
          onClose={close}
          originRef={origin}
          returnFocusTo={opener}
        />
      )}
    </section>
  );
}
