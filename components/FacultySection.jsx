import Image from "next/image";

const advisors = [
  ["RK", "Prof. Rahul Katarya", <>Faculty Advisor,<br/>Computer Society Student Chapter</>, "/images/faculty/rahulkatarya.png"],
  ["RG", "Prof. Rachna Garg", <>Faculty Advisor,<br />PES-IAS Joint Student Chapter</>, "/images/faculty/rachnagarg.png"],
  ["DN", "Dr. Devanand", <>Faculty Advisor,<br />CASS Student Chapter</>, "/images/faculty/devanand.png"],
  ["SS", "Dr. Sonal Singh", <>Faculty Advisor,<br />Women-in-Engineering Affinity Group</>, "/images/faculty/sonalsingh.png"],
];

export default function FacultySection() {
  return (
    <section id="connect" className="relative overflow-hidden bg-ink py-24 sm:py-32">
      <div className="absolute right-[-12%] top-1/3 h-[420px] w-[420px] rounded-full bg-electric/[.05] blur-[120px]" />
      <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <div className="mb-12 max-w-2xl">
          <p className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-electric">
            <span className="h-px w-8 bg-electric" /> The support system
          </p>
          <h2 className="text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl">
            Guided by experience, <span className="text-electric">driven by curiosity.</span>
          </h2>
        </div>

        <article className="relative overflow-hidden rounded-2xl border border-electric/30 bg-gradient-to-br from-[#10294b] via-panel to-[#08101e] p-6 shadow-[0_0_48px_rgba(32,217,255,.1)] sm:p-9 lg:p-12">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-electric/10 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[280px_1fr] lg:items-center lg:gap-10 px-10">
            <div className="flex items-center gap-5 lg:block">
              <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-2xl border border-electric/50 bg-ink/60 shadow-glow lg:ml-6 lg:h-56 lg:w-56">
                <Image
                  src="/images/faculty/jpanda.png"
                  alt="Prof. Jeebananda Panda"
                  fill
                  sizes="(min-width: 1024px) 144px, 80px"
                  className="object-cover"
                />
              </div>
              <div className="lg:mt-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-electric">Branch Counsellor</p>
                <h3 className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">Prof. Jeebananda Panda</h3>
              </div>
            </div>
            <div>
              <div className="relative max-w-5xl border-l border-electric/50 pl-5 sm:pl-7">
                <span className="absolute -left-3 -top-5 text-5xl leading-none text-electric/60">“</span>
                <p className="text-[15px] leading-7 text-white/75 sm:text-base sm:leading-8">
                  Prof. Jeebananda Panda, Branch Counsellor of IEEE DTU, has been a steadfast source of guidance, encouragement, and institutional support for the student branch. His mentorship strengthens our culture of technical excellence, collaboration, and service, and it is a privilege to have him with us as we begin another year of our journey. He has received the Outstanding Branch Counsellor Award from the IEEE Delhi Section for several consecutive years, recognising his sustained commitment to nurturing student innovation and leadership.
                </p>
              </div>
            </div>
          </div>
        </article>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {advisors.map(([, name, role, image]) => (
            <article key={name} className="group flex min-h-[310px] flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[.025] px-6 py-8 text-center transition duration-500 hover:-translate-y-1 hover:border-electric/45 hover:bg-white/[.04] hover:shadow-[0_0_36px_rgba(32,217,255,.12)]">
              <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-electric/45 bg-panel shadow-[0_0_28px_rgba(32,217,255,.16)] transition duration-500 group-hover:scale-105 group-hover:border-electric">
                <Image
                  src={image}
                  alt={name}
                  fill
                  sizes="112px"
                  className="object-cover object-center"
                />
              </div>
              <h3 className="mt-7 text-lg font-bold tracking-tight text-white">{name}</h3>
              <p className="mt-3 max-w-[260px] text-sm leading-5 text-white/60">{role}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
