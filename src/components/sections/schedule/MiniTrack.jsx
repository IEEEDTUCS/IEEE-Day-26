import { TrackCar } from "./TrackCar";

// Two rows of four: the chequered flag at the end of the straight.
const CHEQUER = [true, false, true, false, false, true, false, true];

export function MiniTrack() {
  return (
    <div
      data-mini
      aria-hidden="true"
      className="relative col-start-1 self-stretch overflow-clip bg-charcoal lg:hidden"
    >
      {/* Verge posts, the right row offset half a dash so they read as travelling. */}
      <svg
        width="44"
        height="100%"
        className="pointer-events-none absolute left-0 top-0 h-full"
      >
        <line
          x1="3.5"
          y1="0"
          x2="3.5"
          y2="100%"
          stroke="var(--color-steel)"
          strokeWidth="2"
          strokeDasharray="6 42"
        />
        <line
          x1="40.5"
          y1="0"
          x2="40.5"
          y2="100%"
          stroke="var(--color-steel)"
          strokeWidth="2"
          strokeDasharray="6 42"
          strokeDashoffset="24"
        />
      </svg>

      <span className="absolute inset-y-0 left-[7px] right-[7px] block border-x-2 border-paper bg-track" />
      <span className="absolute left-[11px] right-[11px] top-[10px] block h-[7px] border-2 border-t-0 border-silver" />
      <span className="absolute left-[9px] right-[9px] top-[58px] block h-[3px] bg-paper" />

      <span
        data-mcar
        className="sticky top-[calc(var(--nav-height)+62px+18vh)] z-[2] mx-auto mt-3 block h-[46px] w-[18px]"
      >
        {/* The trail, clipped by the column: it only ever shows above the car. */}
        <span className="absolute bottom-full left-2 block h-[6000px] w-0.5 bg-red" />

        <span
          data-mbody
          className="relative block origin-[50%_40%] will-change-transform"
        >
          <span
            data-mstreak
            className="absolute inset-x-0 bottom-full block h-[34px] opacity-0"
          >
            <i className="absolute bottom-1 left-0.5 block h-[22px] w-[1.5px] bg-paper" />
            <i className="absolute bottom-1 left-2 block h-8 w-[1.5px] bg-red" />
            <i className="absolute bottom-1 right-0.5 block h-[18px] w-[1.5px] bg-steel" />
          </span>

          <svg
            viewBox="-31 -152 62 158"
            width="18"
            height="46"
            className="block"
          >
            <g transform="rotate(90)">
              <TrackCar />
            </g>
          </svg>
        </span>
      </span>

      <span className="absolute bottom-0 left-[9px] right-[9px] grid h-[14px] grid-cols-4">
        {CHEQUER.map((white, i) => (
          <i
            key={i}
            className={`block ${white ? "bg-paper" : "bg-charcoal"}`}
          />
        ))}
      </span>
    </div>
  );
}
