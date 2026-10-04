import { useGSAP } from "@gsap/react";
import { gsap, eases, ScrollTrigger, getLenis, expoOut } from "../../../motion";
import {
  CENTER_PATH,
  CENTER_X,
  FINISH_Y,
  HALF_WIDTH,
  ROAD_PATH,
  START_Y,
  VIEW_W,
  samplePath,
} from "./trackGeometry";

/** An event goes live as its row's middle crosses this fraction of the viewport. */
const LIVE_LINE = 0.6;
/** The list is scrolled fractionally further than the last row, so the car reaches the flag. */
const SPAN_SLACK = 0.975;
/** The car rolls onto the grid from this far above it. */
const INTRO_RISE = 380;
const INTRO_MS = 1100;
/** A sector button's jump. */
const JUMP_MS = 900;

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

export function useScheduleRace(
  scope,
  { enabled, reduced, rows, dayFirstRow, jumpRef },
) {
  useGSAP(
    () => {
      if (!enabled) return undefined;

      const q = gsap.utils.selector(scope);
      const list = q("[data-sch-list]")[0];
      const panel = q("[data-trk]")[0];
      const svg = q("[data-svg]")[0];
      const view = q("[data-trk-view]")[0];
      const cam = q("[data-cam]")[0];
      const trail = q("[data-trail]")[0];
      const car = q("[data-car]")[0];
      const streaks = q("[data-streaks]")[0];
      const ers = q("[data-ers]")[0];
      const steer = q("[data-steer]");
      const rowEls = q("[data-sch-row]");
      const dayEls = q("[data-sch-day]");
      const plates = q("[data-plate]");
      const gates = q("[data-gate]");
      const sectors = q("[data-sec]");
      const fills = q("[data-sec-fill]");
      const readout = q("[data-rd-pos]")[0];
      const rd = {
        n: q("[data-rd-n]")[0],
        time: q("[data-rd-time]")[0],
        tag: q("[data-rd-tag]")[0],
        title: q("[data-rd-title]")[0],
      };

      if (!list || !trail || !car) return undefined;

      // Both lines are read five times a frame, so they are flattened once (see samplePath).
      const road = samplePath(ROAD_PATH);
      const center = samplePath(CENTER_PATH);
      const L = road.length;
      const Lc = center.length;
      // The trail is the real path, so its dash has to use the real length.
      const trailLength = trail.getTotalLength();
      trail.style.strokeDasharray = `${trailLength} ${trailLength}`;

      const at = (track, len) => {
        const last = track.xs.length - 1;
        const t = (clamp(len, 0, track.length) / track.length) * last;
        const i = t | 0;
        const j = i < last ? i + 1 : last;
        const f = t - i;
        return {
          x: track.xs[i] + (track.xs[j] - track.xs[i]) * f,
          y: track.ys[i] + (track.ys[j] - track.ys[i]) * f,
        };
      };
      const heading = (track, len, step) => {
        const a = at(track, len + step);
        const b = at(track, len - step);
        return Math.atan2(a.y - b.y, a.x - b.x);
      };

      // measurement
      let span = 1;
      let rowFr = [];
      let dayFr = [];
      let VH = 700;

      const place = (group, fraction, width, lineSel, boardSel, gap) => {
        const len = fraction * Lc;
        const p = at(center, len);
        const angle = (heading(center, len, 2) * 180) / Math.PI;
        group
          .querySelector(lineSel)
          .setAttribute(
            "transform",
            `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${angle.toFixed(1)})`,
          );
        // Boards go on whichever side of the road has more room.
        const left = p.x > CENTER_X + 10;
        const bx = left
          ? p.x - HALF_WIDTH - gap - width
          : p.x + HALF_WIDTH + gap;
        group
          .querySelector(boardSel)
          .setAttribute(
            "transform",
            `translate(${bx.toFixed(1)} ${p.y.toFixed(1)})`,
          );
      };

      const measure = () => {
        const listRect = list.getBoundingClientRect();
        listTop = listRect.top + window.scrollY;
        const last = rowEls[rowEls.length - 1].getBoundingClientRect();
        span = Math.max(
          1,
          (last.top + last.height / 2 - listRect.top) / SPAN_SLACK,
        );

        const fraction = (el) => {
          const b = el.getBoundingClientRect();
          return (b.top - listRect.top + b.height / 2) / span;
        };
        rowFr = rowEls.map(fraction);
        dayFr = dayEls.map(fraction);

        const viewRect = view.getBoundingClientRect();
        VH =
          viewRect.width > 0
            ? (VIEW_W * viewRect.height) / viewRect.width
            : 700;
        svg.setAttribute("viewBox", `0 0 ${VIEW_W} ${VH.toFixed(1)}`);

        gates.forEach((g, i) =>
          place(g, dayFr[i], 132, "[data-gate-line]", "[data-gate-board]", 30),
        );
        plates.forEach((g, i) =>
          place(g, rowFr[i], 80, "[data-plate-line]", "[data-plate-board]", 26),
        );
      };

      // state
      /** Writing an attribute that is already there still invalidates style. Don't. */
      const flag = (el, name, on, memo, key) => {
        if (memo[key] === on) return;
        memo[key] = on;
        if (on) el.setAttribute(name, "");
        else el.removeAttribute(name);
      };
      const gateMemo = [];
      const plateMemo = [];
      const plateLive = [];
      const sectorMemo = [];
      const fillMemo = [];

      let listTop = 0;
      let cur = 0;
      let vel = 0;
      let prevVel = 0;
      let camY = null;
      let camSettled = true;
      let active = -2;
      let intro = reduced ? 1 : 0;
      let introStart = 0;
      let introRunning = false;
      let introDone = reduced;
      let frame = 0;
      let visible = false;

      const lineY = () => window.innerHeight * LIVE_LINE;
      const target = () =>
        clamp((window.scrollY + lineY() - listTop) / span, 0, 1);
      const activeAt = (p) => {
        let a = -1;
        for (let i = 0; i < rowFr.length; i++)
          if (rowFr[i] <= p + 0.0005) a = i;
        return a;
      };

      const flip = (el, text) => {
        if (!el || el.textContent === text) return;
        el.textContent = text;
        if (reduced) return;
        gsap.fromTo(
          el,
          { opacity: 0, yPercent: 60 },
          { opacity: 1, yPercent: 0, duration: 0.32, ease: eases.race },
        );
      };

      const paintReadout = () => {
        const row = active >= 0 ? rows[active] : null;
        if (active < 0) readout.setAttribute("data-next", "");
        else readout.removeAttribute("data-next");
        flip(rd.n, String(Math.max(0, active + 1)).padStart(2, "0"));
        flip(rd.time, row ? row.time : "—");
        flip(rd.tag, row ? row.tag : "—");
        flip(rd.title, row ? row.title : "—");
      };

      const setActive = (a) => {
        if (a === active) return;
        active = a;
        rowEls.forEach((el, i) => {
          if (i === a) el.setAttribute("data-live", "");
          else el.removeAttribute("data-live");
        });
        paintReadout();
      };

      // frame
      const draw = (p) => {
        const len = p * L;
        const point = at(road, len);
        const h = heading(road, len, 4);
        const ahead = heading(road, len + 46, 4);

        let delta = ahead - h;
        while (delta > Math.PI) delta -= 2 * Math.PI;
        while (delta < -Math.PI) delta += 2 * Math.PI;
        const steerDeg = clamp(((delta * 180) / Math.PI) * 1.1, -26, 26);

        const speed = reduced ? 0 : clamp(vel * 1.4, 0, 1);
        // A touch of yaw: the rear steps out into the corner at speed, and the front
        // wheels counter it.
        const slip = steerDeg * 0.22 * speed;
        const y = point.y + (1 - intro) * -INTRO_RISE;

        car.setAttribute(
          "transform",
          `translate(${point.x.toFixed(2)} ${y.toFixed(2)}) rotate(${(
            (h * 180) / Math.PI +
            slip
          ).toFixed(2)})`,
        );
        steer.forEach((el) => {
          const side = Number(el.getAttribute("data-steer"));
          el.setAttribute(
            "transform",
            `rotate(${(steerDeg - slip).toFixed(2)} -22 ${side * 18.5})`,
          );
        });
        // The energy-recovery light shows while the car is slowing.
        ers.setAttribute(
          "opacity",
          !reduced && vel > 0.05 && vel < prevVel - 0.002 ? 1 : 0.2,
        );
        prevVel = vel;

        // Broadcast camera: eases after the car, looks ahead and pulls back at speed.
        const camMin = START_Y - VH * 0.42;
        const camMax = Math.max(camMin, FINISH_Y + 170 - VH);
        const want = clamp(
          point.y - VH * LIVE_LINE + speed * VH * 0.1,
          camMin,
          camMax,
        );
        camY = camY === null || reduced ? want : camY + (want - camY) * 0.14;
        if (Math.abs(want - camY) < 0.05) camY = want;
        camSettled = camY === want;

        const zoom = 1 - 0.06 * speed;
        const dy = point.y - camY;
        cam.setAttribute(
          "transform",
          `translate(${VIEW_W / 2} ${dy.toFixed(2)}) scale(${zoom.toFixed(4)}) translate(${-VIEW_W / 2} ${(-(camY + dy)).toFixed(2)})`,
        );

        trail.style.strokeDashoffset = (trailLength * (1 - p)).toFixed(2);

        const passed = (f) => f <= p + 0.0005;
        gates.forEach((g, i) =>
          flag(g, "data-passed", passed(dayFr[i]), gateMemo, i),
        );

        const a = activeAt(p);
        plates.forEach((g, i) => {
          flag(g, "data-passed", passed(rowFr[i]), plateMemo, i);
          flag(g, "data-live", i === a, plateLive, i);
        });

        sectors.forEach((button, d) => {
          const from = dayFr[d];
          const to = d < dayFr.length - 1 ? dayFr[d + 1] : 1;
          const k = clamp((p - from) / (to - from || 1), 0, 1);
          const scale = k.toFixed(3);
          if (fillMemo[d] !== scale) {
            fillMemo[d] = scale;
            fills[d].style.transform = `scaleX(${scale})`;
          }
          flag(
            button,
            "data-cur",
            p >= from - 0.0005 && (d === dayFr.length - 1 || p < to - 0.0005),
            sectorMemo,
            d,
          );
          flag(button, "data-passed", k >= 1, sectorMemo, `p${d}`);
        });

        setActive(a);
      };

      const tick = () => {
        frame = 0;
        if (!visible) return;

        const t = target();

        if (reduced) {
          // No tween: the car stands at the live event's checkpoint.
          const a = activeAt(t);
          cur = t >= 0.999 ? 1 : a >= 0 ? rowFr[a] : 0;
          draw(cur);
          streaks.setAttribute("opacity", 0);
          return;
        }

        const prev = cur;
        cur += (t - cur) * 0.12;
        if (Math.abs(t - cur) < 0.00004) cur = t;

        let want = clamp(Math.abs(cur - prev) * 380, 0, 1);
        if (introRunning) {
          const k = clamp((performance.now() - introStart) / INTRO_MS, 0, 1);
          intro = 1 - Math.pow(1 - k, 4);
          if (k >= 1) {
            introRunning = false;
            introDone = true;
          }
          want = Math.max(want, k < 0.85 ? 0.9 : 0);
        }
        vel += (want - vel) * 0.18;

        draw(cur);
        streaks.setAttribute("opacity", vel.toFixed(3));

        if (cur !== t || vel > 0.01 || introRunning || !camSettled)
          frame = requestAnimationFrame(tick);
        else {
          vel = 0;
          streaks.setAttribute("opacity", 0);
        }
      };

      const kick = () => {
        if (!frame) frame = requestAnimationFrame(tick);
      };

      // wiring
      measure();
      draw(0);

      const driver = ScrollTrigger.create({
        trigger: list,
        start: "top bottom",
        end: "bottom top",
        onUpdate: kick,
        onToggle: (self) => {
          visible = self.isActive;
          if (visible) kick();
        },
      });
      visible = driver.isActive;

      const introTrigger = reduced
        ? null
        : ScrollTrigger.create({
            trigger: panel,
            start: "top 75%",
            once: true,
            onEnter: () => {
              if (introDone) return;
              introRunning = true;
              introStart = performance.now();
              kick();
            },
          });

      const onRefresh = () => {
        measure();
        camY = null;
        kick();
      };
      ScrollTrigger.addEventListener("refresh", onRefresh);

      const onVisibility = () => {
        if (!document.hidden) kick();
      };
      document.addEventListener("visibilitychange", onVisibility);

      // A sector button puts that day's first event on the live line.
      jumpRef.current = (dayIndex) => {
        const rect = rowEls[dayFirstRow[dayIndex]].getBoundingClientRect();
        const to = Math.max(
          0,
          window.scrollY + rect.top + rect.height / 2 - lineY() + 4,
        );
        const lenis = getLenis();
        if (reduced || !lenis) {
          window.scrollTo({ top: to, behavior: "auto" });
          kick();
          return;
        }
        lenis.scrollTo(to, { duration: JUMP_MS / 1000, easing: expoOut });
      };

      kick();

      return () => {
        if (frame) cancelAnimationFrame(frame);
        ScrollTrigger.removeEventListener("refresh", onRefresh);
        document.removeEventListener("visibilitychange", onVisibility);
        introTrigger?.kill();
        driver.kill();
        jumpRef.current = null;
      };
    },
    { scope, dependencies: [enabled, reduced, rows, dayFirstRow, jumpRef] },
  );
}
