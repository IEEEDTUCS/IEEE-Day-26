import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, getLenis, expoOut } from "../../../motion";

/** Scroll speed is smoothed over this long, signed, so the car leans the way you scroll. */
const SMOOTH_MS = 140;
/** Critically damped spring for the surge. */
const OMEGA = 13;
/** How far the car is allowed to run ahead of, or drop behind, its sticky line. */
const SURGE_BACK = -5;
const SURGE_AHEAD = 9;
/** Crossing a checkpoint nudges the car forward. */
const CHECKPOINT_KICK = 70;
/** A sector button's jump. */
const JUMP_MS = 900;
const FLASH_MS = 520;
const RACE = "cubic-bezier(0.16, 1, 0.3, 1)";

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

export function useMiniTrack(
  scope,
  { enabled, reduced, armedRef, dayFirstRow, jumpRef },
) {
  useGSAP(
    () => {
      if (!enabled) return undefined;

      const q = gsap.utils.selector(scope);
      const list = q("[data-sch-list]")[0];
      const car = q("[data-mcar]")[0];
      if (!list || !car) return undefined;

      const body = car.querySelector("[data-mbody]");
      const streak = car.querySelector("[data-mstreak]");
      const ers = car.querySelector("[data-ers]");
      const rowEls = q("[data-sch-row]");
      const dayEls = q("[data-sch-day]");
      const sectors = q("[data-sec]");
      const fills = q("[data-sec-fill]");

      // Web Animations won't resolve a var() in a keyframe, so read the tokens once.
      const tokens = getComputedStyle(document.documentElement);
      const RED = tokens.getPropertyValue("--color-red").trim();
      const RED_BRIGHT = tokens.getPropertyValue("--color-red-bright").trim();

      // ---- cached geometry -------------------------------------------------
      let rowAt = [];
      let dayAt = [];

      const measure = () => {
        const top = list.getBoundingClientRect().top;
        const offsets = (el) => {
          const b = el.getBoundingClientRect();
          return { top: b.top - top, center: b.top - top + b.height / 2 };
        };
        rowAt = rowEls.map(offsets);
        dayAt = dayEls.map(offsets);
      };

      // State
      const rowOn = [];
      const dayOn = [];
      const sectorState = [];
      let active = -2;
      let frame = 0;
      let last = 0;
      let lastScroll = window.scrollY;
      let smoothed = 0;
      let speed = 0;
      let springPos = 0;
      let springVel = 0;
      let phase = 0;
      let amp = 0;
      let ersOn = false;
      let visible = false;

      const setActive = (a) => {
        if (a === active) return;
        active = a;
        rowEls.forEach((el, i) => {
          if (i === a) el.setAttribute("data-live", "");
          else el.removeAttribute("data-live");
        });
      };

      const flash = (el) => {
        if (reduced || !armedRef.current || !el?.animate) return;
        el.animate(
          [
            { transform: "scaleX(1.9)", backgroundColor: RED_BRIGHT },
            { transform: "scaleX(1)", backgroundColor: RED },
          ],
          { duration: FLASH_MS, easing: RACE },
        );
        springVel += CHECKPOINT_KICK; // a soft nudge forward, absorbed by the spring
      };

      /** Everything that depends only on where the nose is. */
      const paint = (rel) => {
        let a = -1;
        rowAt.forEach((at, i) => {
          const on = at.center <= rel;
          if (on) a = i;
          if (on === rowOn[i]) return;
          rowOn[i] = on;
          if (on) {
            rowEls[i].setAttribute("data-passed", "");
            flash(rowEls[i].querySelector("[data-row-cp] [data-cp-line]"));
          } else rowEls[i].removeAttribute("data-passed");
        });

        dayAt.forEach((at, d) => {
          const on = at.center <= rel;
          if (on === dayOn[d]) return;
          dayOn[d] = on;
          if (on) {
            dayEls[d].setAttribute("data-passed", "");
            flash(dayEls[d].querySelector("[data-day-cp] [data-cp-line]"));
          } else dayEls[d].removeAttribute("data-passed");
        });

        const end = rowAt[rowAt.length - 1].center;
        sectors.forEach((button, d) => {
          const from = dayAt[d].center;
          const to = d < dayAt.length - 1 ? dayAt[d + 1].center : end;
          const k = clamp((rel - from) / (to - from || 1), 0, 1);
          fills[d].style.transform = `scaleX(${k.toFixed(4)})`;
          const isCurrent =
            rel >= from &&
            (d === dayAt.length - 1 || rel < dayAt[d + 1].center);
          const state = `${k >= 1 ? "on" : ""}${isCurrent ? "cur" : ""}`;
          if (state === sectorState[d]) return;
          sectorState[d] = state;
          if (k >= 1) button.setAttribute("data-passed", "");
          else button.removeAttribute("data-passed");
          if (isCurrent) button.setAttribute("data-cur", "");
          else button.removeAttribute("data-cur");
        });

        setActive(a);
      };

      const rest = () => {
        last = 0;
        smoothed = 0;
        speed = 0;
        amp = 0;
        phase = 0;
        springPos = 0;
        springVel = 0;
        body.style.transform = "none";
        streak.style.opacity = 0;
        if (ers) ers.setAttribute("opacity", 0.2);
        ersOn = false;
      };

      const tick = () => {
        frame = 0;
        if (!visible) return;

        const now = performance.now();
        const dt = clamp(last ? now - last : 16, 1, 64);
        last = now;

        // Two reads, then writes only.
        const listTop = list.getBoundingClientRect().top;
        const nose = car.getBoundingClientRect().bottom;
        const scroll = window.scrollY;

        paint(nose - listTop);

        const v = (scroll - lastScroll) / dt;
        lastScroll = scroll;
        const k = 1 - Math.exp(-dt / SMOOTH_MS);
        smoothed += ((reduced ? 0 : v) - smoothed) * k;
        const prevSpeed = speed;
        speed = Math.abs(smoothed);

        const target = clamp(smoothed * 12, SURGE_BACK, SURGE_AHEAD);
        const h = dt / 1000;
        springVel +=
          (OMEGA * OMEGA * (target - springPos) - 2 * OMEGA * springVel) * h;
        springPos += springVel * h;

        // The weave only advances while the car is moving, so it never wobbles at rest.
        phase += dt * 0.0045 * clamp(speed * 2, 0, 1);
        amp += (clamp(speed * 1.6, 0, 1) - amp) * k;
        let x = Math.sin(phase) * 1.4 * amp;
        let yaw = Math.cos(phase) * 2.4 * amp;
        if (reduced) {
          springPos = 0;
          springVel = 0;
          x = 0;
          yaw = 0;
        }

        body.style.transform = `translate3d(${x.toFixed(2)}px,${springPos.toFixed(2)}px,0) rotate(${yaw.toFixed(2)}deg)`;
        streak.style.opacity = reduced
          ? 0
          : clamp(smoothed * 1.6, 0, 1).toFixed(3);

        const braking =
          !reduced && speed > 0.06 && (speed - prevSpeed) / dt < -0.0002;
        if (braking !== ersOn && ers) {
          ersOn = braking;
          ers.setAttribute("opacity", braking ? 1 : 0.2);
        }

        const moving =
          speed > 0.003 ||
          Math.abs(springPos) > 0.05 ||
          Math.abs(springVel) > 0.5 ||
          amp > 0.01;
        if (moving) frame = requestAnimationFrame(tick);
        else rest();
      };

      const kick = () => {
        if (!frame) frame = requestAnimationFrame(tick);
      };

      measure();
      kick();

      const driver = ScrollTrigger.create({
        trigger: scope.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: kick,
        onToggle: (self) => {
          visible = self.isActive;
          if (visible) kick();
          else if (frame) {
            cancelAnimationFrame(frame);
            frame = 0;
            rest();
          }
        },
      });
      visible = driver.isActive;

      const onRefresh = () => {
        measure();
        lastScroll = window.scrollY;
        kick();
      };
      ScrollTrigger.addEventListener("refresh", onRefresh);

      const onVisibility = () => {
        if (!document.hidden) kick();
      };
      document.addEventListener("visibilitychange", onVisibility);

      // A sector button brings that day's first event up to the car's nose. Lenis is off on
      // touch, so this falls back to an instant jump the same way scrollToSection does.
      jumpRef.current = (dayIndex) => {
        const row = rowEls[dayFirstRow[dayIndex]].getBoundingClientRect();
        const nose = car.getBoundingClientRect().bottom;
        const to = Math.max(
          0,
          window.scrollY + row.top + row.height / 2 - nose + 4,
        );
        const lenis = getLenis();
        if (reduced || !lenis) {
          window.scrollTo({ top: to, behavior: "auto" });
          kick();
          return;
        }
        lenis.scrollTo(to, { duration: JUMP_MS / 1000, easing: expoOut });
      };

      return () => {
        if (frame) cancelAnimationFrame(frame);
        ScrollTrigger.removeEventListener("refresh", onRefresh);
        document.removeEventListener("visibilitychange", onVisibility);
        driver.kill();
        body.style.transform = "none";
        jumpRef.current = null;
      };
    },
    { scope, dependencies: [enabled, reduced, armedRef, dayFirstRow, jumpRef] },
  );
}
