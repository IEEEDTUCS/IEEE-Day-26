import { Fragment } from "react";
import { about } from "../../../content";

const CHEVRONS = ["fill-track", "fill-steel", "fill-red"];

// The lower-third bundle, wide layouts only. Each bar is a slanted slab.
const BARS = [
  { top: 6, width: "100%", height: 3, tone: "bg-steel", cut: 3 },
  { top: 18, width: "72%", height: 8, tone: "bg-red", cut: 8, glint: 3 },
  { top: 34, width: "88%", height: 2, tone: "bg-track", cut: 2 },
  { top: 44, width: "54%", height: 5, tone: "bg-steel", cut: 5 },
  { top: 56, width: "96%", height: 10, tone: "bg-track", cut: 10 },
  { top: 72, width: "40%", height: 3, tone: "bg-red", cut: 3, glint: 4.6 },
];

const cut = (px) =>
  `polygon(${px}px 0, 100% 0, calc(100% - ${px}px) 100%, 0 100%)`;

function StatCell({ stat }) {
  const words = stat.label.split(" ");

  return (
    <div data-ab-stat className="flex flex-none flex-col gap-2">
      <span
        className={`tabular whitespace-nowrap font-body text-[clamp(40px,3.4vw,52px)] font-extrabold leading-[0.95] ${
          stat.accent ? "text-red-bright" : "text-paper"
        }`}
      >
        <span
          data-ab-count
          data-value={stat.value}
          className="inline-block"
          style={{ minWidth: `${String(stat.value).length}ch` }}
        >
          {stat.value}
        </span>
        {stat.suffix && (
          <span data-ab-suffix className="inline-block">
            {stat.suffix}
          </span>
        )}
      </span>

      <span className="text-sm font-semibold uppercase leading-[1.4] tracking-[0.16em] text-paper md:tracking-[0.32em]">
        {words.map((word, i) => (
          <Fragment key={word}>
            {/* Wide enough and it stays on one line. */}
            {i > 0 && <br className="md:hidden" />}
            {i > 0 && <span className="hidden md:inline"> </span>}
            {word}
          </Fragment>
        ))}
      </span>
    </div>
  );
}

export function AboutStats() {
  return (
    <div className="flex items-start gap-3.5 md:items-center md:gap-[clamp(20px,2.6vw,40px)]">
      {about.stats.map((stat, i) => (
        <Fragment key={stat.label}>
          {i > 0 && (
            <span
              data-ab-stat-divider
              aria-hidden="true"
              className="block h-16 w-0.5 flex-none skew-x-[-18deg] bg-track"
            />
          )}
          <StatCell stat={stat} />
        </Fragment>
      ))}

      <div
        aria-hidden="true"
        className="hidden pl-[clamp(8px,2vw,32px)] lg:block"
      >
        <div className="flex flex-none gap-1.75">
          {CHEVRONS.map((tone) => (
            <span key={tone} data-ab-chevron className="block">
              <svg width="42" height="62" viewBox="0 0 30 44" className="block">
                <polygon
                  points="0,0 13,0 30,22 13,44 0,44 17,22"
                  className={tone}
                />
              </svg>
            </span>
          ))}
        </div>
      </div>

      <div
        aria-hidden="true"
        className="relative hidden h-19 min-w-20 flex-1 lg:block"
      >
        {BARS.map((bar) => (
          <span
            key={bar.top}
            data-ab-bar
            className={`absolute left-0 block origin-left ${bar.tone}`}
            style={{
              top: bar.top,
              width: bar.width,
              height: bar.height,
              clipPath: cut(bar.cut),
            }}
          >
            {bar.glint && (
              <span
                data-ab-glint
                data-seconds={bar.glint}
                className="absolute left-0 top-0 block h-full w-[14%] bg-paper"
              />
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
