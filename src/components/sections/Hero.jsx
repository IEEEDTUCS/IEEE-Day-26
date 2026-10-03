import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { scrollToSection } from "../../motion/useLenis";
import { gsap, ScrollTrigger } from "../../motion/gsap";
import { prefersReducedMotion } from "../../motion/useReducedMotion";
import { useState } from "react";
import F1Car from "../ui/F1Car";

// ── Event date ───────────────────────────────────────────────────────────────
const EVENT_DATE = new Date("2026-10-15T09:00:00+05:30");

function pad(n) { return String(n).padStart(2, "0"); }

function useCountdown(target) {
  const [t, setT] = useState(() => {
    const diff = target - Date.now();
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
    const s = Math.floor(diff / 1000);
    return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
  });

  useEffect(() => {
    const id = setInterval(() => {
      const diff = target - Date.now();
      if (diff <= 0) { setT({ d: 0, h: 0, m: 0, s: 0 }); clearInterval(id); return; }
      const s = Math.floor(diff / 1000);
      setT({ d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 });
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  return t;
}

// ── Countdown display ─────────────────────────────────────────────────────────
function CountdownDisplay({ countdown }) {
  const units = [
    { label: "Days",  value: countdown.d },
    { label: "Hours", value: countdown.h },
    { label: "Mins",  value: countdown.m },
    { label: "Secs",  value: countdown.s },
  ];
  return (
    <div
      className="hero-countdown flex items-end gap-1 sm:gap-2"
      aria-label={`${countdown.d} days, ${countdown.h} hours, ${countdown.m} minutes, ${countdown.s} seconds remaining`}
    >
      {units.map(({ label, value }, i) => (
        <div key={label} className="flex items-end gap-1">
          <div className="flex flex-col items-center">
            <span
              className="tabular block min-w-[2.6ch] text-center text-[2.2rem] font-black leading-none text-red sm:text-[2.8rem]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {pad(value)}
            </span>
            <span className="label-spaced mt-1 text-[0.55rem] tracking-[0.3em] text-steel sm:text-[0.6rem]">
              {label}
            </span>
          </div>
          {i < 3 && (
            <span
              className="mb-[0.6rem] block text-[1.6rem] font-black text-red sm:text-[1.8rem]"
              style={{ fontFamily: "var(--font-heading)" }}
              aria-hidden="true"
            >
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Stats row ─────────────────────────────────────────────────────────────────
const stats = [
  { value: "3",   label: "Days" },
  { value: "10+", label: "Events" },
  { value: "∞",   label: "Possibilities" },
];

// ── Track path (same bezier used for chevron placement) ──────────────────────
// Points sampled along: M 720,0 C 920,130 1190,255 1265,405 C 1340,545 1190,695 1440,870
// We place chevrons along the UPPER portion (above the car area) only
const CHEVRON_GROUPS = [
  // { cx, cy, angle } — manually sampled + angled tangentially along the path
  { cx: 790,  cy: 78,  angle: 30 },
  { cx: 870,  cy: 128, angle: 34 },
  { cx: 960,  cy: 182, angle: 38 },
  { cx: 1050, cy: 237, angle: 41 },
  { cx: 1130, cy: 295, angle: 43 },
  { cx: 1195, cy: 355, angle: 40 },
];

export default function Hero() {
  const sectionRef = useRef(null);
  const carWrapRef = useRef(null);
  const countdown  = useCountdown(EVENT_DATE);
  const reduced    = prefersReducedMotion();

  const scrollTo = (id) => (e) => { e.preventDefault(); scrollToSection(id); };

  useGSAP(() => {
    const skip = reduced;
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // ── Text wipe-in ──
    tl.from(".hero-title-line", skip ? {} : { y: "110%", duration: 0.85, stagger: 0.12 }, 0);
    tl.from(".hero-label",      skip ? {} : { y: 16, opacity: 0, duration: 0.5 }, 0.05);
    tl.from(".hero-tagline",    skip ? {} : { y: 12, opacity: 0, duration: 0.55 }, 0.38);
    tl.from(".hero-meta",       skip ? {} : { y: 10, opacity: 0, duration: 0.45 }, 0.48);
    tl.from(".hero-countdown",  skip ? {} : { y: 10, opacity: 0, duration: 0.45 }, 0.55);
    tl.from(".hero-ctas",       skip ? {} : { y: 10, opacity: 0, duration: 0.4  }, 0.63);
    tl.from(".hero-stats-row",  skip ? {} : { y: 10, opacity: 0, duration: 0.4  }, 0.72);

    // ── Car sweeps in from far right with speed ──
    if (!skip) {
      // Start from further right so the swoop travel is more dramatic
      tl.from(carWrapRef.current, { x: 600, opacity: 0, duration: 1.2, ease: "power4.out" }, 0.08);
      // A very brief scale-down on landing (like a compression)
      tl.to(carWrapRef.current, { scaleX: 1.015, scaleY: 0.985, duration: 0.12, ease: "power2.in" }, 1.25);
      tl.to(carWrapRef.current, { scaleX: 1, scaleY: 1, duration: 0.35, ease: "elastic.out(1, 0.6)" }, 1.37);
    }

    // ── Background chevrons fade in staggered ──
    if (!skip) {
      tl.from(".hero-chevron-item", { opacity: 0, x: 20, stagger: { each: 0.04 }, duration: 0.55 }, 0.3);
    }

    // ── Background track path draws in ──
    if (!skip) {
      gsap.from(".hero-track-main", { strokeDashoffset: 1200, strokeDasharray: "1200 1200", duration: 1.8, ease: "power3.out", delay: 0.1 });
    }

    // ── Continuous: car floats (more lively — bigger range, faster) ──
    if (!skip) {
      gsap.to("#f1-car-container", {
        y: "-=14",
        rotate: 0.4,
        duration: 1.8,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    }

    // ── Continuous: animated rear glow pulse ──
    if (!skip) {
      gsap.to("#rear-glow-el", {
        opacity: 0.4,
        scale: 1.4,
        transformOrigin: "center center",
        duration: 0.7,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    }

    // ── Scroll parallax ──
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom top",
      scrub: 1.6,
      onUpdate(self) {
        const p = self.progress;
        gsap.set(carWrapRef.current, { x: p * -80, y: p * -30 });
        gsap.set(".hero-text-col", { y: p * -24 });
      },
    });

  }, { scope: sectionRef });

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-paper"
    >
      {/* ════════ BACKGROUND SVG ════════ */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <svg viewBox="0 0 1440 900" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="halftone" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="4" cy="4" r="1.8" fill="#d9d9d9" opacity="0.7" />
            </pattern>

            {/* Animated dashed kerb style — defined in globals.css as @keyframes kerb-flow */}
            <style>{`
              @keyframes kerb-flow {
                from { stroke-dashoffset: 0; }
                to   { stroke-dashoffset: -60; }
              }
              .kerb-stripe {
                animation: kerb-flow 1.2s linear infinite;
              }
              @media (prefers-reduced-motion: reduce) {
                .kerb-stripe { animation: none; }
              }
            `}</style>
          </defs>

          {/* Decorative crimson circles behind car */}
          <circle cx="1210" cy="145" r="125" fill="var(--color-red)" opacity="0.22" />
          <circle cx="1330" cy="200" r="95"  fill="var(--color-red)" opacity="0.18" />
          <circle cx="1110" cy="240" r="70"  fill="var(--color-red)" opacity="0.20" />
          <circle cx="140"  cy="770" r="130" fill="var(--color-red)" opacity="0.18" />
          <circle cx="250"  cy="820" r="90"  fill="var(--color-red)" opacity="0.15" />

          {/* Halftone dot areas */}
          <rect x="480" y="260" width="185" height="115" fill="url(#halftone)" />
          <rect x="1050" y="260" width="175" height="125" fill="url(#halftone)" />
          <rect x="1145" y="550" width="155" height="120" fill="url(#halftone)" />

          {/* ─── Track road band ─── */}
          <path
            className="hero-track-main"
            d="M 720,0 C 920,130 1190,255 1265,405 C 1340,545 1190,695 1440,870"
            fill="none"
            stroke="var(--color-charcoal)"
            strokeWidth="30"
            strokeLinecap="round"
            opacity="0.88"
          />

          {/* White edge line */}
          <path
            d="M 710,-12 C 910,118 1180,243 1255,393 C 1330,533 1180,683 1430,858"
            fill="none"
            stroke="var(--color-paper)"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* ─── Animated red kerb stripe (moves forward) ─── */}
          <path
            className="kerb-stripe"
            d="M 720,0 C 920,130 1190,255 1265,405 C 1340,545 1190,695 1440,870"
            fill="none"
            stroke="var(--color-red)"
            strokeWidth="6"
            strokeLinecap="butt"
            strokeDasharray="22 11"
            opacity="0.92"
            transform="translate(-4, -4)"
          />

          {/* ─── Chevron markers along the track path (upper 60% only, above car body) ─── */}
          {CHEVRON_GROUPS.map(({ cx, cy, angle }, gi) => (
            <g
              key={gi}
              className="hero-chevron-item"
              transform={`translate(${cx - 20}, ${cy - 10}) rotate(${angle})`}
              opacity={0.55 - gi * 0.04}
            >
              {/* 3 chevron blades per group */}
              {[0, 18, 36].map((offset) => (
                <polygon
                  key={offset}
                  points={`${offset},0 ${offset - 12},10 ${offset},20 ${offset - 4},20 ${offset - 16},10 ${offset - 4},0`}
                  fill="var(--color-silver)"
                />
              ))}
            </g>
          ))}
        </svg>
      </div>

      {/* ════════ F1 CAR — smaller width → more swoop travel visible ════════ */}
      <div
        ref={carWrapRef}
        className="pointer-events-none absolute right-[-4%] top-[6%] z-[1] flex h-[82%] items-center lg:right-[-2%]"
        style={{ width: "55%" }}   /* reduced from 64% → more white space left, bigger entrance travel */
        aria-hidden="true"
      >
        <F1Car className="w-full" />
      </div>

      {/* ════════ MAIN COPY ════════ */}
      <div className="container-page relative z-10 flex min-h-screen flex-col py-6">
        <div className="hero-text-col flex flex-1 items-center pb-20 pt-28 sm:pt-32">
          {/* ── Info panel with frosted backdrop ── */}
          <div
            className="relative"
            style={{ maxWidth: "min(540px, 46vw)" }}
          >
            

            {/* Partners label */}
            <p className="hero-label label-spaced mb-5 flex items-center gap-3 text-charcoal">
              <span aria-hidden="true" className="block h-[3px] w-8 shrink-0 bg-red" />
              <span>IEEE DTU SB <span className="text-red font-bold">×</span> IEEE GTBIT SB</span>
            </p>

            {/* ── Hero title — overflow visible so italic/skew isn't clipped ── */}
            <h1
              className="leading-[0.88] text-charcoal relative z-10"
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 950,
                fontSize: "clamp(4rem, 10.5vw, 10.5rem)",
                /* Enough left padding to absorb the skew lean without clipping */
                paddingLeft: "0.08em",
              }}
            >
              <span className="block overflow-visible pb-1">
                <span
                  className="hero-title-line"
                  style={{ transform: "skewX(-10deg)", display: "inline-block" }}
                >IEEE</span>
              </span>
              <span className="block overflow-visible pb-1">
                <span
                  className="hero-title-line text-red"
                  style={{ transform: "skewX(-10deg)", display: "inline-block" }}
                >DAY</span>
              </span>
              <span className="block overflow-visible">
                <span
                  className="hero-title-line"
                  style={{ transform: "skewX(-10deg)", display: "inline-block" }}
                >26</span>
              </span>
            </h1>

            {/* Tagline */}
            <p
              className="hero-tagline mt-5 text-[1.05rem] font-medium text-charcoal/75 sm:text-[1.15rem]"
              style={{ fontFamily: "var(--font-body)", maxWidth: "32ch" }}
            >
              Same curiosity · Higher tomorrows.
            </p>

            {/* Date & Venue */}
            <p
              className="hero-meta label-spaced mt-5 text-charcoal/60"
              style={{ letterSpacing: "0.22em" }}
            >
              16-18 Oct 2026 · Delhi Technological University
            </p>

            {/* Countdown */}
            <div className="mt-6">
              <CountdownDisplay countdown={countdown} />
            </div>

            {/* CTA buttons */}
            <div className="hero-ctas mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#contact"
                onClick={scrollTo("contact")}
                className="group inline-flex items-center gap-2 bg-red px-7 py-3.5 text-[0.75rem] font-semibold uppercase tracking-[0.1em] leading-none text-paper transition-colors duration-150 hover:bg-red-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Register Now
                <span aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-[3px]">→</span>
              </a>
              <a
                href="#events"
                onClick={scrollTo("events")}
                className="inline-flex items-center gap-2 border-[1.5px] border-charcoal px-7 py-3.5 text-[0.75rem] font-semibold uppercase tracking-[0.1em] leading-none text-charcoal transition-colors duration-150 hover:bg-charcoal hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Explore Events
              </a>
            </div>

            {/* Stats strip */}
            <div className="hero-stats-row mt-12 grid max-w-sm grid-cols-3 border-t border-silver pt-5">
              {stats.map(({ value, label }, i) => (
                <div key={label} className={i > 0 ? "border-l border-silver pl-5" : ""}>
                  <p
                    className="tabular text-[1.9rem] font-black leading-none text-red"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {value}
                  </p>
                  <p className="label-spaced mt-1 text-charcoal/55 text-[0.58rem]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="label-spaced flex items-center justify-between border-t border-silver pt-4 text-charcoal/60">
          <span>Delhi Technological University · New Delhi</span>
          <a
            href="#about"
            onClick={scrollTo("about")}
            className="hidden items-center gap-2 transition-colors duration-150 hover:text-red sm:flex"
          >
            Scroll to discover <span className="text-red">↓</span>
          </a>
        </div>
      </div>

      {/* ── Responsive: car under copy on mobile ── */}
      <style>{`
        @media (max-width: 767px) {
          #home > div[style*="width: 55%"] {
            position: static !important;
            width: 100% !important;
            height: auto !important;
            margin-top: 2rem;
          }
        }
      `}</style>
    </section>
  );
}
