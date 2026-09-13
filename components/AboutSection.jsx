"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const highlights = [
  ["450+", "Active members"],
  ["40+", "Years of legacy"],
  ["01", "Community, one direction"],
];

export default function AboutSection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.18 },
    );
    observer.observe(section);

    const onScroll = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const bounds = section.getBoundingClientRect();
      const progress = (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height);
      const nextOffset = Math.max(-18, Math.min(18, (progress - 0.5) * 36));
      setParallaxOffset(nextOffset);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative flex min-h-screen items-center overflow-hidden bg-ink py-24 sm:py-32">
      <div className="absolute left-[-18%] top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-electric/[.06] blur-[120px]" />
      <div className="mx-auto grid w-full max-w-[1440px] gap-14 px-6 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-24 lg:px-16">
        <div className={`transition-all duration-[1600ms] ease-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
          <p className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-electric">
            <span className="h-px w-8 bg-electric" /> About IEEE DTU
          </p>
          <h2 className="max-w-xl text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl">
            A legacy of <span className="text-electric">building forward.</span>
          </h2>
          <p className="mt-7 max-w-lg text-sm leading-7 text-muted sm:text-base">
            IEEE DTU is Delhi Technological University&apos;s largest technical society, with 450+ active members, a 40+ year legacy, and a reputation for turning curiosity into nationally recognized innovation.
          </p>
          <p className="mt-4 max-w-lg text-sm leading-7 text-muted/70">
            From hands-on initiatives to flagship events, we bring together students who want to learn deeply, collaborate openly, and make technology matter.
          </p>

          <div className="mt-10 grid max-w-xl grid-cols-3 border-y border-white/10 py-5">
            {highlights.map(([value, label]) => (
              <div key={label} className="border-r border-white/10 pr-3 last:border-0 sm:pr-5">
                <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{value}</p>
                <p className="mt-2 max-w-[100px] text-[9px] font-semibold uppercase leading-4 tracking-[0.13em] text-muted">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={`relative mx-auto w-full max-w-2xl transition-all delay-300 duration-[1800ms] ease-out lg:justify-self-end ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
          <div className="absolute -inset-8 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,rgba(32,217,255,.34),rgba(35,76,255,.14)_38%,rgba(5,9,20,0)_72%)] blur-2xl" />
          <div className="absolute -inset-3 rounded-[2rem] border border-electric/30 shadow-[0_0_60px_rgba(32,217,255,.16)]" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-panel shadow-2xl sm:aspect-[5/4]">
            <Image
              src="/images/about_image.jpg"
              alt="IEEE DTU installation at a student event"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              style={{ transform: `translateY(${parallaxOffset}px) scale(1.08)` }}
              className="object-cover object-center transition-transform duration-300 ease-out hover:scale-[1.12] motion-reduce:transform-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent" />
            <p className="absolute bottom-5 left-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">Make an impact</p>
          </div>
          <span className="absolute -bottom-6 -right-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-electric/70 sm:-right-8">01 / Who we are</span>
        </div>
      </div>
    </section>
  );
}
