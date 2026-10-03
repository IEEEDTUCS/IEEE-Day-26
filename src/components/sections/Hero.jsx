import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Button } from "../ui/Button";
import { scrollToSection } from "../../motion/useLenis";
import { gsap, ScrollTrigger } from "../../motion/gsap";
import F1Car from "../ui/F1Car";

const stats = [
  { value: "3", label: "Days", accent: false },
  { value: "10 +", label: "Events", accent: false },
  { value: "∞", label: "Possibilities", accent: true },
];

export default function Hero() {
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
          Back-to-Front Layering Order:
          1. circles → 2. halftone grids → 3. track line and chevrons
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
            {/* Halftone grid soft gray dot matrix pattern */}
            <pattern id="halftone-dots-pattern" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="4" cy="4" r="2.2" fill="#D9D9D9" opacity="0.55" />
            </pattern>
          </defs>

          {/* ── 1. CIRCLES: Translucent layered crimson circles (#C51216, 20–30% opacity) ── */}
          {/* Behind rear section of F1 Car (top-right) */}
          <circle cx="1200" cy="130" r="120" fill="#C51216" opacity="0.28" />
          <circle cx="1320" cy="180" r="95" fill="#C51216" opacity="0.22" />
          <circle cx="1120" cy="220" r="75" fill="#C51216" opacity="0.25" />

          {/* Bottom-left canvas corner */}
          <circle cx="160" cy="760" r="130" fill="#C51216" opacity="0.26" />
          <circle cx="270" cy="810" r="90" fill="#C51216" opacity="0.22" />
          <circle cx="100" cy="850" r="105" fill="#C51216" opacity="0.28" />

          {/* ── 2. HALFTONE GRIDS: Rectangular dot matrices in soft gray flanking the car ── */}
          {/* Flank A: Mid-Left beside cockpit */}
          <rect x="520" y="270" width="180" height="110" fill="url(#halftone-dots-pattern)" />
          {/* Flank B: Top-Right behind engine airbox */}
          <rect x="1060" y="250" width="170" height="120" fill="url(#halftone-dots-pattern)" />
          {/* Flank C: Bottom-Right flanking rear track curve */}
          <rect x="1150" y="540" width="150" height="120" fill="url(#halftone-dots-pattern)" />

          {/* ── 3. TRACK LINE & CHEVRONS ── */}

          {/* RACING LINE: Continuous bezier curve from top-center, looping around rear tires to bottom-right */}
          {/* Outer asphalt track border */}
          <path
            className="hero-track-line"
            d="M 720,0 C 920,120 1180,240 1260,390 C 1330,530 1180,690 1440,860"
            fill="none"
            stroke="#2B2D2C"
            strokeWidth="32"
            strokeLinecap="round"
            opacity="0.9"
          />
          {/* Inner white guidance curb */}
          <path
            className="hero-track-line"
            d="M 710,-10 C 910,110 1170,230 1250,380 C 1320,520 1170,680 1430,850"
            fill="none"
            stroke="#D9D9D9"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.65"
          />
          {/* Crimson optimal racing trajectory line */}
          <path
            className="hero-track-line"
            d="M 720,0 C 920,120 1180,240 1260,390 C 1330,530 1180,690 1440,860"
            fill="none"
            stroke="#C51216"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="16 12"
            opacity="0.9"
            transform="translate(-6, -6)"
          />

          {/* CHEVRONS: Two tiers of light-gray arrowheads (<<<<) along the upper track path */}
          {/* Tier 1: Upper track path near top-center */}
          <g className="hero-chevron-item" opacity="0.6" transform="translate(780, 85) rotate(14)">
            <polygon points="0,0 -16,14 0,28 -6,28 -22,14 -6,0" fill="#D9D9D9" />
            <polygon points="26,0 10,14 26,28 20,28 4,14 20,0" fill="#D9D9D9" />
            <polygon points="52,0 36,14 52,28 46,28 30,14 46,0" fill="#D9D9D9" />
            <polygon points="78,0 62,14 78,28 72,28 56,14 72,0" fill="#D9D9D9" />
          </g>

          {/* Tier 2: Mid-Upper track path along sweep */}
          <g className="hero-chevron-item" opacity="0.55" transform="translate(1000, 185) rotate(26)">
            <polygon points="0,0 -18,16 0,32 -8,32 -26,16 -8,0" fill="#D9D9D9" />
            <polygon points="30,0 12,16 30,32 22,32 4,16 22,0" fill="#D9D9D9" />
            <polygon points="60,0 42,16 60,32 52,32 34,16 52,0" fill="#D9D9D9" />
            <polygon points="90,0 72,16 90,32 82,32 64,16 82,0" fill="#D9D9D9" />
          </g>

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
                href="#contact"
                onClick={scrollTo("contact")}
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
