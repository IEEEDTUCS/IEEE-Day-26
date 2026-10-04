import { useGSAP } from "@gsap/react";
import {
  gsap,
  eases,
  ScrollTrigger,
  buildHeadingReveal,
  useReducedMotion,
} from "../../../motion";
import { useMediaQuery } from "../../../hooks";
import { GLOBE_ORIGIN, ORBIT_PATH } from "./GlobeArt";

// Where the orbit car sits when nothing is allowed to move.
const ORBIT_PARKED = 0.12;

// Orbit car path
const orbitAt = (start, end) => ({
  transformOrigin: "50% 50%",
  motionPath: { path: ORBIT_PATH, start, end, autoRotate: true },
});

const TOP = {
  plate: 0.1,
  slabs: [0.15, 0.25],
  rule: 0.3,
  kicker: 0.35,
  lights: 0.75,
  lightStep: 0.2,
  words: [0.3, 0.42],
  circles: [0.3, 0.42],
  slabBar: 0.5,
  globe: 0.6,
  streaks: 0.7,
  crosshairs: 0.8,
  dateRule: 0.8,
  hairlines: 0.9,
  dots: 0.9,
  dateItems: 0.95,
  orbit: 1.0,
  orbitCar: 1.1,
  dayFills: 1.35,
  dayStep: 0.14,
  pin: 1.4,
};

const DARK = {
  edge: 0,
  stats: 0.12,
  statStep: 0.08,
  dividers: 0.16,
  count: 0.3,
  divider: 0.45,
  allianceLabel: 0.55,
  allianceHeading: 0.6,
  trackCircle: 0.6,
  cards: [0.85, 0.93],
  track: 1.05,
  badge: 1.2,
  cta: 1.25,
  suffix: 1.5,
  chevrons: 1.5,
  chevronStep: 0.1,
  circles: [1.25, 1.33],
  bars: 1.2,
  loops: 1.4,
  pulse: 1.8,
};

export function useAboutMotion(scope) {
  const reduced = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useGSAP(
    () => {
      const q = gsap.utils.selector(scope);

      const pings = q("[data-ab-ping]");
      const orbitCar = q("[data-ab-orbit-car]");

      if (reduced) {
        gsap.set(pings, { opacity: 0 });
        q("[data-ab-meridian]").forEach((el) =>
          gsap.set(el, {
            scaleX: Number(el.dataset.scale),
            svgOrigin: GLOBE_ORIGIN,
          }),
        );
        gsap.set(orbitCar, orbitAt(ORBIT_PARKED, ORBIT_PARKED));
        return undefined;
      }

      const slabs = q("[data-slab]");
      const slabBar = q("[data-slab-bar]");
      const plate = q("[data-ab-plate]");
      const kicker = q("[data-ab-kicker]");
      const titleRule = q("[data-ab-rule]");
      const lights = q("[data-ab-light]");
      const words = q("[data-ab-word]");
      const stripes = q("[data-ab-stripe]");
      const crosshairs = q("[data-ab-cross]");
      const circles = q("[data-ab-circle]");
      const streaks = q("[data-ab-streak]");
      const hairlines = q("[data-ab-hairline]");
      const globe = q("[data-ab-globe]");
      const meridians = q("[data-ab-meridian]");
      const orbit = q("[data-ab-orbit]");
      const dots = q("[data-ab-dots]");
      const pin = q("[data-ab-pin]");
      const dateRule = q("[data-ab-date-rule]");
      const dateItems = q("[data-ab-date-item]");
      const dayFills = q("[data-ab-day-fill]");
      const story = q("[data-ab-story]");

      const edge = q("[data-ab-edge]");
      const stats = q("[data-ab-stat]");
      const statDividers = q("[data-ab-stat-divider]");
      const counts = q("[data-ab-count]");
      const suffixes = q("[data-ab-suffix]");
      const chevrons = q("[data-ab-chevron]");
      const bars = q("[data-ab-bar]");
      const glints = q("[data-ab-glint]");
      const divider = q("[data-ab-divider]");
      const allianceLabel = q("[data-ab-alliance]");
      const allyWord = q("[data-ab-ally-word]");
      const allyStripe = q("[data-ab-ally-stripe]");
      const cards = q("[data-ab-card-wrap]");
      const tracks = q("[data-ab-track]");
      const shuttles = q("[data-ab-shuttle]");
      const badges = q("[data-ab-badge]");
      const cta = q("[data-ab-cta]");
      const decoCircles = q("[data-ab-circle-deco]");

      // Hidden states live here, never in CSS — a visitor without JS, or one
      // the nav drops into the middle of the section, must see it finished.
      gsap.set(slabs, { opacity: 0, x: 48 });
      gsap.set([...slabBar], { scaleX: 0, transformOrigin: "right center" });
      gsap.set([...plate, ...story], { opacity: 0, x: -32 });
      gsap.set(
        [...kicker, ...crosshairs, ...globe, ...orbit, ...dots, ...pin],
        {
          opacity: 0,
        },
      );
      gsap.set(titleRule, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(lights, { opacity: 0.12 });
      gsap.set(circles, { opacity: 0, scale: 0.6 });
      gsap.set([...streaks, ...hairlines], {
        scaleX: 0,
        transformOrigin: "left center",
      });
      gsap.set(dayFills, { scaleX: 0 });
      gsap.set(orbitCar, { opacity: 0, ...orbitAt(0, 0) });
      gsap.set(dateRule, { scaleY: 0, transformOrigin: "top center" });
      gsap.set(dateItems, { opacity: 0, x: -32 });

      gsap.set([...edge, ...divider], {
        scaleX: 0,
        transformOrigin: "left center",
      });
      gsap.set([...stats, ...allianceLabel, ...cta], { opacity: 0, x: -32 });
      gsap.set([...statDividers, ...suffixes], { opacity: 0 });
      gsap.set(chevrons, { opacity: 0.12 });
      gsap.set(decoCircles, { opacity: 0, scale: 0.6 });
      gsap.set(badges, { opacity: 0, scale: 0.3, rotate: -14 });
      cards.forEach((el) =>
        gsap.set(el, { opacity: 0, x: el.dataset.side === "right" ? 48 : -48 }),
      );
      tracks.forEach((el) =>
        gsap.set(
          el,
          el.dataset.axis === "x"
            ? { scaleX: 0, transformOrigin: "left center" }
            : { scaleY: 0, transformOrigin: "center top" },
        ),
      );
      if (isDesktop) {
        gsap.set(bars, { scaleX: 0, transformOrigin: "left center" });
      }

      // Idle loops
      const groups = {
        paper: { loops: [], armed: false }, // meridians, orbit car, ping rings
        dark: { loops: [], armed: false }, // track shuttle, speed-line glint
        pulse: { loops: [], armed: false }, // the red chevron, on its own beat
      };
      const paperLoops = groups.paper.loops;

      meridians.forEach((el) => {
        const phase = Number(el.dataset.phase) || 0;
        const spin = gsap.fromTo(
          el,
          { scaleX: 1 },
          {
            scaleX: -1,
            svgOrigin: GLOBE_ORIGIN,
            duration: 12,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            paused: true,
          },
        );
        // Same 24s cycle, each meridian a couple of seconds further round it.
        spin.totalTime(1 + phase * 2);
        paperLoops.push(spin);
      });

      if (orbitCar[0]) {
        paperLoops.push(
          gsap.to(orbitCar, {
            duration: 9,
            ease: "none",
            repeat: -1,
            paused: true,
            ...orbitAt(0, 1),
          }),
        );
      }

      pings.forEach((el, i) => {
        const ping = gsap.fromTo(
          el,
          { scale: 1, opacity: 1 },
          {
            scale: 4.2,
            opacity: 0,
            duration: 2.4,
            ease: eases.race,
            repeat: -1,
            paused: true,
          },
        );
        ping.totalTime(i * 1.2);
        paperLoops.push(ping);
      });

      shuttles.forEach((el) => {
        const axis = el.dataset.axis === "x" ? "xPercent" : "yPercent";
        groups.dark.loops.push(
          gsap.fromTo(
            el,
            { [axis]: -46 },
            {
              [axis]: 46,
              duration: el.dataset.axis === "x" ? 2.4 : 2,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              paused: true,
            },
          ),
        );
      });

      if (isDesktop) {
        glints.forEach((el) =>
          groups.dark.loops.push(
            gsap.fromTo(
              el,
              { xPercent: -100 },
              {
                xPercent: 720,
                duration: Number(el.dataset.seconds) || 3,
                ease: "none",
                repeat: -1,
                paused: true,
              },
            ),
          ),
        );
      }

      groups.pulse.loops.push(
        gsap.to(chevrons[chevrons.length - 1], {
          opacity: 0.4,
          duration: 1.2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          paused: true,
        }),
      );

      const allGroups = Object.values(groups);
      const holds = new Set();

      const apply = () => {
        const free = !holds.size;
        allGroups.forEach(({ loops: group, armed }) =>
          group.forEach((loop) =>
            armed && free ? loop.resume() : loop.pause(),
          ),
        );
      };

      const arm = (name) => () => {
        groups[name].armed = true;
        apply();
      };

      const hold = (reason, on) => {
        if (on) holds.add(reason);
        else holds.delete(reason);
        apply();
      };

      // Top entrance
      const top = gsap.timeline({
        scrollTrigger: {
          trigger: q("[data-ab-top]")[0],
          start: "top 80%",
          once: true,
        },
      });

      slabs.forEach((el, i) =>
        top.to(
          el,
          { opacity: 1, x: 0, duration: 0.8, ease: eases.race },
          TOP.slabs[i],
        ),
      );
      top
        .to(
          plate,
          { opacity: 1, x: 0, duration: 0.6, ease: eases.race },
          TOP.plate,
        )
        .to(titleRule, { scaleX: 1, duration: 0.8, ease: eases.race }, TOP.rule)
        .to(kicker, { opacity: 1, duration: 0.5, ease: "none" }, TOP.kicker)
        .to(
          lights,
          { opacity: 1, duration: 0.15, ease: "none", stagger: TOP.lightStep },
          TOP.lights,
        );

      words.forEach((word, i) =>
        top.add(
          buildHeadingReveal({
            text: word,
            stripe: stripes[i],
            x: -20,
            skewX: -8,
            stripeDuration: 0.34,
            textDuration: 0.7,
            retractAt: "<0.02",
          }),
          TOP.words[i],
        ),
      );

      circles.forEach((el, i) =>
        top.to(
          el,
          { opacity: 1, scale: 1, duration: 0.9, ease: eases.race },
          TOP.circles[i],
        ),
      );

      top
        .to(
          slabBar,
          { scaleX: 1, duration: 0.6, ease: eases.race },
          TOP.slabBar,
        )
        .to(globe, { opacity: 1, duration: 0.8, ease: "none" }, TOP.globe)
        .to(
          streaks,
          {
            scaleX: 1,
            transformOrigin: "left center",
            duration: 0.6,
            ease: eases.race,
            stagger: 0.05,
          },
          TOP.streaks,
        )
        .to(
          hairlines,
          {
            scaleX: 1,
            transformOrigin: "left center",
            duration: 0.8,
            ease: eases.race,
            stagger: 0.1,
          },
          TOP.hairlines,
        )
        .to(
          crosshairs,
          { opacity: 1, duration: 0.4, ease: "none", stagger: 0.05 },
          TOP.crosshairs,
        )
        .to(
          dateRule,
          { scaleY: 1, duration: 0.6, ease: eases.race },
          TOP.dateRule,
        )
        .to(dots, { opacity: 1, duration: 0.5, ease: "none" }, TOP.dots)
        .to(
          dateItems,
          { opacity: 1, x: 0, duration: 0.6, ease: eases.race, stagger: 0.05 },
          TOP.dateItems,
        )
        .to(
          story,
          { opacity: 1, x: 0, duration: 0.6, ease: eases.race },
          TOP.dateRule,
        )
        .to(orbit, { opacity: 1, duration: 0.6, ease: "none" }, TOP.orbit)
        .to(orbitCar, { opacity: 1, duration: 0.4, ease: "none" }, TOP.orbitCar)
        .to(
          dayFills,
          {
            scaleX: 1,
            duration: 0.35,
            ease: eases.snap,
            stagger: TOP.dayStep,
            transformOrigin: "left center",
          },
          TOP.dayFills,
        )
        .to(pin, { opacity: 1, duration: 0.4, ease: "none" }, TOP.pin)
        .call(arm("paper"), null, TOP.pin);

      // Dark entrance
      const dark = gsap.timeline({
        scrollTrigger: {
          trigger: q("[data-ab-dark]")[0],
          start: "top 80%",
          once: true,
        },
      });

      dark.to(edge, { scaleX: 1, duration: 0.7, ease: eases.race }, DARK.edge);

      stats.forEach((el, i) =>
        dark.to(
          el,
          { opacity: 1, x: 0, duration: 0.7, ease: eases.race },
          DARK.stats + i * DARK.statStep,
        ),
      );
      statDividers.forEach((el, i) =>
        dark.to(
          el,
          { opacity: 1, duration: 0.3, ease: "none" },
          DARK.dividers + i * DARK.statStep,
        ),
      );

      counts.forEach((el) => {
        const value = Number(el.dataset.value);
        const proxy = { value: 0 };
        el.textContent = "0";
        dark.to(
          proxy,
          {
            value,
            duration: 1.2,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = String(Math.round(proxy.value));
            },
          },
          DARK.count,
        );
      });

      dark
        .to(suffixes, { opacity: 1, duration: 0.2, ease: "none" }, DARK.suffix)
        .to(
          chevrons,
          {
            opacity: 1,
            duration: 0.25,
            ease: "none",
            stagger: DARK.chevronStep,
          },
          DARK.chevrons,
        )
        .to(
          divider,
          { scaleX: 1, duration: 0.6, ease: eases.race },
          DARK.divider,
        )
        .to(
          allianceLabel,
          { opacity: 1, x: 0, duration: 0.5, ease: eases.race },
          DARK.allianceLabel,
        )
        .add(
          buildHeadingReveal({
            text: allyWord[0],
            stripe: allyStripe[0],
            x: -20,
            skewX: -8,
            stripeDuration: 0.34,
            textDuration: 0.7,
            retractAt: "<0.02",
          }),
          DARK.allianceHeading,
        );

      cards.forEach((el, i) =>
        dark.to(
          el,
          { opacity: 1, x: 0, duration: 0.8, ease: eases.race },
          DARK.cards[i],
        ),
      );
      tracks.forEach((el) =>
        dark.to(
          el,
          el.dataset.axis === "x"
            ? { scaleX: 1, duration: 0.7, ease: eases.race }
            : { scaleY: 1, duration: 0.5, ease: eases.race },
          DARK.track,
        ),
      );

      dark
        .to(
          badges,
          { opacity: 1, scale: 1, rotate: 0, duration: 0.5, ease: eases.snap },
          DARK.badge,
        )
        .to(
          cta,
          { opacity: 1, x: 0, duration: 0.6, ease: eases.race },
          DARK.cta,
        )
        .to(
          decoCircles[2],
          { opacity: 1, scale: 1, duration: 0.7, ease: eases.race },
          DARK.trackCircle,
        )
        .to(
          decoCircles[0],
          { opacity: 1, scale: 1, duration: 0.7, ease: eases.race },
          DARK.circles[0],
        )
        .to(
          decoCircles[1],
          { opacity: 1, scale: 1, duration: 0.7, ease: eases.race },
          DARK.circles[1],
        );

      if (isDesktop) {
        dark.to(
          bars,
          { scaleX: 1, duration: 0.7, ease: eases.race, stagger: 0.05 },
          DARK.bars,
        );
      }

      dark
        .call(arm("dark"), null, DARK.loops)
        // The red chevron idles on its own beat, after the chevrons have lit.
        .call(arm("pulse"), null, DARK.pulse);

      if (!isDesktop) {
        top.timeScale(1.25);
        dark.timeScale(1.25);
      }

      if (import.meta.env.DEV) {
        window.__about = { top, dark, groups };
      }

      // Nothing loops off screen, or in a tab nobody is looking at.
      const watcher = ScrollTrigger.create({
        trigger: scope.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => hold("offscreen", !self.isActive),
      });
      const onVisibility = () => hold("hidden", document.hidden);
      document.addEventListener("visibilitychange", onVisibility);

      return () => {
        if (import.meta.env.DEV) delete window.__about;
        document.removeEventListener("visibilitychange", onVisibility);
        watcher.kill();
        allGroups.forEach(({ loops: group }) => group.forEach((l) => l.kill()));
      };
    },
    { scope, dependencies: [reduced, isDesktop] },
  );
}
