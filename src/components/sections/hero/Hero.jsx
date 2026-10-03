import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Button, F1Car } from "../../ui";
import { gsap, ScrollTrigger, scrollToSection } from "../../../motion";

const stats = [
  { value: "3", label: "Days", accent: false },
  { value: "10 +", label: "Events", accent: false },
  { value: "∞", label: "Possibilities", accent: true },
];

export function Hero() {
  const sectionRef = useRef(null);
  const carWrapRef = useRef(null);

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    scrollToSection(id);
  };

  useGSAP(
    () => {
      /* ─── 1. ENTRANCE TIMELINE ─────────────────────────── */
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Label line
      tl.from(".hero-label", { y: 18, opacity: 0, duration: 0.5 }, 0);

      // Title lines — slide up from behind overflow clip
      tl.from(
        ".hero-title-line",
        { y: "110%", duration: 0.78, stagger: 0.1 },
        0.08,
      );

      // Tagline + buttons
      tl.from(".hero-sub", { y: 14, opacity: 0, duration: 0.5 }, 0.52);
      tl.from(".hero-btn", { y: 10, opacity: 0, duration: 0.4, stagger: 0.07 }, 0.62);
      tl.from(".hero-stat-item", { y: 10, opacity: 0, duration: 0.45, stagger: 0.08 }, 0.76);

      // F1 Car charges in from far right — high speed entrance
      tl.from(
        carWrapRef.current,
        { x: 380, opacity: 0, duration: 3.2, ease: "power4.out" },
        0.08,
      );

      // Speed lines draw in
      tl.from(
        "#speed-lines line",
        { scaleX: 0, transformOrigin: "left center", stagger: 0.08, duration: 1.5, ease: "power3.out" },
        0.6,
      );

      // Background chevrons fade in
      tl.from(
        ".hero-chevron-item",
        { opacity: 0, scale: 0.85, stagger: { each: 0.02, from: "start" }, duration: 0.6 },
        0.35,
      );

      // Track paths draw
      tl.from(
        ".hero-track-line",
        { opacity: 0, duration: 1.5, ease: "power2.out" },
        0.2,
      );

      /* ─── 2. CONTINUOUS LOOPS ──────────────────────────── */

      // Speed line shimmer — each line flickers independently
      gsap.to("#speed-lines line", {
        opacity: "random(0.3, 0.9)",
        duration: "random(0.2, 0.6)",
        stagger: { each: 0.08, repeat: -1, yoyo: true },
        ease: "sine.inOut",
      });

      // Smooth aerodynamic float / bounce
      gsap.to("#f1-car-container", {
        y: "-=10 ",
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      /* ─── 3. SCROLL PARALLAX (scrubbed) ────────────────── */
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.6,
        onUpdate(self) {
          const p = self.progress;

          // Car charges forward (left) strongly as you scroll
          gsap.set(carWrapRef.current, { x: p * -140, y: p * -18 });

          // Text area floats up slightly — depth effect
          gsap.set(".hero-text-inner", { y: p * -28 });

          // Speed lines lengthen dramatically on scroll
          gsap.set("#speed-lines", {
            scaleX: 1 + p * 0.75,
            transformOrigin: "right center",
          });
        },
      });

      /* ─── 4. STATS COUNT-UP (enter viewport) ───────────── */
      ScrollTrigger.create({
        trigger: ".hero-stats-row",
        start: "top 90%",
        once: true,
        onEnter() {
          gsap.from(".hero-stat-value", {
            textContent: 0,
            duration: 1.2,
            ease: "power2.out",
            snap: { textContent: 1 },
            stagger: 0.15,
          });
          gsap.from("#stat-infinity", {
            scale: 0.5,
            opacity: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
          });
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-paper"
    >
      {/* ════════════════════════════════════════════════════
          DECORATIVE BACKGROUND VECTOR LAYER
          (Matches exact layout of Reference Picture 2)
          ════════════════════════════════════════════════════ */}
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 900"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            {/* Dot matrix pattern */}
            <pattern id="grid-dots-pattern" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="2.2" fill="#2b2d2c" opacity="0.34" />
            </pattern>
          </defs>

          {/* ── 1. Top-Right Vibrant Red Overlapping Circles (Reference 2) ── */}
          <circle cx="1260" cy="100" r="100" fill="#c51216" opacity="0.88" />
          <circle cx="1360" cy="125" r="90" fill="#c51216" opacity="0.65" />

          {/* ── 3. Bottom Bold Sweeping Asphalt Track (Reference 2) ── */}
          <path
            className="hero-track-line"
            d="M 1440,300 C 1330,460 1250,570 1080,720 C 930,850 780,910 680,940"
            fill="none"
            stroke="#1a1c1a"
            strokeWidth="34"
            strokeLinecap="round"
            opacity="0.95"
          />
          {/* Inner white curb guideline */}
          <path
            className="hero-track-line"
            d="M 1440,285 C 1315,450 1235,560 1065,710 C 915,840 765,900 665,930"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          />
          {/* Red optimal racing trajectory line */}
          <path
            className="hero-track-line"
            d="M 1440,300 C 1330,460 1250,570 1080,720 C 930,850 780,910 680,940"
            fill="none"
            stroke="#c51216"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="16 12"
            opacity="0.85"
            transform="translate(-6, -8)"
          />

          {/* ── 4. Precision Chevron Groups (Reference 2) ── */}

          {/* Group A: Top chevrons near S-chicane pointing LEFT (<<<<<) */}
          <g className="hero-chevron-item" opacity="0.38" transform="translate(800, 95)">
            <polygon points="0,0 -16,14 0,28 -6,28 -22,14 -6,0" fill="#2b2d2c" />
            <polygon points="26,0 10,14 26,28 20,28 4,14 20,0" fill="#2b2d2c" />
            <polygon points="52,0 36,14 52,28 46,28 30,14 46,0" fill="#2b2d2c" />
            <polygon points="78,0 62,14 78,28 72,28 56,14 72,0" fill="#2b2d2c" />
          </g>

          {/* Group B: Left of Halo / Cockpit (<<<<) */}
          <g className="hero-chevron-item" opacity="0.35" transform="translate(600, 275)">
            <polygon points="0,0 -18,16 0,32 -8,32 -26,16 -8,0" fill="#2b2d2c" />
            <polygon points="30,0 12,16 30,32 22,32 4,16 22,0" fill="#2b2d2c" />
            <polygon points="60,0 42,16 60,32 52,32 34,16 52,0" fill="#2b2d2c" />
            <polygon points="90,0 72,16 90,32 82,32 64,16 82,0" fill="#2b2d2c" />
          </g>

          {/* Group C: Bottom-Left Curving Curb Chevrons (<<<<<<<) */}
          <g className="hero-chevron-item" opacity="0.4" transform="translate(180, 780)">
            <polygon points="0,0 -14,12 0,24 -6,24 -20,12 -6,0" fill="#2b2d2c" />
            <polygon points="22,0 8,12 22,24 16,24 2,12 16,0" fill="#2b2d2c" />
            <polygon points="44,0 30,12 44,24 38,24 24,12 38,0" fill="#2b2d2c" />
            <polygon points="66,0 52,12 66,24 60,24 46,12 60,0" fill="#2b2d2c" />
            <polygon points="88,0 74,12 88,24 82,24 68,12 82,0" fill="#2b2d2c" />
            <polygon points="110,0 96,12 110,24 104,24 90,12 104,0" fill="#2b2d2c" />
            <polygon points="132,0 118,12 132,24 126,24 112,12 126,0" fill="#2b2d2c" />
            <polygon points="154,0 140,12 154,24 148,24 134,12 148,0" fill="#2b2d2c" />
          </g>

          {/* Group D: Under Rear Wheel Curb Chevrons (<<<<<) */}
          <g className="hero-chevron-item" opacity="0.45" transform="translate(860, 810) rotate(-26)">
            <polygon points="0,0 -15,13 0,26 -6,26 -21,13 -6,0" fill="#2b2d2c" />
            <polygon points="24,0 9,13 24,26 18,26 3,13 18,0" fill="#2b2d2c" />
            <polygon points="48,0 33,13 48,26 42,26 27,13 42,0" fill="#2b2d2c" />
            <polygon points="72,0 57,13 72,26 66,26 51,13 66,0" fill="#2b2d2c" />
            <polygon points="96,0 81,13 96,26 90,26 75,13 90,0" fill="#2b2d2c" />
            <polygon points="120,0 105,13 120,26 114,26 99,13 114,0" fill="#2b2d2c" />
          </g>

          {/* ── 5. Technical Dot Matrix Grids (Reference 2) ── */}
          {/* Grid A: Left beside cockpit */}
          <rect x="750" y="295" width="160" height="96" fill="url(#grid-dots-pattern)" />
          {/* Grid B: Right near rear track */}
          <rect x="1120" y="520" width="144" height="112" fill="url(#grid-dots-pattern)" />

        </svg>
      </div>

      {/* ════════════════════════════════════════════════════
          F1 CAR — aligned along track trajectory
          ════════════════════════════════════════════════════ */}
      <div
        ref={carWrapRef}
        className="pointer-events-none absolute right-[-6%] top-[8%] z-[1] flex h-[88%] items-center lg:right-[-4%]"
        style={{ width: "62%" }}
        aria-hidden="true"
      >
        <F1Car className="w-full" />
      </div>

      {/* ════════════════════════════════════════════════════
          MAIN CONTENT — High-Contrast Technical Typography
          ════════════════════════════════════════════════════ */}
      <div className="container-page relative z-10 flex min-h-screen flex-col py-6">
        {/* ── Text block ── */}
        <div className="hero-text-inner flex flex-1 items-center pb-20 pt-24 sm:pt-28">
          <div className="max-w-2xl relative">
            {/* Subtle glow behind text to ensure readability if car overlaps */}
            <div className="pointer-events-none absolute inset-0 -z-5 -ml-5 -mt-5 h-[100%] w-[100%] bg-radial from-paper/10 via-paper/5 to-transparent blur-xl" />

            {/* Label */}
            <p className="hero-label label-spaced mb-6 flex items-center gap-4 text-charcoal font-bold">
              <span aria-hidden="true" className="h-bar w-10 shrink-0 bg-red" />
              IEEE DTU SB <span className="text-red font-bold">×</span> IEEE GTBIT SB
            </p>

            {/* Headline — Orbitron racing display font */}
            <h2
              className="max-w-3xl text-mega text-charcoal relative z-10 "
              style={{
                lineHeight: "0.92",
                fontFamily: "'Orbitron', 'Audiowide', sans-serif",
                fontWeight: 750,
              }}
            >
              <span className="block overflow-hidden pb-1">
                <span className="hero-title-line block">IEEE</span>
              </span>
              <span className="block overflow-hidden pb-4">
                <span className="hero-title-line block text-red">DAY 26</span>
              </span>
            </h2>

            {/* Tagline */}
            <p className="hero-sub label-spaced mt-7 text-charcoal/60">
              Same curiosity&nbsp;·&nbsp;Higher tomorrows
            </p>

            {/* CTA buttons */}
            <div className="mt-9 flex flex-wrap gap-3">
              <Button
                href="#events"
                onClick={scrollTo("events")}
                trailing="→"
                className="hero-btn"
              >
                Explore Events
              </Button>
              <Button
                variant="secondary"
                href="https://ieeedtu.in/ieee-day/register"
                className="hero-btn"
              >
                Register Now ↗
              </Button>
            </div>

            {/* Stats — 3 columns */}
            <div
              id="hero-stats"
              className="hero-stats-row mt-16 grid max-w-xl grid-cols-3 border-t border-silver pt-5"
            >
              {stats.map(({ value, label, accent }, i) => (
                <div
                  key={label}
                  className={`hero-stat-item ${i > 0 ? "border-l border-silver pl-6" : ""}`}
                >
                  {label === "Possibilities" ? (
                    <p
                      id="stat-infinity"
                      className="statement tabular text-stat text-red"
                      style={{ fontFamily: "'Orbitron', 'Audiowide', sans-serif", fontWeight: 800 }}
                    >
                      ∞
                    </p>
                  ) : (
                    <p
                      className={`statement tabular text-stat hero-stat-value ${accent ? "text-red" : "text-charcoal"}`}
                      data-target={value}
                      style={{ fontFamily: "'Orbitron', 'Audiowide', sans-serif", fontWeight: 650 }}
                    >
                      {value}
                    </p>
                  )}
                  <p className="label-spaced mt-1 text-charcoal/60"
                    style={{ fontFamily: "'Audiowide', sans-serif", fontSize: "0.62rem", letterSpacing: "0.18em" }}
                  >{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="label-spaced flex items-center justify-between border-t border-silver pt-4 text-charcoal/80">
          <span>Delhi Technological University · New Delhi</span>
          <a
            href="#about"
            onClick={scrollTo("about")}
            className="hidden items-center gap-2 transition-colors duration-(--duration-fast) hover:text-red sm:flex"
          >
            Scroll to discover <span className="text-red">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
