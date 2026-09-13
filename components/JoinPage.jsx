"use client";

import { useState } from "react";

const REPS = [
  { name: "Bhavya Goel", phone: "917982969225", accent: "from-[#0c4770] via-[#0c263f] to-[#08111f]" },
  { name: "Drishti Kaushik", phone: "919520002368", accent: "from-[#65428f] via-[#352653] to-[#08111f]" },
  { name: "Manit Vig", phone: "919560566938", accent: "from-[#234d79] via-[#182d50] to-[#08111f]" },
  { name: "Mayank Kanojjiya", phone: "919250110578", accent: "from-[#07555b] via-[#0b3037] to-[#08111f]" },
  { name: "Hardik Aggarwal", phone: "919319173701", accent: "from-[#124f64] via-[#102d40] to-[#08111f]" },
  { name: "Shyla Vijay", phone: "917982691483", accent: "from-[#3d4f7d] via-[#202d50] to-[#08111f]" },
  { name: "Sankalp Tripathi", phone: "919013522191", accent: "from-[#19476b] via-[#172b4b] to-[#08111f]" },
  { name: "Saurabh Chauhan", phone: "919643717883", accent: "from-[#0d5b68] via-[#123943] to-[#08111f]" },
  { name: "Prashay Joon", phone: "917042527004", accent: "from-[#3d4a79] via-[#252d52] to-[#08111f]" },
  { name: "Vishal Raj", phone: "917909043293", accent: "from-[#244b6f] via-[#192e4c] to-[#08111f]" },
];

const WA_MESSAGE = "Hi! I would like to join IEEE DTU. Could you please guide me through the membership process?";

export default function JoinPage() {
  const [animating, setAnimating] = useState(false);

  const handleClick = () => {
    if (animating) return;
    setAnimating(true);
    const chosen = REPS[Math.floor(Math.random() * REPS.length)];
    window.setTimeout(() => {
      window.open(`https://wa.me/${chosen.phone}?text=${encodeURIComponent(WA_MESSAGE)}`, "_blank", "noopener,noreferrer");
      setAnimating(false);
    }, 500);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_18%_12%,rgba(32,217,255,.2),transparent_28%),radial-gradient(circle_at_86%_30%,rgba(35,76,255,.22),transparent_32%),linear-gradient(135deg,#071b32_0%,#050914_55%,#0b1230_100%)] pt-24">
      <div className="pointer-events-none absolute inset-0 z-0 bg-grid-fade bg-[size:76px_76px] opacity-[.045]" />
      <div className="pointer-events-none absolute -left-16 top-[18%] z-0 h-64 w-64 rounded-full bg-electric/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-[48%] z-0 h-80 w-80 rounded-full bg-[#6744cf]/15 blur-3xl" />
      <section className="relative z-10 py-20 sm:py-28">
        <div className="relative mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-16">
          <div data-reveal className="mx-auto max-w-3xl text-center">
            <p className="mb-6 flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-electric">
              <span className="h-px w-8 bg-electric" /> Join IEEE DTU <span className="h-px w-8 bg-electric" />
            </p>
            <h1 className="text-5xl font-bold leading-[.98] tracking-[-0.055em] text-white sm:text-7xl">
              Find your place in <span className="text-electric">DTU&apos;s Elite.</span>
            </h1>
            <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-muted sm:text-base">
              Connect with a membership coordinator to learn how you can become part of IEEE DTU&apos;s community of builders, learners, and changemakers.
            </p>
            <button
              type="button"
              onClick={handleClick}
              className={`mt-9 inline-flex items-center gap-3 rounded-full bg-electric px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-ink shadow-glow transition hover:bg-signal ${animating ? "scale-95 opacity-70" : ""}`}
            >
              {animating ? "Connecting you..." : "Connect with the Team"}
              <span className="text-base leading-none">↗</span>
            </button>
          </div>

          <div data-reveal className="mt-20">
            <div className="mb-7 flex items-end justify-between gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-electric">Membership coordinators</p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">Start a conversation.</h2>
              </div>
              <p className="hidden text-right text-xs leading-5 text-muted sm:block">Choose a coordinator or use the quick-connect button above.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {REPS.map((rep, index) => (
                <a
                  data-reveal
                  key={rep.name}
                  href={`https://wa.me/${rep.phone}?text=${encodeURIComponent(WA_MESSAGE)}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br ${rep.accent} p-5 transition duration-500 hover:-translate-y-1 hover:border-electric/60 hover:shadow-[0_0_34px_rgba(32,217,255,.14)]`}
                >
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-electric/10 blur-2xl transition group-hover:bg-electric/25" />
                  <div className="relative flex items-start justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-full border border-electric/40 bg-ink text-xs font-bold text-electric">{String(index + 1).padStart(2, "0")}</span>
                    <span className="text-lg text-electric transition group-hover:translate-x-1">↗</span>
                  </div>
                  <h3 className="relative mt-8 text-lg font-bold text-white">{rep.name}</h3>
                  <p className="relative mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Membership coordinator</p>
                  <div className="relative mt-5 h-px w-full bg-white/10 transition group-hover:bg-electric/50" />
                  <p className="relative mt-4 text-sm font-medium tracking-wide text-white/80">+{rep.phone.slice(0, 2)} {rep.phone.slice(2, 7)} {rep.phone.slice(7)}</p>
                  <p className="relative mt-4 text-xs font-semibold text-signal">Message on WhatsApp</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
