// Latitudes
const LATITUDES = [
  { y: 182.8, half: 85 },
  { y: 245, half: 147.2 },
  { y: 330, half: 170 },
  { y: 415, half: 147.2 },
  { y: 477.2, half: 85 },
];

export const GLOBE_ORIGIN = "300 330";

const MERIDIANS = [0.966, 0.707, 0.259, -0.259, -0.707, -0.966];

// Flat slashes under the circles, drawn inside a -14deg group.
const STREAKS = [
  { points: "-40,386 -32.8,380 520,380 512.8,386", tone: "fill-red" },
  { points: "10,426 26.8,412 430,412 413.2,426", tone: "fill-charcoal" },
  { points: "-20,449 -16.4,446 580,446 576.4,449", tone: "fill-charcoal" },
  { points: "60,480 72.0,470 360,470 348.0,480", tone: "fill-red" },
  { points: "0,503 3.6,500 480,500 476.4,503", tone: "fill-steel" },
  { points: "90,532 99.6,524 350,524 340.4,532", tone: "fill-charcoal" },
];

const DOT_COLS = [430, 452, 474, 496];
const DOT_ROWS = [86, 108, 130];

const PIN = { x: 338, y: 372 };

// The car laps this ellipse. Same path the track is drawn from.
export const ORBIT_PATH = "M -236 0 A 236 72 0 1 0 236 0 A 236 72 0 1 0 -236 0";

// Track elipses
const ORBIT = { rx: 236, ry: 72 };
const TRACK = [
  { tone: "stroke-paper", width: 8 },
  { tone: "stroke-charcoal", width: 5.5 },
  { tone: "stroke-paper", width: 0.9, dash: "7 11" },
];

function Wireframe({ stroke }) {
  return (
    <>
      <circle
        cx="300"
        cy="330"
        r="170"
        fill="none"
        className={stroke}
        strokeWidth="2"
      />
      {LATITUDES.map(({ y, half }) => (
        <line
          key={y}
          x1={300 - half}
          y1={y}
          x2={300 + half}
          y2={y}
          className={stroke}
          strokeWidth="1.5"
        />
      ))}
      {MERIDIANS.map((scale, i) => (
        <ellipse
          key={scale}
          data-ab-meridian
          data-phase={i}
          cx="300"
          cy="330"
          rx="170"
          ry="170"
          fill="none"
          data-scale={scale}
          className={stroke}
          strokeWidth="1.5"
        />
      ))}
    </>
  );
}

const REAR_TYRES = [-7.2, 3.6];
const FRONT_TYRES = [-6.6, 3.2];

function Tyres({ ys, x, width, height }) {
  return ys.map((y) => (
    <rect
      key={y}
      x={x}
      y={y}
      width={width}
      height={height}
      className="fill-charcoal"
    />
  ));
}

function OrbitCar() {
  return (
    <g
      data-ab-orbit-car
      className="stroke-paper"
      strokeWidth="1.9"
      strokeLinejoin="round"
      paintOrder="stroke"
    >
      {/* rear wing */}
      <rect
        x="-20"
        y="-7.2"
        width="3.4"
        height="14.4"
        className="fill-charcoal"
      />
      {/* rear tyres */}
      <Tyres ys={REAR_TYRES} x={-15.5} width={7} height={3.6} />
      {/* chassis, tapering from the rear axle to the nose */}
      <polygon
        points="-16.5,-3.4 -5,-3.8 3,-2.4 12,-1.3 17.5,-1 17.5,1 12,1.3 3,2.4 -5,3.8 -16.5,3.4"
        className="fill-red"
      />
      {/* front tyres */}
      <Tyres ys={FRONT_TYRES} x={4} width={6.5} height={3.4} />
      {/* front wing */}
      <rect x="16.5" y="-6" width="3.1" height="12" className="fill-charcoal" />
    </g>
  );
}

export function GlobeArt({ className = "" }) {
  return (
    <svg
      viewBox="0 0 560 640"
      width="100%"
      aria-hidden="true"
      className={`block overflow-visible ${className}`}
    >
      <defs>
        {/* Rendered once per page, so plain ids are safe. */}
        <clipPath id="about-clip-red">
          <circle cx="210" cy="250" r="190" />
        </clipPath>
        <clipPath id="about-clip-both">
          <circle cx="210" cy="250" r="190" />
          <circle cx="370" cy="420" r="150" />
        </clipPath>
      </defs>

      <g data-ab-circle>
        <circle cx="210" cy="250" r="190" className="fill-red" />
      </g>
      <g data-ab-circle>
        <circle cx="370" cy="420" r="150" className="fill-charcoal" />
        {/* Where the two overlap the palette goes a shade deeper. */}
        <circle
          cx="370"
          cy="420"
          r="150"
          className="fill-red-deep"
          clipPath="url(#about-clip-red)"
        />
      </g>

      <line
        data-ab-hairline
        x1="-30"
        y1="560"
        x2="540"
        y2="90"
        className="stroke-red"
        strokeWidth="1.5"
      />
      <line
        data-ab-hairline
        x1="40"
        y1="620"
        x2="580"
        y2="180"
        className="stroke-charcoal"
        strokeWidth="1.5"
      />

      <g data-ab-globe>
        <Wireframe stroke="stroke-charcoal" />
        <g clipPath="url(#about-clip-both)">
          <Wireframe stroke="stroke-paper" />
        </g>
      </g>

      <g transform="translate(300 330) rotate(-16)">
        {TRACK.map(({ tone, width, dash }) => (
          <ellipse
            key={`${tone}-${width}`}
            data-ab-orbit
            cx="0"
            cy="0"
            {...ORBIT}
            fill="none"
            className={tone}
            strokeWidth={width}
            strokeDasharray={dash}
          />
        ))}
        <OrbitCar />
      </g>

      <g transform="rotate(-14 280 460)">
        {STREAKS.map(({ points, tone }) => (
          <polygon
            key={points}
            data-ab-streak
            points={points}
            className={tone}
          />
        ))}
      </g>

      {/* Timing board: one red column, like the start-light gantry. */}
      <g data-ab-dots>
        {DOT_ROWS.map((cy) =>
          DOT_COLS.map((cx, col) => (
            <circle
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              r="5"
              className={
                col === DOT_COLS.length - 1 ? "fill-red" : "fill-charcoal"
              }
            />
          )),
        )}
      </g>

      <g data-ab-pin>
        {[0, 1].map((i) => (
          <circle
            key={i}
            data-ab-ping
            data-offset={i}
            cx={PIN.x}
            cy={PIN.y}
            r="7"
            fill="none"
            className="stroke-red"
            strokeWidth="2"
          />
        ))}
        <circle
          cx={PIN.x}
          cy={PIN.y}
          r="6"
          className="fill-red stroke-paper"
          strokeWidth="2.5"
        />
      </g>
    </svg>
  );
}
