import { Fragment, useRef } from "react";
import { AboutTitle } from "./AboutTitle";
import { GlobeArt } from "./GlobeArt";
import { DateBlock } from "./DateBlock";
import { AboutStats } from "./AboutStats";
import { HostCard } from "./HostCard";
import { HostTrack } from "./HostTrack";
import { useAboutMotion } from "./useAboutMotion";
import { Button, CornerSlabs } from "../../ui";
import { scrollToSection } from "../../../motion";
import { about } from "../../../content";

const HEADING_ID = "about-heading";

// Drawn, not a glyph: the arrow in 09/10 has square caps and a 2.2px stroke.
function Arrow() {
  return (
    <svg
      width="18"
      height="14"
      viewBox="0 0 18 14"
      aria-hidden="true"
      className="block"
    >
      <path
        d="M0 7h15M10 1.5 15.5 7 10 12.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="square"
      />
    </svg>
  );
}

// The dark band's top edge steps up at 49%. Never skew — skew drags the contents with it.
const BAND =
  "[clip-path:polygon(0_36px,38%_36px,46%_0,100%_0,100%_100%,0_100%)] lg:[clip-path:polygon(0_56px,46%_56px,49%_0,100%_0,100%_100%,0_100%)]";

const CROSSHAIRS = [
  "left-[38%] top-7",
  "left-6 top-14",
  "left-[42%] bottom-10",
  "right-16 bottom-20",
];

function Crosshair({ position }) {
  return (
    <span
      data-ab-cross
      className={`absolute hidden size-3.5 lg:block ${position}`}
    >
      <span className="absolute left-1.5 top-0 block h-3.5 w-0.5 bg-steel" />
      <span className="absolute left-0 top-1.5 block h-0.5 w-3.5 bg-steel" />
    </span>
  );
}

export function About() {
  const scope = useRef(null);
  useAboutMotion(scope);

  const goToEvents = (e) => {
    e.preventDefault();
    scrollToSection(about.cta.targetId);
  };

  return (
    <section
      id="about"
      ref={scope}
      aria-labelledby={HEADING_ID}
      className="relative mt-24 overflow-hidden bg-paper text-charcoal lg:mt-32"
    >
      <CornerSlabs />

      <div data-ab-top className="relative">
        <div aria-hidden="true">
          {CROSSHAIRS.map((position) => (
            <Crosshair key={position} position={position} />
          ))}
        </div>

        <div className="relative mx-auto grid w-full max-w-350 grid-cols-[148px_1fr] items-center gap-y-5 px-4 pt-16 md:px-[clamp(1rem,4vw,4rem)] lg:grid-cols-[3fr_3fr_2fr] lg:items-start lg:gap-x-14 lg:gap-y-10 lg:py-12 lg:pb-18">
          <div className="col-span-2 row-start-1 lg:col-span-2 lg:col-start-2 lg:row-start-1">
            <AboutTitle id={HEADING_ID} />
          </div>

          <div className="col-start-1 row-start-2 lg:col-start-3 lg:row-start-2">
            <DateBlock />
          </div>

          <div className="col-start-2 row-start-2 -mr-13 min-w-0 md:-mr-[calc(clamp(1rem,4vw,4rem)+36px)] lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:ml-[clamp(-48px,-2vw,0px)] lg:mr-0 lg:self-center">
            <GlobeArt className="max-w-62.5 md:max-w-85 lg:max-w-107.5" />
          </div>

          <div className="col-span-2 row-start-3 flex flex-col gap-3.5 pb-18 lg:col-span-1 lg:col-start-2 lg:row-start-2 lg:gap-5 lg:pb-0">
            <h3
              data-ab-story
              className="m-0 text-xs font-bold uppercase tracking-[0.34em] lg:text-[13px] lg:tracking-[0.42em]"
            >
              {about.whatIs.heading}
            </h3>
            <p className="m-0 max-w-[52ch] text-base font-medium leading-[1.7] lg:text-[17px] lg:leading-[1.75]">
              {about.whatIs.body}
            </p>
          </div>
        </div>
      </div>

      {/* Dark band */}
      <div data-ab-dark className="relative -mt-6 text-paper lg:-mt-10">
        <div
          aria-hidden="true"
          className={`absolute inset-0 bg-charcoal ${BAND}`}
        />
        <span
          data-ab-edge
          aria-hidden="true"
          className="absolute left-[46%] top-0 block h-bar w-[54%] origin-left bg-red lg:left-[49%] lg:h-1.5 lg:w-[34%]"
        />

        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
          <span
            data-ab-circle-deco
            className="absolute -bottom-27.5 -right-17.5 block size-45 rounded-dot bg-red lg:-bottom-37.5 lg:size-60"
          />
          <span
            data-ab-circle-deco
            className="absolute -bottom-23.75 right-15 block size-32.5 rounded-dot bg-pit lg:-bottom-32.5 lg:right-27.5 lg:size-45"
          />
          <span
            data-ab-circle-deco
            className="absolute -bottom-27.5 -left-27.5 hidden size-45 rounded-dot bg-track lg:block"
          />
        </div>

        <div className="relative mx-auto flex w-full max-w-350 flex-col gap-6 px-4 pb-18 pt-17 md:px-[clamp(1rem,4vw,4rem)] lg:gap-7.5 lg:pb-16 lg:pt-23">
          <AboutStats />

          <div aria-hidden="true" className="relative h-0.5 bg-track">
            <span
              data-ab-divider
              className="absolute left-0 -top-px block h-1 w-24 origin-left bg-red lg:w-35"
            />
          </div>

          <div className="grid gap-y-6 lg:grid-cols-[5fr_7fr] lg:items-center lg:gap-x-12 lg:gap-y-8">
            <div className="row-start-1 flex flex-col gap-3.5 lg:col-start-1 lg:gap-4">
              <div data-ab-alliance className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="block h-4 w-0.75 bg-red lg:h-4.5"
                />
                <span className="text-[11px] font-bold uppercase tracking-[0.32em] lg:text-xs">
                  {about.alliance.label}
                </span>
              </div>

              <h3 className="m-0 font-heading text-[34px] font-black uppercase italic leading-[0.96] tracking-heading lg:text-[clamp(30px,2.6vw,40px)]">
                <span className="relative inline-block">
                  <span data-ab-ally-word className="inline-block">
                    {about.alliance.heading}{" "}
                    <span className="text-red-bright">
                      {about.alliance.headingAccent}
                    </span>
                  </span>
                  <span
                    data-ab-ally-stripe
                    aria-hidden="true"
                    className="absolute inset-x-[-0.04em] bottom-[2%] top-[6%] block origin-left scale-x-0 bg-red"
                  />
                </span>
              </h3>

              <p className="m-0 max-w-[46ch] text-[15px] font-medium leading-[1.65] text-silver">
                {about.alliance.body}
              </p>
            </div>

            <div className="row-start-2 flex flex-col md:flex-row md:items-stretch lg:col-start-2 lg:row-span-2 lg:row-start-1">
              {about.hostCards.map((card, i) => (
                <Fragment key={card.hostId}>
                  {i > 0 && <HostTrack />}
                  <div
                    data-ab-card-wrap
                    data-side={i === 0 ? "left" : "right"}
                    className="flex min-w-0 md:flex-1"
                  >
                    <HostCard card={card} side={i === 0 ? "left" : "right"} />
                  </div>
                </Fragment>
              ))}
            </div>

            <div
              data-ab-cta
              className="row-start-3 lg:col-start-1 lg:row-start-2"
            >
              <Button
                variant="outline"
                href={`#${about.cta.targetId}`}
                onClick={goToEvents}
                trailing={<Arrow />}
                className="w-full justify-center md:w-auto md:justify-start"
              >
                {about.cta.label}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
