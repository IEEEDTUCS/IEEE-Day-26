import { Button } from "../ui/Button";
import { scrollToSection } from "../../motion/useLenis";

const stats = [
  ["40+", "Years of Legacy"],
  ["∞", "Ideas in motion"],
];

export default function Hero() {
  const scrollTo = (id) => (e) => {
    e.preventDefault();
    scrollToSection(id);
  };

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-paper"
    >
      <div className="container-page relative z-10 flex min-h-screen flex-col py-6">
        <div className="flex flex-1 items-center pb-20 pt-24 sm:pt-28">
          <div className="max-w-2xl">
            <p className="label-spaced mb-6 flex items-center gap-4 text-charcoal">
              <span aria-hidden="true" className="h-bar w-10 shrink-0 bg-red" />
              North India&apos;s Largest IEEE Student Branch
            </p>
            <h1 className="max-w-3xl text-mega text-charcoal">
              IEEE <span className="text-red">DTU</span>
            </h1>
            <p className="mt-8 max-w-lg text-sm leading-7 text-charcoal/80 sm:text-base">
              IEEE DTU is where curious minds meet ambitious ideas. Explore
              technology, collaborate with fellow builders, and turn the
              questions of today into the breakthroughs of tomorrow.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="#events" onClick={scrollTo("events")} trailing="→">
                Explore Events
              </Button>
              <Button
                variant="secondary"
                href="#contact"
                onClick={scrollTo("contact")}
              >
                Contact Us
              </Button>
            </div>
            <div className="mt-16 grid max-w-xl grid-cols-2 border-t border-silver pt-5">
              {stats.map(([value, label]) => (
                <div key={label}>
                  <p className="statement tabular text-stat text-charcoal">
                    {value}
                  </p>
                  <p className="label-spaced mt-2 text-charcoal/70">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="label-spaced flex items-center justify-between border-t border-silver pt-4 text-charcoal/70">
          <span>Delhi Technological University · New Delhi</span>
          <a
            href="#about"
            onClick={scrollTo("about")}
            className="hidden items-center gap-2 transition-colors duration-(--duration-fast) hover:text-red sm:flex"
          >
            Scroll to discover <span className="text-red">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
