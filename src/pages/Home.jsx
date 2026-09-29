import OrbitVisual from "../components/OrbitVisual";

const stats = [
  ["40+", "Years of Legacy"],
  ["∞", "Ideas in motion"],
];

export default function Home() {
  const scrollTo = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="top" className="relative min-h-screen overflow-hidden bg-ink">
      <OrbitVisual />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-6 py-6 sm:px-10 lg:px-16">
        <div className="flex flex-1 items-center pb-20 pt-24 sm:pt-28">
          <div className="max-w-2xl">
            <p className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-electric">
              <span className="h-px w-8 bg-electric" /> North India's Largest IEEE Student Branch
            </p>
            <h1 className="max-w-3xl text-5xl font-bold leading-[.98] tracking-[-0.055em] text-white sm:text-7xl lg:text-[clamp(4.5rem,8vw,7.7rem)]">
              IEEE <span className="text-electric">DTU</span>
            </h1>
            <p className="mt-8 max-w-lg text-sm leading-7 text-muted sm:text-base">
              IEEE DTU is where curious minds meet ambitious ideas. Explore technology, collaborate with fellow builders, and turn the questions of today into the breakthroughs of tomorrow.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#events"
                onClick={scrollTo("events")}
                className="rounded-full bg-electric px-6 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-ink shadow-glow transition hover:bg-signal"
              >
                Explore Events <span className="ml-2">→</span>
              </a>
              <a
                href="#footer"
                onClick={scrollTo("footer")}
                className="rounded-full border border-white/20 bg-white/[.03] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition hover:border-electric hover:text-electric"
              >
                Contact Us
              </a>
            </div>
            <div className="mt-16 grid max-w-xl grid-cols-2 border-t border-white/10 pt-5">
              {stats.map(([value, label]) => (
                <div key={label}>
                  <p className="text-5xl font-bold tracking-tight text-white sm:text-4xl">{value}</p>
                  <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-4 text-[9px] font-semibold uppercase tracking-[0.22em] text-muted">
          <span>Delhi Technological University · New Delhi</span>
          <a
            href="#about"
            onClick={scrollTo("about")}
            className="hidden items-center gap-2 transition hover:text-electric sm:flex"
          >
            Scroll to discover <span className="text-electric">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
