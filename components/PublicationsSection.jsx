import { ArrowUpRight, BookOpen } from "lucide-react";

const publications = [
  ["Echo 6.0", "https://drive.google.com/file/d/14ksyQxVNlmvn-Dlejx3UxAlmt6Ph8dB1/preview", "from-[#0c4770] via-[#0c263f] to-[#08111f]"],
  ["Echo 5.0", "https://drive.google.com/file/d/1hT9ceYOAZfqYOgnMZTNJYpW-H8JX0fKb/preview", "from-[#07555b] via-[#0b3037] to-[#08111f]"],
  ["Echo 4.0", "https://drive.google.com/file/d/1Ihxx9r-3F841MfW7KAC8pI6UhNzUd4-_/preview", "from-[#553a78] via-[#2b234c] to-[#08111f]"],
  ["Echo 3.0", "https://drive.google.com/file/d/1j5NUIw4WbflgP3znGsNri8gF3RDPNtOj/preview", "from-[#234d79] via-[#182d50] to-[#08111f]"],
  ["Echo 2.0", "https://drive.google.com/file/d/1dKqNR00hXFaOFR62Zxm40tx7U53MsHb8/preview", "from-[#3d4f7d] via-[#202d50] to-[#08111f]"],
  ["Echo 1.0", "https://drive.google.com/file/d/1FXXYn6BYUEXEwRdoakvRNpoODFWLWz29/preview", "from-[#124f64] via-[#102d40] to-[#08111f]"],
];

export default function PublicationsSection() {
  return (
    <section id="publications" className="relative overflow-hidden bg-ink py-24 sm:py-32">
      <div className="absolute right-[-10%] top-1/3 h-96 w-96 rounded-full bg-electric/[.05] blur-[120px]" />
      <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <div data-reveal className="mb-12 flex items-end justify-between gap-8">
          <div>
            <p className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-electric"><span className="h-px w-8 bg-electric" /> IEEE DTU Publications</p>
            <h2 className="max-w-2xl text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl">Read <span className="text-electric">Our Annual Newsletter</span></h2>
          </div>
          <p className="hidden max-w-xs text-right text-xs leading-5 text-muted sm:block">Six editions of IEEE DTU&apos;s official newsletter, collected in one place.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {publications.map(([name, href, accent], index) => (
            <a data-reveal key={name} href={href} target="_blank" rel="noreferrer" className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${accent} p-6 transition duration-500 hover:-translate-y-2 hover:border-electric/55 hover:shadow-[0_0_36px_rgba(32,217,255,.14)]`}>
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-electric/10 blur-2xl transition group-hover:bg-electric/25" />
              <div className="relative flex items-start justify-between"><span className="grid h-12 w-12 place-items-center rounded-xl border border-electric/40 bg-ink/70 text-electric"><BookOpen size={20} /></span><span className="text-[10px] font-bold tracking-[0.2em] text-muted">0{6 - index}</span></div>
              <div className="relative mt-12 flex items-end justify-between"><h3 className="text-2xl font-bold text-white">{name}</h3><ArrowUpRight size={20} className="text-electric transition group-hover:translate-x-1 group-hover:-translate-y-1" /></div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
