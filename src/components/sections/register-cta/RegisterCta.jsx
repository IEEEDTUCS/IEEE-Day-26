import { SectionHeading } from "../../ui";

export function RegisterCta() {
  return (
    <section
      id="register"
      className="relative flex min-h-[60vh] items-center justify-center overflow-hidden border-t border-silver bg-paper py-28 sm:py-36"
    >
      <div className="container-page relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <SectionHeading>Register</SectionHeading>

        <p className="mb-12 mt-6 max-w-2xl text-[17px] leading-relaxed text-charcoal/80">
          IEEE Day 2026 runs across two campuses. Choose your campus to register on Unstop.
        </p>

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-10">
          {/* DTU Card */}
          <a
            href="https://unstop.com/college-fests/ieee-day-2026-delhi-technological-university-dtu-new-delhi-514223"
            target="_blank"
            rel="noreferrer"
            className="group relative flex flex-col overflow-hidden border-2 border-charcoal bg-paper p-8 text-left transition-[transform,border-color] duration-150 ease-race hover:-translate-y-1 hover:border-red focus-visible:-translate-y-1 focus-visible:border-red"
          >
            {/* Accent bar */}
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 h-[38%] w-1.5 bg-red transition-[height] duration-150 ease-race group-hover:h-full group-focus-visible:h-full"
            />

            <h3 className="mb-3 text-[28px] font-bold uppercase leading-none tracking-tight text-charcoal">
              DTU Campus
            </h3>
            <p className="mb-8 flex-1 text-[14px] font-medium leading-relaxed text-charcoal/70">
              Delhi Technological University
              <br />
              New Delhi
            </p>

            <span className="inline-flex items-center self-start bg-red px-5 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-paper transition-colors duration-150 group-hover:bg-red-deep">
              Register ↗
            </span>
          </a>

          {/* GTBIT Card */}
          <a
            href="https://unstop.com/college-fests/ieee-day-2026-institute-of-electrical-and-electronics-engineers-gtbit-517795/"
            target="_blank"
            rel="noreferrer"
            className="group relative flex flex-col overflow-hidden border-2 border-charcoal bg-paper p-8 text-left transition-[transform,border-color] duration-150 ease-race hover:-translate-y-1 hover:border-red focus-visible:-translate-y-1 focus-visible:border-red"
          >
            {/* Accent bar */}
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 h-[38%] w-1.5 bg-red transition-[height] duration-150 ease-race group-hover:h-full group-focus-visible:h-full"
            />

            <h3 className="mb-3 text-[28px] font-bold uppercase leading-none tracking-tight text-charcoal">
              GTBIT Campus
            </h3>
            <p className="mb-8 flex-1 text-[14px] font-medium leading-relaxed text-charcoal/70">
              Guru Tegh Bahadur Institute of Technology
              <br />
              New Delhi
            </p>

            <span className="inline-flex items-center self-start bg-red px-5 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-paper transition-colors duration-150 group-hover:bg-red-deep">
              Register ↗
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
