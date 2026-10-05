/**
 * Teams section — F1 Paddock & Race Track Themed Council Presentation
 *
 * Full-bleed edge-to-edge auto-moving marquee of VIP ticket cards.
 */

import "./team.css";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, eases, useReducedMotion } from "../../../motion";
import { teamMembers, teamSection } from "../../../content";
import { TeamCard } from "./TeamCard";
import { Play, Pause } from "lucide-react";

const HEADING_ID = "team-heading";

export function Teams() {
  const scope = useRef(null);
  const trackRef = useRef(null);
  const reduced = useReducedMotion();
  const [isPaused, setIsPaused] = useState(false);

  // GSAP entrance animation
  useGSAP(
    () => {
      if (reduced) return;
      const q = gsap.utils.selector(scope);

      const label = q("[data-team-label]");
      const lights = q("[data-start-light]");
      const heading = q("[data-team-heading]");
      const nav = q("[data-team-nav]");
      const marquee = q("[data-team-marquee]");
      const speedline = q("[data-team-speedline]");

      gsap.set(label, { opacity: 0, y: 12 });
      gsap.set(lights, { opacity: 0, scale: 0.5 });
      gsap.set(heading, { opacity: 0, y: 20 });
      gsap.set(nav, { opacity: 0, y: 12 });
      gsap.set(marquee, { opacity: 0, y: 30 });
      gsap.set(speedline, { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scope.current,
          start: "top 75%",
          once: true,
        },
      });

      tl.to(label, { opacity: 1, y: 0, duration: 0.5, ease: eases.race }, 0)
        .to(
          lights,
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            stagger: 0.08,
            ease: "back.out(2)",
          },
          0.1,
        )
        .to(
          heading,
          { opacity: 1, y: 0, duration: 0.7, ease: eases.race },
          0.2,
        )
        .to(nav, { opacity: 1, y: 0, duration: 0.5, ease: eases.race }, 0.3)
        .to(
          speedline,
          { scaleX: 1, duration: 1, ease: eases.snap },
          0.35,
        )
        .to(
          marquee,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: eases.race,
          },
          0.4,
        );
    },
    { scope, dependencies: [reduced] },
  );

  return (
    <section
      id="team"
      ref={scope}
      aria-labelledby={HEADING_ID}
      className="team-section bg-white-track relative overflow-hidden text-charcoal pt-16 pb-14 md:pt-24 md:pb-20"
    >
      {/* ─── TOP APEX RUMBLE KERB ─── */}
      <div
        data-team-speedline
        aria-hidden="true"
        className="race-kerb-top absolute inset-x-0 top-0 z-10"
      />

      {/* Subtle Ambient Red Glow */}
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#c51216]/5 rounded-full blur-[100px]"
      />

      {/* ─── HEADER (PADDED CONTAINER) ─── */}
      <div className="relative px-4 md:px-8 lg:px-20 mb-8 md:mb-10">
        <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="flex min-w-0 flex-col gap-3 md:gap-4">
            {/* 5 F1 Starting Grid Lights */}
            <div
              data-team-label
              className="flex items-center gap-3"
            >
              <div className="flex items-center gap-1.5 bg-[#1a1d1e] px-2.5 py-1 rounded-full border border-red-600/30 shadow-sm">
                {[1, 2, 3, 4, 5].map((light) => (
                  <span
                    key={light}
                    data-start-light
                    className="w-2.5 h-2.5 rounded-full bg-[#c51216] shadow-[0_0_8px_#e10600] animate-pulse"
                    style={{ animationDelay: `${light * 0.15}s` }}
                  />
                ))}
              </div>
            </div>

            {/* Section Main Heading */}
            <h2
              id={HEADING_ID}
              data-team-heading
              className="font-heading text-[42px] font-black italic leading-[0.95] tracking-heading text-[#1f2120] md:text-[56px] lg:text-[68px]"
            >
              {teamSection.heading}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c51216] via-[#e10600] to-[#c51216]">
                {teamSection.headingAccent}
              </span>
            </h2>
          </div>

          {/* Controls */}
          <div
            data-team-nav
            className="flex shrink-0 items-center gap-3"
          >
            {/* Play / Pause Auto-Scroll Button */}
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              aria-label={isPaused ? "Resume auto-scroll" : "Pause auto-scroll"}
              className="team-nav-btn flex h-10 px-3.5 cursor-pointer items-center justify-center gap-1.5 rounded-xl text-xs font-mono font-bold"
            >
              {isPaused ? (
                <>
                  <Play size={14} className="fill-current" />
                  <span>RESUME</span>
                </>
              ) : (
                <>
                  <Pause size={14} className="fill-current" />
                  <span>PAUSE</span>
                </>
              )}
            </button>
          </div>
        </header>
      </div>

      {/* ─── FULL-BLEED INFINITE MARQUEE TRACK (NO GAPS) ─── */}
      <div
        data-team-marquee
        className="team-marquee-container w-full overflow-hidden pt-2 pb-6"
      >
        <div
          ref={trackRef}
          className={`team-marquee-track flex ${isPaused ? "is-paused" : ""}`}
        >
          {/* First Set of Members */}
          <div className="flex gap-4 md:gap-6 pr-4 md:pr-6 shrink-0">
            {teamMembers.map((member, i) => (
              <div
                key={`primary-${member.id}`}
                className="w-[280px] shrink-0 md:w-[310px] min-w-[270px] max-w-[340px]"
              >
                <TeamCard member={member} index={i} />
              </div>
            ))}
          </div>

          {/* Duplicated Set for Seamless Infinite Loop */}
          <div className="flex gap-4 md:gap-6 pr-4 md:pr-6 shrink-0" aria-hidden="true">
            {teamMembers.map((member, i) => (
              <div
                key={`duplicate-${member.id}`}
                className="w-[280px] shrink-0 md:w-[310px] min-w-[270px] max-w-[340px]"
              >
                <TeamCard member={member} index={i} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}