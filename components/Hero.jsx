import BrandMark from "./BrandMark";
import OrbitVisual from "./OrbitVisual";

const stats = [
  ["1983", "Established"],
  ["4", "Technical chapters"],
  ["∞", "Ideas in motion"],
];

export default function Hero() {
  return (
    <section id="top" className="relative min-h-screen overflow-hidden bg-ink">
      <OrbitVisual />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-6 py-6 sm:px-10 lg:px-16">
        <header className="flex items-center justify-between border-b border-white/10 pb-5">
          <BrandMark />
          <nav className="hidden items-center gap-9 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted md:flex" aria-label="Primary navigation">
            <a className="transition hover:text-white" href="#about">About</a>
            <a className="transition hover:text-white" href="#chapters">Chapters</a>
            <a className="transition hover:text-white" href="#events">Events</a>
            <a className="transition hover:text-white" href="#connect">Connect</a>
          </nav>
          <a href="#join" className="rounded-full border border-electric bg-electric px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink shadow-glow transition hover:bg-signal">
            Join IEEE DTU <span className="ml-1">↗</span>
          </a>
        </header>

        <div className="flex flex-1 items-center pb-20 pt-20 sm:pt-28">
          <div className="max-w-2xl">
            <p className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-electric">
              <span className="h-px w-8 bg-electric" /> The student branch of DTU
            </p>
            <h1 className="max-w-3xl text-5xl font-bold leading-[.98] tracking-[-0.055em] text-white sm:text-7xl lg:text-[clamp(4.5rem,8vw,7.7rem)]">
              Build what&apos;s <span className="text-electric">next.</span>
            </h1>
            <p className="mt-8 max-w-lg text-sm leading-7 text-muted sm:text-base">
              IEEE DTU is where curious minds meet ambitious ideas. Explore technology, find your people, and turn the questions of today into the breakthroughs of tomorrow.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#about" className="rounded-full bg-electric px-6 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-ink shadow-glow transition hover:bg-signal">
                Explore IEEE DTU <span className="ml-2">↗</span>
              </a>
              <a href="#events" className="rounded-full border border-white/20 bg-white/[.03] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition hover:border-electric hover:text-electric">
                See what&apos;s happening
              </a>
            </div>
            <div className="mt-16 grid max-w-xl grid-cols-3 border-t border-white/10 pt-5">
              {stats.map(([value, label]) => (
                <div key={label} className="border-r border-white/10 last:border-0">
                  <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{value}</p>
                  <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-4 text-[9px] font-semibold uppercase tracking-[0.22em] text-muted">
          <span>Delhi Technological University · New Delhi</span>
          <a href="#about" className="hidden items-center gap-2 transition hover:text-electric sm:flex">Scroll to discover <span className="text-electric">↓</span></a>
        </div>
      </div>
    </section>
  );
}
