// F1Car.jsx — Exact F1 Car model matching the user's reference illustration
// Layered with aerodynamic flow lines, rear rain light pulse, ground-effect shadow, and speed drag lines.
// Fully animated via GSAP in Hero.jsx
// Drag lines follow strict slope dy/dx = -0.4 (same as car trajectory)

export function F1Car({ className = "" }) {
  return (
    <div
      id="f1-car-container"
      className={`relative select-none ${className}`}
      style={{ aspectRatio: "1024 / 571" }}
    >
      {/* ── Ground shadow & red diffuser underglow ───────────── */}
      <div
        className="pointer-events-none absolute -bottom-[4%] left-[6%] right-[4%] h-[18%] rounded-full opacity-65 blur-lg"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(197,18,22,0.32) 0%, rgba(26,28,27,0.7) 45%, transparent 75%)",
        }}
      />

      {/* ── Aerodynamic Speed Lines & Vortex SVG (Behind Car) ─── */}
      <svg
        viewBox="0 0 1024 571"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          {/* PRIMARY red drag streak — bright at car end, fades out */}
          <linearGradient id="aero-drag-red" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#c51216" stopOpacity="0" />
            <stop offset="30%" stopColor="#c51216" stopOpacity="0.25" />
            <stop offset="65%" stopColor="#ff2228" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ff2228" stopOpacity="0.95" />
          </linearGradient>
          {/* Dark carbon streak */}
          <linearGradient id="aero-drag-dark" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1a1c1a" stopOpacity="0" />
            <stop offset="35%" stopColor="#2b2d2c" stopOpacity="0.2" />
            <stop offset="70%" stopColor="#7a7a7a" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#aaaaaa" stopOpacity="0.7" />
          </linearGradient>
          {/* White/silver highlight streak */}
          <linearGradient id="aero-drag-silver" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.45" />
          </linearGradient>
          {/* Rear LED rain light glow */}
          <radialGradient id="rain-light-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff2228" stopOpacity="1" />
            <stop offset="35%" stopColor="#c51216" stopOpacity="0.65" />
            <stop offset="70%" stopColor="#c51216" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#c51216" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ══════════════════════════════════════════════════════════
            TRAILING DRAG LINES — all slope dy/dx = -0.4
            Lines go from RIGHT (car rear ~x=820-920) outward to the RIGHT
            far beyond the car viewport (x2 up to ~1600+)
            Formula: y2 = y1 + (x2 - x1) * (-0.4)
            ══════════════════════════════════════════════════════════ */}
        <g id="speed-lines">
          {/* ─── CLUSTER 1: Rear Wing Top (y ≈ 115–165) ─── */}
          {/* Line: x1=840,y1=115 → x2=1550: y2=115+(1550-840)*(-0.4)=115-284=-169 */}
          <line
            x1="840"
            y1="115"
            x2="1550"
            y2="-169"
            stroke="url(#aero-drag-dark)"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.7"
          />
          {/* Line: x1=855,y1=127 → x2=1580: y2=127-292=-165 */}
          <line
            x1="855"
            y1="127"
            x2="1580"
            y2="-165"
            stroke="url(#aero-drag-red)"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.9"
          />
          {/* Line: x1=870,y1=140 → x2=1560: y2=140-276=-136 */}
          <line
            x1="870"
            y1="140"
            x2="1560"
            y2="-136"
            stroke="url(#aero-drag-dark)"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.65"
          />
          {/* Line: x1=890,y1="153" → x2=1600: y2=153-284=-131 */}
          <line
            x1="890"
            y1="153"
            x2="1600"
            y2="-131"
            stroke="url(#aero-drag-red)"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.95"
          />
          {/* Thin silver highlight */}
          <line
            x1="880"
            y1="145"
            x2="1590"
            y2="-133"
            stroke="url(#aero-drag-silver)"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.55"
          />

          {/* ─── CLUSTER 2: Rear Wing Lower / Engine Cover (y ≈ 190–235) ─── */}
          {/* x1=810,y1=192 → x2=1560: y2=192+(1560-810)*(-0.4)=192-300=-108 */}
          <line
            x1="810"
            y1="192"
            x2="1560"
            y2="-108"
            stroke="url(#aero-drag-dark)"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.65"
          />
          {/* x1=830,y1=205 → x2=1590: y2=205-304=-99 */}
          <line
            x1="830"
            y1="205"
            x2="1590"
            y2="-99"
            stroke="url(#aero-drag-red)"
            strokeWidth="9"
            strokeLinecap="round"
            opacity="0.9"
          />
          {/* x1=848,y1=218 → x2=1570: y2=218-288=-70 */}
          <line
            x1="848"
            y1="218"
            x2="1570"
            y2="-70"
            stroke="url(#aero-drag-dark)"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.6"
          />
          {/* x1=865,y1=230 → x2=1580: y2=230-286=-56 */}
          <line
            x1="865"
            y1="230"
            x2="1580"
            y2="-56"
            stroke="url(#aero-drag-silver)"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.5"
          />

          {/* ─── CLUSTER 3: Rear Tire Top / Suspension (y ≈ 255–295) ─── */}
          {/* x1=865,y1=258 → x2=1570: y2=258+(1570-865)*(-0.4)=258-282=-24 */}
          <line
            x1="865"
            y1="258"
            x2="1570"
            y2="-24"
            stroke="url(#aero-drag-red)"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.9"
          />
          {/* x1=882,y1=272 → x2=1580: y2=272-279.2≈-7 */}
          <line
            x1="882"
            y1="272"
            x2="1580"
            y2="-7"
            stroke="url(#aero-drag-dark)"
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.7"
          />
          {/* x1=900,y1=285 → x2=1590: y2=285-276=9 */}
          <line
            x1="900"
            y1="285"
            x2="1590"
            y2="9"
            stroke="url(#aero-drag-red)"
            strokeWidth="7"
            strokeLinecap="round"
            opacity="0.8"
          />
          {/* Silver highlight on tire top */}
          <line
            x1="875"
            y1="265"
            x2="1565"
            y2="-11"
            stroke="url(#aero-drag-silver)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.45"
          />

          {/* ─── CLUSTER 4: Rear Tire Mid / Diffuser Main Blast (y ≈ 320–380) ─── */}
          {/* This is the main diffuser zone — thickest, most prominent */}
          {/* x1=905,y1=322 → x2=1600: y2=322+(1600-905)*(-0.4)=322-278=44 */}
          <line
            x1="905"
            y1="322"
            x2="1600"
            y2="44"
            stroke="url(#aero-drag-red)"
            strokeWidth="14"
            strokeLinecap="round"
            opacity="0.95"
          />
          {/* x1=890,y1=340 → x2=1590: y2=340-280=60 */}
          <line
            x1="890"
            y1="340"
            x2="1590"
            y2="60"
            stroke="url(#aero-drag-dark)"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.8"
          />
          {/* x1=878,y1=355 → x2=1580: y2=355-280.8=74 */}
          <line
            x1="878"
            y1="355"
            x2="1580"
            y2="74"
            stroke="url(#aero-drag-red)"
            strokeWidth="11"
            strokeLinecap="round"
            opacity="0.88"
          />
          {/* x1=862,y1=370 → x2=1560: y2=370-279.2=91 */}
          <line
            x1="862"
            y1="370"
            x2="1560"
            y2="91"
            stroke="url(#aero-drag-dark)"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.65"
          />
          {/* Silver core of diffuser */}
          <line
            x1="895"
            y1="332"
            x2="1595"
            y2="52"
            stroke="url(#aero-drag-silver)"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.55"
          />

          {/* ─── CLUSTER 5: Floor / Underfloor Vortex (y ≈ 410–460) ─── */}
          {/* x1=870,y1=408 → x2=1550: y2=408+(1550-870)*(-0.4)=408-272=136 */}
          <line
            x1="870"
            y1="408"
            x2="1550"
            y2="136"
            stroke="url(#aero-drag-red)"
            strokeWidth="9"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* x1=852,y1=428 → x2=1540: y2=428-275.2=152.8 */}
          <line
            x1="852"
            y1="428"
            x2="1540"
            y2="153"
            stroke="url(#aero-drag-dark)"
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.7"
          />
          {/* x1=836,y1=448 → x2=1520: y2=448-273.6=174 */}
          <line
            x1="836"
            y1="448"
            x2="1520"
            y2="174"
            stroke="url(#aero-drag-red)"
            strokeWidth="7"
            strokeLinecap="round"
            opacity="0.75"
          />
          {/* x1=820,y1=465 → x2=1500: y2=465-272=193 */}
          <line
            x1="820"
            y1="465"
            x2="1500"
            y2="193"
            stroke="url(#aero-drag-dark)"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.55"
          />
        </g>

        {/* ── Rear crash-structure flashing safety/rain LED ── */}
        <circle
          id="rear-glow-el"
          cx="892"
          cy="275"
          r="16"
          fill="url(#rain-light-glow)"
        />
        <circle cx="892" cy="275" r="3.5" fill="#ffffff" />
      </svg>

      {/* ── Exact F1 Car Image (Transparent Crisp High-Res Illustration) ── */}
      <picture>
        <source srcSet="/images/f1-car.webp" type="image/webp" />
        <img
          src="/images/f1-car.png"
          alt="Formula 1 Racing Car — IEEE Day 2026 Edition"
          className="relative z-10 block h-full w-full object-contain filter drop-shadow-[0_18px_28px_rgba(43,45,44,0.38)] transition-transform duration-500 ease-out"
          draggable="false"
          loading="eager"
        />
      </picture>

      {/* ── Dynamic Foreground Aero Sparks & Streamlines (In front of Car) ── */}
      <svg
        viewBox="0 0 1024 571"
        className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        {/* Front wing ground suction streak */}
        <path
          d="M 110,480 C 170,510 260,530 420,538"
          fill="none"
          stroke="#c51216"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
          strokeDasharray="8 12"
        />

        {/* Halo airflow arc */}
        <path
          d="M 485,275 C 530,260 590,265 670,295"
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
