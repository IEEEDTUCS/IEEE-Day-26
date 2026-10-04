/** Width of the SVG world. The viewBox height is recomputed from the panel's aspect ratio. */
export const VIEW_W = 560;
/** Centre of the straight, and the side a board flips to when the centreline passes it. */
export const CENTER_X = 280;
/** Asphalt width, and half of it — boards clear the track by the half plus their own gap. */
export const ASPHALT_W = 210;
export const HALF_WIDTH = 105;
/** The grid, and the chequered flag: the car's whole run lives between these. */
export const START_Y = 300;
export const FINISH_Y = 2420;

/** Pit-dark ground the circuit is cut out of. */
export const GRASS = { x: -400, y: -900, width: 1360, height: 4320 };

/** Armco, stroked steel 7. */
export const BARRIER_PATHS = [
  "M167.3 445.3 L167.3 445.3 Z",
  "M91 721 L91 721 Z",
  "M243.7 1126.2 L243.7 1126.2 Z",
  "M101 1419 L101 1419 Z",
  "M389 382 L389 382 Z",
  "M322 780.8 L322 780.8 Z",
  "M469 1078 L469 1078 Z",
  "M326.8 1474.7 L326.8 1474.7 Z",
];

/** Charcoal run-off areas, filled. */
export const RUNOFF_PATHS = [
  "M167.3 445.3 L167.3 445.3 Z",
  "M91 721 L91 721 Z",
  "M243.7 1126.2 L243.7 1126.2 Z",
  "M101 1419 L101 1419 Z",
  "M389 382 L389 382 Z",
  "M322 780.8 L322 780.8 Z",
  "M469 1078 L469 1078 Z",
  "M326.8 1474.7 L326.8 1474.7 Z",
];

/** Exit kerbs: each drawn paper 16, then red 16 on a 9/9 dash. */
export const KERB_PATHS = [
  "M98.3 542.5 L95.4 551.1 L94.1 555.5 L91.7 564.5 L89.5 573.7 L86.9 587.8 L85 602.3 L83.7 617.1 L83.2 627.2 L83 637 L83 667",
  "M117 887 L123.5 897.1 L130.3 906.5 L133.8 911 L140.8 919.5 L144.3 923.5 L155 934.6 L158.5 938 L165.5 944.4 L175.7 953.1 L188.5 963.3 L205.7 975.8 L224 988.7",
  "M125.4 1221.9 L122.3 1227 L116.5 1237.7 L111.2 1248.9 L108.8 1254.7 L106.6 1260.6 L102.5 1272.7 L99.2 1285.2 L97.8 1291.5 L95.5 1304.3 L94 1317.2 L93.5 1323.7 L93 1335.9 L93 1371",
  "M123.1 1579.4 L128.9 1589 L131.9 1593.5 L134.9 1597.9 L141.1 1606.3 L150.6 1617.8 L153.8 1621.4 L160.2 1628.1 L166.4 1634.2 L172.5 1639.9 L178.4 1645.2 L184.1 1650 L194.6 1658.5 L217 1675.6",
  "M381 519.6 L377.8 528 L374.4 536 L369 547.3 L363.3 557.9 L357.4 567.7 L352.6 575 L344.5 586.4 L337.2 595.9 L324 612.3 L321.6 615.5 L320.3 617.5",
  "M444.5 885.6 L447.6 891 L453.4 902.1 L456.1 907.9 L461 919.8 L463.3 925.9 L467.3 938.5 L470.6 951.3 L472 957.9 L474.3 971.1 L475.9 984.5 L476.4 991.3 L477 1006.5 L477 1038",
  "M443.1 1240.6 L436.6 1250.2 L433.2 1254.8 L426.4 1263.4 L416 1275.1 L409 1282.1 L402.1 1288.5 L395.3 1294.5 L388.6 1299.9 L376 1309.5 L367.3 1315.7 L339.4 1334.4",
  "M434.2 1573 L439.6 1583.2 L444.4 1593.9 L446.7 1599.4 L448.8 1605.1 L450.8 1610.8 L454.3 1622.4 L457.2 1634.3 L458.4 1640.4 L460.5 1652.6 L461.9 1665 L462.4 1671.2 L463 1688.8 L463 1720",
];

/**
 * One path stroked four times at falling widths — steel 247 wall, charcoal 240 verge,
 * paper 218 track limits, track 210 asphalt. It leads in from y −500 so the top of the
 * camera never shows an open end.
 */
export const TRACK_BAND =
  "M280 -500 L280 300 L280 420 C280 541.0 200 519.0 200 640 L200 760 C200 897.5 360 872.5 360 1010 L360 1120 C360 1241.0 210 1219.0 210 1340 L210 1460 C210 1586.5 346 1563.5 346 1690 L346 1800 C346 1899.0 280 1881.0 280 1980 L280 2420 L280 3020";

/** Starting slots: the grid box and two more up the escape road. */
export const GRID_SLOTS = [
  { d: "M250 290 L250 302 L272 302 M310 290 L310 302 L288 302", tone: "paper" },
  {
    d: "M302 120 L302 132 L324 132 M362 120 L362 132 L340 132",
    tone: "silver",
  },
  {
    d: "M198 -50 L198 -38 L220 -38 M258 -50 L258 -38 L236 -38",
    tone: "silver",
  },
];

/** Start line across the grid. */
export const START_LINE = { x: 175, y: 310, width: 210, height: 5 };

/** Chequered flag at the finish, two rows of ten. */
export const CHEQUER = [
  { x: 175, y: 2420, width: 10.5, height: 10.5 },
  { x: 196, y: 2420, width: 10.5, height: 10.5 },
  { x: 217, y: 2420, width: 10.5, height: 10.5 },
  { x: 238, y: 2420, width: 10.5, height: 10.5 },
  { x: 259, y: 2420, width: 10.5, height: 10.5 },
  { x: 280, y: 2420, width: 10.5, height: 10.5 },
  { x: 301, y: 2420, width: 10.5, height: 10.5 },
  { x: 322, y: 2420, width: 10.5, height: 10.5 },
  { x: 343, y: 2420, width: 10.5, height: 10.5 },
  { x: 364, y: 2420, width: 10.5, height: 10.5 },
  { x: 185.5, y: 2430.5, width: 10.5, height: 10.5 },
  { x: 206.5, y: 2430.5, width: 10.5, height: 10.5 },
  { x: 227.5, y: 2430.5, width: 10.5, height: 10.5 },
  { x: 248.5, y: 2430.5, width: 10.5, height: 10.5 },
  { x: 269.5, y: 2430.5, width: 10.5, height: 10.5 },
  { x: 290.5, y: 2430.5, width: 10.5, height: 10.5 },
  { x: 311.5, y: 2430.5, width: 10.5, height: 10.5 },
  { x: 332.5, y: 2430.5, width: 10.5, height: 10.5 },
  { x: 353.5, y: 2430.5, width: 10.5, height: 10.5 },
  { x: 374.5, y: 2430.5, width: 10.5, height: 10.5 },
];

/** The racing line: the car's path, the rubber line under it and the red trail behind it. */
export const ROAD_PATH =
  "M280 300 C280 332.0 324 332.0 324 364 C324 530.0 156 530.0 156 696 L156 704 C156 885.0 404 885.0 404 1066 L404 1064 C404 1230.0 166 1230.0 166 1396 L166 1404 C166 1575.0 390 1575.0 390 1746 L390 1744 C390 1890.0 236 1890.0 236 2036 C236 2176.0 280 2176.0 280 2316 L280 2420";

/** The centreline: where the time and day boards and their checkpoint lines are placed. */
export const CENTER_PATH =
  "M280 300 L280 420 C280 541.0 200 519.0 200 640 L200 760 C200 897.5 360 872.5 360 1010 L360 1120 C360 1241.0 210 1219.0 210 1340 L210 1460 C210 1586.5 346 1563.5 346 1690 L346 1800 C346 1899.0 280 1881.0 280 1980 L280 2420";

export function samplePath(d, step = 1.5) {
  const points = [];
  let x = 0;
  let y = 0;

  for (const token of d.match(/[MLC][^MLC]*/g) ?? []) {
    const n = (token.slice(1).match(/-?\d*\.?\d+/g) ?? []).map(Number);

    if (token[0] === "M") {
      [x, y] = n;
      points.push(x, y);
      continue;
    }
    if (token[0] === "L") {
      [x, y] = n;
      points.push(x, y);
      continue;
    }

    // Cubic: subdivide finely enough that the chords are well under `step`.
    const [x1, y1, x2, y2, x3, y3] = n;
    const rough =
      Math.hypot(x1 - x, y1 - y) +
      Math.hypot(x2 - x1, y2 - y1) +
      Math.hypot(x3 - x2, y3 - y2);
    const parts = Math.max(2, Math.ceil(rough / step) * 2);
    for (let i = 1; i <= parts; i++) {
      const t = i / parts;
      const u = 1 - t;
      points.push(
        u * u * u * x +
          3 * u * u * t * x1 +
          3 * u * t * t * x2 +
          t * t * t * x3,
        u * u * u * y +
          3 * u * u * t * y1 +
          3 * u * t * t * y2 +
          t * t * t * y3,
      );
    }
    x = x3;
    y = y3;
  }

  // Cumulative length along the flattened polyline.
  const run = [0];
  for (let i = 2; i < points.length; i += 2)
    run.push(
      run[run.length - 1] +
        Math.hypot(points[i] - points[i - 2], points[i + 1] - points[i - 1]),
    );

  const length = run[run.length - 1];
  const count = Math.max(2, Math.round(length / step) + 1);
  const xs = new Float32Array(count);
  const ys = new Float32Array(count);

  for (let i = 0, seg = 0; i < count; i++) {
    const want = (i / (count - 1)) * length;
    while (seg < run.length - 2 && run[seg + 1] < want) seg++;
    const span = run[seg + 1] - run[seg] || 1;
    const f = (want - run[seg]) / span;
    xs[i] = points[seg * 2] + (points[seg * 2 + 2] - points[seg * 2]) * f;
    ys[i] =
      points[seg * 2 + 1] + (points[seg * 2 + 3] - points[seg * 2 + 1]) * f;
  }

  return { length, xs, ys };
}
