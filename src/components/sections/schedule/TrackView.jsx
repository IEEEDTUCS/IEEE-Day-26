import { Fragment } from "react";
import { TrackCar } from "./TrackCar";
import {
  ASPHALT_W,
  BARRIER_PATHS,
  CHEQUER,
  GRASS,
  GRID_SLOTS,
  KERB_PATHS,
  ROAD_PATH,
  RUNOFF_PATHS,
  START_LINE,
  TRACK_BAND,
  VIEW_W,
} from "./trackGeometry";

// One path stroked four times, widest first, is what gives the circuit its wall, verge,
// limits and asphalt without four sets of offset outlines.
const BAND = [
  { width: 247, stroke: "var(--color-steel)" },
  { width: 240, stroke: "var(--color-charcoal)" },
  { width: 218, stroke: "var(--color-paper)" },
  { width: ASPHALT_W, stroke: "var(--color-track)" },
];

const BOARD_POP = "[transform-box:fill-box] [transform-origin:left_center]";

/** A time checkpoint: a line across the asphalt and a small board beside it. */
function TimeBoard({ label }) {
  return (
    <g data-plate className="group/pl">
      <g data-plate-line transform="translate(-999 -999)">
        <rect
          x="-1.25"
          y="-105"
          width="2.5"
          height="210"
          className="fill-paper transition-[fill] duration-200 group-data-[passed]/pl:fill-red-deep group-data-[live]/pl:fill-red"
        />
      </g>
      <g data-plate-board transform="translate(-999 -999)">
        <g data-pop className={BOARD_POP}>
          <polygon
            points="0,-15 80,-15 74,15 0,15"
            strokeWidth="1.2"
            className="fill-charcoal stroke-steel transition-[fill,stroke] duration-200 group-data-[passed]/pl:fill-red-deep group-data-[passed]/pl:stroke-red-deep group-data-[live]/pl:fill-red group-data-[live]/pl:stroke-red"
          />
          <text
            x="10"
            y="5.5"
            className="tabular fill-paper text-[15px] font-bold"
          >
            {label}
          </text>
        </g>
      </g>
    </g>
  );
}

/** A day gate: a wider line and the day board. */
function DayBoard({ day }) {
  return (
    <g data-gate className="group/gt">
      <g data-gate-line transform="translate(-999 -999)">
        <rect
          x="-2"
          y="-109"
          width="4"
          height="218"
          className="fill-paper transition-[fill] duration-[250ms] group-data-[passed]/gt:fill-red"
        />
      </g>
      <g data-gate-board transform="translate(-999 -999)">
        <g data-pop className={BOARD_POP}>
          <polygon
            points="0,-26 132,-26 122,26 0,26"
            className="fill-paper transition-[fill] duration-[250ms] group-data-[passed]/gt:fill-red"
          />
          <text
            x="12"
            y="2"
            className="fill-charcoal font-heading text-[23px] font-black italic tracking-[-0.01em] transition-[fill] duration-[250ms] group-data-[passed]/gt:fill-paper"
          >
            {day.plate.toUpperCase()}
          </text>
          <text
            x="12"
            y="17"
            className="fill-charcoal text-[10px] font-bold tracking-[0.24em] transition-[fill] duration-[250ms] group-data-[passed]/gt:fill-paper"
          >
            {day.date.toUpperCase()}
          </text>
        </g>
      </g>
    </g>
  );
}

export function TrackView({ days, events }) {
  return (
    <div
      data-trk-view
      aria-hidden="true"
      className="relative hidden min-h-0 flex-1 overflow-hidden bg-pit lg:block"
    >
      <svg
        data-svg
        viewBox={`0 0 ${VIEW_W} 700`}
        preserveAspectRatio="xMidYMin slice"
        className="absolute inset-0 block h-full w-full"
      >
        <g data-cam>
          <rect {...GRASS} fill="var(--color-pit)" />

          {BARRIER_PATHS.map((d) => (
            <path
              key={d}
              d={d}
              fill="none"
              stroke="var(--color-steel)"
              strokeWidth="7"
            />
          ))}
          <path
            d={TRACK_BAND}
            fill="none"
            stroke={BAND[0].stroke}
            strokeWidth={BAND[0].width}
          />

          {RUNOFF_PATHS.map((d) => (
            <path key={d} d={d} fill="var(--color-charcoal)" />
          ))}
          <path
            d={TRACK_BAND}
            fill="none"
            stroke={BAND[1].stroke}
            strokeWidth={BAND[1].width}
          />

          {/* Exit kerbs: paper, then red on a 9/9 dash over the top. */}
          {KERB_PATHS.map((d) => (
            <Fragment key={d}>
              <path
                d={d}
                fill="none"
                stroke="var(--color-paper)"
                strokeWidth="16"
              />
              <path
                d={d}
                fill="none"
                stroke="var(--color-red)"
                strokeWidth="16"
                strokeDasharray="9 9"
              />
            </Fragment>
          ))}

          {BAND.slice(2).map((band) => (
            <path
              key={band.width}
              d={TRACK_BAND}
              fill="none"
              stroke={band.stroke}
              strokeWidth={band.width}
            />
          ))}

          {/* The rubber line the field has laid down on the racing line. */}
          <path
            d={ROAD_PATH}
            fill="none"
            stroke="var(--color-charcoal)"
            strokeWidth="20"
            strokeLinecap="round"
          />

          {GRID_SLOTS.map((slot) => (
            <path
              key={slot.d}
              d={slot.d}
              fill="none"
              stroke={`var(--color-${slot.tone})`}
              strokeWidth="3"
            />
          ))}
          <rect {...START_LINE} fill="var(--color-paper)" />
          {CHEQUER.map((square) => (
            <rect
              key={`${square.x}-${square.y}`}
              {...square}
              fill="var(--color-paper)"
            />
          ))}

          {/* Drawn behind the car and revealed by its stroke-dashoffset. */}
          <path
            data-trail
            d={ROAD_PATH}
            fill="none"
            stroke="var(--color-red)"
            strokeWidth="3.5"
          />

          {events.map((event) => (
            <TimeBoard
              key={event.id}
              label={event.start ? event.start.time : "TBA"}
            />
          ))}
          {days.map((day) => (
            <DayBoard key={day.id} day={day} />
          ))}

          <g data-car transform="translate(280 300) rotate(90)">
            <TrackCar />
          </g>
        </g>
      </svg>
    </div>
  );
}
