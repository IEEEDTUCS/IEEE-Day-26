import Image from "next/image";

const chapters = [
  {
    code: "CS",
    logos: [["/logos/computer_soc.png", "IEEE Computer Society logo"]],
    title: "Computer Society Student Chapter",
    description: "A home for builders, developers, and problem-solvers exploring computer science through technical events, projects, and peer learning.",
    accent: "from-[#0c4770] via-[#0c263f] to-[#08111f]",
  },
  {
    code: "PES / IAS",
    logos: [["/logos/pes_white.png", "IEEE Power and Energy Society logo"], ["/logos/ias.png", "IEEE Industry Applications Society logo"]],
    title: "Power Energy Society — Industry Application Society Joint Chapter",
    description: "Connecting students with the systems, standards, and real-world applications shaping the future of power and energy.",
    accent: "from-[#07555b] via-[#0b3037] to-[#08111f]",
  },
  {
    code: "CASS",
    logos: [["/logos/cas.png", "IEEE Circuits and Systems Society logo"]],
    title: "Circuits and Systems Society Student Chapter",
    description: "A platform to learn, innovate, and collaborate across circuits, signal processing, VLSI, communications, and embedded systems.",
    accent: "from-[#234d79] via-[#182d50] to-[#08111f]",
  },
  {
    code: "WIE",
    logos: [["/logos/wie_white.png", "IEEE Women in Engineering logo"]],
    title: "Women In Engineering Affinity Group",
    description: "Building an inclusive community that supports the growth, visibility, and leadership of women in engineering and technology.",
    accent: "from-[#553a78] via-[#2b234c] to-[#08111f]",
  },
];

export default function ChaptersSection() {
  return (
    <section id="chapters" className="relative overflow-hidden bg-ink py-24 sm:py-32">
      <div className="absolute right-[-15%] top-1/3 h-[460px] w-[460px] rounded-full bg-electric/[.05] blur-[130px]" />
      <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <div data-reveal className="mb-12 flex items-end justify-between gap-8">
          <div>
            <p className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-electric">
              <span className="h-px w-8 bg-electric" /> Find your field
            </p>
            <h2 className="max-w-2xl text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl">
              Many disciplines, <span className="text-electric">one community.</span>
            </h2>
          </div>
          <p className="hidden max-w-xs text-right text-xs leading-5 text-muted sm:block">Four focused communities. More ways to learn, lead, and make an impact.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {chapters.map((chapter, index) => (
            <article data-reveal key={chapter.code} className="group relative min-h-[350px] overflow-hidden rounded-2xl border border-white/10 bg-panel transition duration-500 hover:-translate-y-2 hover:border-electric/55 hover:shadow-[0_0_42px_rgba(32,217,255,.14)]">
              <div className={`absolute inset-0 bg-gradient-to-br ${chapter.accent}`} />
              <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full border border-electric/20 bg-electric/10 blur-2xl transition duration-500 group-hover:bg-electric/20" />
              <div className="relative flex h-full flex-col justify-between p-6">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-electric">0{index + 1}</span>
                  <span className="rounded-full border border-white/15 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white/70">{chapter.code}</span>
                </div>
                <div className="flex h-[150px] items-center justify-center gap-4">
                  {chapter.logos.map(([src, alt]) => (
                    <Image
                      key={src}
                      src={src}
                      alt={alt}
                      width={chapter.logos.length === 1 ? 144 : 96}
                      height={chapter.logos.length === 1 ? 104 : 80}
                      className={`${chapter.logos.length === 1 ? "h-24 w-36" : "h-16 w-24"} object-contain transition duration-500 group-hover:scale-105`}
                    />
                  ))}
                </div>
                <div>
                  <div className="mb-5 h-px w-full bg-white/15 transition-colors duration-500 group-hover:bg-electric/70" />
                  <h3 className="text-2xl font-bold leading-tight tracking-[-0.035em] text-white">{chapter.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-white/65">{chapter.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
