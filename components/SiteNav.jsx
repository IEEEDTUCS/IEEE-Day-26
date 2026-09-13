"use client";

import BrandMark from "./BrandMark";
import { ArrowUpRight, ChevronDown, Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function SiteNav() {
  const eventsMenuRef = useRef(null);
  const [eventsOpen, setEventsOpen] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!eventsMenuRef.current?.contains(event.target)) setEventsOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/65 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-4 sm:px-10 lg:px-16">
        <BrandMark />
        <nav className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-[0.18em] text-muted md:flex" aria-label="Primary navigation">
          <a className="transition hover:text-white" href="/">Home</a>
          <a className="transition hover:text-white" href="/#about">About</a>
          <div ref={eventsMenuRef} className="relative" onMouseEnter={() => setEventsOpen(true)} onMouseLeave={() => setEventsOpen(false)}>
            <div className="flex items-center gap-1">
              <a className="transition hover:text-white" href="/#events" onClick={() => setEventsOpen(false)}>Events</a>
              <button type="button" aria-label="Toggle Events menu" aria-expanded={eventsOpen} onClick={() => setEventsOpen((open) => !open)} className="rounded p-1 transition hover:bg-white/10 hover:text-white">
                <ChevronDown size={14} className={`transition-transform ${eventsOpen ? "rotate-180" : ""}`} />
              </button>
            </div>
            <div className={`absolute left-1/2 top-full mt-3 w-52 -translate-x-1/2 rounded-xl border border-white/10 bg-[#0b1324]/95 p-2 text-[10px] shadow-2xl backdrop-blur-xl transition-all ${eventsOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"}`}>
              <a className="block rounded-lg px-3 py-3 transition hover:bg-white/10 hover:text-white" href="/#events">All events</a>
              <a className="flex items-center justify-between rounded-lg px-3 py-3 transition hover:bg-white/10 hover:text-white" href="https://vihaan.ieeedtu.in" target="_blank" rel="noreferrer">Vihaan <ArrowUpRight size={13} className="text-electric" /></a>
              <a className="flex items-center justify-between rounded-lg px-3 py-3 transition hover:bg-white/10 hover:text-white" href="https://invictusdtu.in" target="_blank" rel="noreferrer">Invictus <ArrowUpRight size={13} className="text-electric" /></a>
            </div>
          </div>
          <a className="transition hover:text-white" href="/#chapters">Chapters</a>
          <a className="transition hover:text-white" href="/#connect">Faculty</a>
          <a className="transition hover:text-white" href="/#council">Council</a>
        </nav>
        <details className="group relative md:hidden">
          <summary className="grid h-9 w-9 cursor-pointer list-none place-items-center rounded-full border border-white/15 text-white"><Menu size={16} /></summary>
          <div className="absolute right-0 top-full mt-4 w-48 rounded-xl border border-white/10 bg-[#0b1324]/95 p-2 text-[10px] uppercase tracking-[0.16em] shadow-2xl backdrop-blur-xl">
            <a className="block rounded-lg px-3 py-3 text-muted hover:bg-white/10 hover:text-white" href="/#about">About</a>
            <a className="block rounded-lg px-3 py-3 text-muted hover:bg-white/10 hover:text-white" href="/#events">Events</a>
            <a className="block rounded-lg px-3 py-3 text-muted hover:bg-white/10 hover:text-white" href="/#chapters">Chapters</a>
            <a className="block rounded-lg px-3 py-3 text-muted hover:bg-white/10 hover:text-white" href="/#connect">Faculty</a>
            <a className="block rounded-lg px-3 py-3 text-muted hover:bg-white/10 hover:text-white" href="/#council">Council</a>
            <div className="my-1 h-px bg-white/10" />
            <a className="block rounded-lg px-3 py-3 text-muted hover:bg-white/10 hover:text-white" href="https://vihaan.ieeedtu.in" target="_blank" rel="noreferrer">Vihaan ↗</a>
            <a className="block rounded-lg px-3 py-3 text-muted hover:bg-white/10 hover:text-white" href="https://invictusdtu.in" target="_blank" rel="noreferrer">Invictus ↗</a>
          </div>
        </details>
        <a href="/join-now" className="rounded-full border border-electric bg-electric px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink shadow-glow transition hover:bg-signal">
          Join IEEE DTU <span className="ml-1">↗</span>
        </a>
      </div>
    </header>
  );
}
