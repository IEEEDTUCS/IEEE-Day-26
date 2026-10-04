import { Fragment, useMemo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ScheduleTitle } from "./ScheduleTitle";
import { ScheduleDayHeader } from "./ScheduleDayHeader";
import { ScheduleRow } from "./ScheduleRow";
import { TrackPanel } from "./TrackPanel";
import { MiniTrack } from "./MiniTrack";
import { useScheduleRace } from "./useScheduleRace";
import { useMiniTrack } from "./useMiniTrack";
import { CornerSlabs } from "../../ui";
import {
  gsap,
  eases,
  ScrollTrigger,
  buildHeadingReveal,
  useReducedMotion,
} from "../../../motion";
import { useMediaQuery } from "../../../hooks";
import { getScheduleDays, scheduleSection } from "../../../content";

const HEADING_ID = "schedule-heading";

// Where each kind of block reveals, as a fraction of the viewport.
const LINES = { day: { lg: 0.86, sm: 0.88 }, row: { lg: 0.8, sm: 0.82 } };
// Phone reveals run about 20% shorter (docs/MOTION.md rule 6).
const BEATS = {
  lg: { wipe: 0.7, slide: 0.6, slideAt: 0.26, roll: 0.5 },
  sm: { wipe: 0.56, slide: 0.48, slideAt: 0.2, roll: 0.4 },
};

const CUE = ["bg-track", "bg-steel", "bg-red"];
const CUE_CLIP =
  "[clip-path:polygon(0_0,50%_55%,100%_0,100%_45%,50%_100%,0_45%)]";

export function Schedule() {
  const scope = useRef(null);
  const jumpRef = useRef(null);
  const armedRef = useRef(false);

  const reduced = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const days = useMemo(() => getScheduleDays(), []);
  const events = useMemo(() => days.flatMap((day) => day.events), [days]);
  // What the readout reads out, in the same order as the rows.
  const rows = useMemo(
    () =>
      events.map((event) => ({
        time: event.start
          ? `${event.start.time} ${event.start.ampm}`
          : "Time TBA",
        title: event.title,
        tag: event.tag,
      })),
    [events],
  );
  const dayFirstRow = useMemo(
    () =>
      days.map((_, d) =>
        days.slice(0, d).reduce((n, day) => n + day.events.length, 0),
      ),
    [days],
  );

  useScheduleRace(scope, {
    enabled: isDesktop,
    reduced,
    rows,
    dayFirstRow,
    jumpRef,
  });
  useMiniTrack(scope, {
    enabled: !isDesktop,
    reduced,
    armedRef,
    dayFirstRow,
    jumpRef,
  });

  // Reveal
  useGSAP(
    () => {
      if (reduced) {
        armedRef.current = true;
        return undefined;
      }

      const q = gsap.utils.selector(scope);
      const beats = isDesktop ? BEATS.lg : BEATS.sm;
      const lines = isDesktop ? "lg" : "sm";

      const slabs = q("[data-slab]");
      const slabBar = q("[data-slab-bar]");
      const words = q("[data-sch-word]");
      const stripes = q("[data-sch-stripe]");
      const cue = q("[data-sch-cue]")[0];
      const rowEls = q("[data-sch-row]");
      const dayEls = q("[data-sch-day]");
      const plates = q("[data-plate]");
      const gates = q("[data-gate]");

      // Hidden states live here, never in CSS: a visitor without JS, or one the nav drops
      // into the middle of the section, must see it finished.
      gsap.set(slabs, { xPercent: 110 });
      gsap.set(slabBar, { scaleX: 0 });
      gsap.set(q("[data-pop]"), { opacity: 0 });
      gsap.set(cue, { display: "flex" });

      rowEls.forEach((row) => {
        gsap.set(row.querySelector("[data-row-in]"), { opacity: 0, x: 44 });
        gsap.set(row.querySelector("[data-row-bar]"), { scaleY: 0 });
        gsap.set(row.querySelector("[data-row-rule]"), { scaleX: 0 });
        gsap.set(row.querySelector("[data-row-cp]"), { opacity: 0 });
        gsap.set(row.querySelectorAll("[data-digit]"), { yPercent: 105 });
      });
      dayEls.forEach((day) => {
        gsap.set(day.querySelectorAll("[data-day-item]"), {
          opacity: 0,
          x: -28,
        });
        gsap.set(day.querySelector("[data-day-rule]"), { scaleX: 0, x: 0 });
        gsap.set(day.querySelector("[data-day-under]"), { scaleX: 0 });
        gsap.set(day.querySelector("[data-day-cp]"), { opacity: 0 });
      });

      // The title is not gated: it reveals the moment it crosses, like every other heading.
      const title = gsap.timeline({
        scrollTrigger: {
          trigger: q("[data-sch-head]")[0],
          start: "top 80%",
          once: true,
        },
      });
      title
        .to(
          slabs,
          { xPercent: 0, duration: 0.8, ease: eases.race, stagger: 0.08 },
          0,
        )
        .to(slabBar, { scaleX: 1, duration: 0.6, ease: eases.race }, 0.35);
      words.forEach((word, i) =>
        title.add(
          buildHeadingReveal({
            text: word,
            stripe: stripes[i],
            x: -20,
            skewX: -8,
            stripeDuration: 0.34,
            textDuration: 0.7,
            retractAt: "<0.02",
          }),
          i * 0.12,
        ),
      );

      const cuePulse = cue
        ? gsap.to(cue.lastElementChild, {
            opacity: 0.35,
            duration: 0.8,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          })
        : null;

      const popBoard = (board) => {
        if (!board) return;
        gsap.fromTo(
          board.querySelector("[data-pop]"),
          { opacity: 0, scaleX: 0.2 },
          { opacity: 1, scaleX: 1, duration: 0.45, ease: eases.race },
        );
      };

      const revealRow = (row, index) => {
        const wipe = row.querySelector("[data-row-wipe]");
        const half = beats.wipe * 0.48;
        gsap
          .timeline()
          .to(
            row.querySelector("[data-row-rule]"),
            { scaleX: 1, duration: 0.6, ease: eases.race },
            0,
          )
          .to(
            row.querySelector("[data-row-bar]"),
            { scaleY: 0.3, duration: 0.35, ease: eases.race },
            0,
          )
          .fromTo(
            wipe,
            { scaleX: 0, transformOrigin: "left center" },
            { scaleX: 1, duration: half, ease: eases.snap },
            0,
          )
          .to(
            wipe,
            {
              scaleX: 0,
              transformOrigin: "right center",
              duration: half,
              ease: eases.snap,
            },
            beats.wipe * 0.52,
          )
          .to(
            row.querySelector("[data-row-cp]"),
            { opacity: 1, duration: 0.3, ease: "none" },
            0.2,
          )
          .to(
            row.querySelector("[data-row-in]"),
            { opacity: 1, x: 0, duration: beats.slide, ease: eases.race },
            beats.slideAt,
          )
          .to(
            row.querySelectorAll("[data-digit]"),
            {
              yPercent: 0,
              duration: beats.roll,
              ease: eases.race,
              stagger: 0.05,
            },
            0.34,
          )
          // Hand the row back to CSS, which owns hover and the live inversion.
          .set(
            [
              row.querySelector("[data-row-in]"),
              row.querySelector("[data-row-bar]"),
            ],
            {
              clearProps: "transform,opacity",
            },
          );

        popBoard(plates[index]);
      };

      const revealDay = (day, index) => {
        gsap
          .timeline()
          .to(
            day.querySelectorAll("[data-day-item]"),
            {
              opacity: 1,
              x: 0,
              duration: beats.slide,
              ease: eases.race,
              stagger: 0.05,
            },
            0,
          )
          .to(
            day.querySelector("[data-day-rule]"),
            { scaleX: 1, duration: beats.slide, ease: eases.race },
            0,
          )
          .to(
            day.querySelector("[data-day-under]"),
            { scaleX: 1, duration: 0.7, ease: eases.race },
            0.1,
          )
          .to(
            day.querySelector("[data-day-cp]"),
            { opacity: 1, duration: 0.3, ease: "none" },
            0.2,
          );

        popBoard(gates[index]);
        if (index === 0 && cue) {
          cuePulse?.kill();
          gsap.to(cue, { opacity: 0, duration: 0.25, ease: "none" });
        }
      };

      // Nothing reveals until the visitor has really scrolled, even if a tall screen is
      // already showing the whole section.
      const triggers = [];
      const arm = () => {
        armedRef.current = true;
        [
          [dayEls, LINES.day[lines], revealDay],
          [rowEls, LINES.row[lines], revealRow],
        ].forEach(([els, line, reveal]) =>
          els.forEach((el, i) => {
            if (el.getBoundingClientRect().top < window.innerHeight * line) {
              reveal(el, i);
              return;
            }
            triggers.push(
              ScrollTrigger.create({
                trigger: el,
                start: `top ${line * 100}%`,
                once: true,
                onEnter: () => reveal(el, i),
              }),
            );
          }),
        );
      };

      const from = window.scrollY;
      const onScroll = () => {
        if (Math.abs(window.scrollY - from) <= 2) return;
        window.removeEventListener("scroll", onScroll);
        arm();
      };
      window.addEventListener("scroll", onScroll, { passive: true });

      return () => {
        window.removeEventListener("scroll", onScroll);
        triggers.forEach((trigger) => trigger.kill());
      };
    },
    { scope, dependencies: [reduced, isDesktop] },
  );

  const onJump = (dayIndex) => jumpRef.current?.(dayIndex);

  return (
    <section
      id="schedule"
      ref={scope}
      aria-labelledby={HEADING_ID}
      className="relative mb-12 mt-24 overflow-clip bg-paper pb-18 pt-16 text-charcoal lg:mb-16 lg:mt-32 lg:pb-32 lg:pt-24"
    >
      <CornerSlabs />

      <div className="relative mx-auto w-full max-w-350 px-4 lg:px-[clamp(32px,4.44vw,64px)]">
        <div className="mb-3.5 flex items-center gap-2.5 lg:mb-4.5 lg:gap-4">
          <span
            aria-hidden="true"
            className="h-1 w-6 flex-none bg-red lg:h-[5px] lg:w-10"
          />
          <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.26em] lg:text-xs lg:tracking-[0.38em]">
            {scheduleSection.meta}
          </span>
          <span aria-hidden="true" className="h-px flex-1 bg-steel" />
          <span aria-hidden="true" className="flex flex-none gap-1.5">
            {["bg-charcoal", "bg-charcoal", "bg-red"].map((tone, i) => (
              <i
                key={i}
                className={`block size-1.5 rounded-dot lg:size-2 ${tone}`}
              />
            ))}
          </span>
        </div>

        <ScheduleTitle id={HEADING_ID} />

        <div className="grid grid-cols-[44px_minmax(0,1fr)] gap-x-3 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-[clamp(32px,3.89vw,56px)]">
          <TrackPanel
            days={days}
            events={events}
            onJump={onJump}
            showTrack={isDesktop}
          />
          {!isDesktop && <MiniTrack />}

          <div
            data-sch-list
            className="relative col-start-2 pb-12 pt-5 lg:pb-[calc(40svh-30px)] lg:pt-0"
          >
            {/* Until Day 01 reveals, something has to say "keep going". */}
            <div
              data-sch-cue
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-5 hidden flex-col items-start gap-[3px] lg:top-1.5"
            >
              {CUE.map((tone) => (
                <i
                  key={tone}
                  className={`block h-[11px] w-[22px] ${tone} ${CUE_CLIP}`}
                />
              ))}
            </div>

            {days.map((day, d) => (
              <Fragment key={day.id}>
                <div className={d > 0 ? "mt-9 lg:mt-16" : ""}>
                  <ScheduleDayHeader
                    day={day}
                    index={d}
                    count={day.events.length}
                  />
                </div>
                {day.events.map((event, i) => (
                  <ScheduleRow
                    key={event.id}
                    event={event}
                    index={dayFirstRow[d] + i}
                  />
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
