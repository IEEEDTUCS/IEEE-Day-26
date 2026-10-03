// F1Car.jsx — Enhanced wake trails + streamlines + drop shadow

export default function F1Car({ className = "" }) {
  return (
    <div
      id="f1-car-container"
      className={`relative select-none ${className}`}
      style={{ aspectRatio: "1024 / 571" }}
    >
      {/* ── Directional Drop Shadow ─────────────────── */}
      <div
        className="pointer-events-none absolute -bottom-[4%] left-[8%] right-[5%] h-[22%] rounded-full opacity-90 blur-lg"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(43,45,44,0.9) 0%, rgba(197,18,22,0.3) 40%, transparent 72%)",
          transform: "rotate(-3deg) translateY(6px)",
        }}
      />

      {/* ── Wake & Speed Trails (behind car, overflows right) ── */}
      <svg
        viewBox="0 0 1024 571"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="wake-crimson" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#C51216" stopOpacity="0" />
            <stop offset="25%"  stopColor="#C51216" stopOpacity="0.5" />
            <stop offset="65%"  stopColor="#C51216" stopOpacity="1" />

          </linearGradient>
          <linearGradient id="wake-charcoal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#2B2D2C" stopOpacity="0" />
            <stop offset="35%"  stopColor="#2B2D2C" stopOpacity="0.4" />
            <stop offset="80%"  stopColor="#2B2D2C" stopOpacity="0.7" />

          </linearGradient>
          <linearGradient id="wake-gray" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#D9D9D9" stopOpacity="0" />
            <stop offset="50%"  stopColor="#D9D9D9" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#D9D9D9" stopOpacity="0.65" />
          </linearGradient>
          <radialGradient id="rain-light-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#C51216" stopOpacity="1" />
            <stop offset="40%"  stopColor="#C51216" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#C51216" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ═══════════════════════════════════════════════
            ENHANCED WAKE STREAKS — denser, longer, more vivid
            Slope ≈ -0.4 (upper-right diagonal), tapered tips
            ═══════════════════════════════════════════════ */}
        <g id="speed-lines">
          {/* Cluster 1 — Rear Wing Upper Flap */}
          <line x1="840" y1="108" x2="1640" y2="-212" stroke="url(#wake-charcoal)" strokeWidth="4"  strokeLinecap="round" opacity="0.75" />
          <line x1="855" y1="120" x2="1700" y2="-208" stroke="url(#wake-crimson)"  strokeWidth="10" strokeLinecap="round" opacity="0.97" />
          <line x1="870" y1="133" x2="1680" y2="-179" stroke="url(#wake-gray)"     strokeWidth="3.5" strokeLinecap="round" opacity="0.55" />
          <line x1="888" y1="146" x2="1720" y2="-174" stroke="url(#wake-crimson)"  strokeWidth="13" strokeLinecap="round" opacity="0.95" />
          <line x1="900" y1="158" x2="1700" y2="-152" stroke="url(#wake-charcoal)" strokeWidth="5"  strokeLinecap="round" opacity="0.65" />

          {/* Cluster 2 — Rear Wing Lower Flap & Engine Cover */}
          <line x1="812" y1="188" x2="1650" y2="-132" stroke="url(#wake-charcoal)" strokeWidth="5.5" strokeLinecap="round" opacity="0.72" />
          <line x1="830" y1="202" x2="1700" y2="-118" stroke="url(#wake-crimson)"  strokeWidth="12" strokeLinecap="round" opacity="0.93" />
          <line x1="850" y1="216" x2="1680" y2="-88"  stroke="url(#wake-charcoal)" strokeWidth="4.5" strokeLinecap="round" opacity="0.68" />
          <line x1="866" y1="228" x2="1690" y2="-74"  stroke="url(#wake-gray)"     strokeWidth="3"  strokeLinecap="round" opacity="0.5" />
          <line x1="880" y1="240" x2="1720" y2="-60"  stroke="url(#wake-crimson)"  strokeWidth="7"  strokeLinecap="round" opacity="0.8" />

          {/* Cluster 3 — Rear Tire Top & Suspension */}
          <line x1="864" y1="254" x2="1680" y2="-46"  stroke="url(#wake-crimson)"  strokeWidth="14" strokeLinecap="round" opacity="0.95" />
          <line x1="882" y1="268" x2="1700" y2="-28"  stroke="url(#wake-charcoal)" strokeWidth="8"  strokeLinecap="round" opacity="0.82" />
          <line x1="900" y1="282" x2="1710" y2="-10"  stroke="url(#wake-crimson)"  strokeWidth="9"  strokeLinecap="round" opacity="0.88" />
          <line x1="875" y1="260" x2="1670" y2="-30"  stroke="url(#wake-gray)"     strokeWidth="2.5" strokeLinecap="round" opacity="0.45" />
          <line x1="918" y1="295" x2="1720" y2="6"    stroke="url(#wake-charcoal)" strokeWidth="4"  strokeLinecap="round" opacity="0.6" />

          {/* Cluster 4 — Diffuser & Underfloor Main Wake (thickest) */}
          <line x1="904" y1="318" x2="1720" y2="20"   stroke="url(#wake-crimson)"  strokeWidth="18" strokeLinecap="round" opacity="0.97" />
          <line x1="890" y1="336" x2="1710" y2="36"   stroke="url(#wake-charcoal)" strokeWidth="10" strokeLinecap="round" opacity="0.87" />
          <line x1="878" y1="352" x2="1700" y2="52"   stroke="url(#wake-crimson)"  strokeWidth="14" strokeLinecap="round" opacity="0.92" />
          <line x1="862" y1="368" x2="1680" y2="70"   stroke="url(#wake-charcoal)" strokeWidth="7"  strokeLinecap="round" opacity="0.72" />
          <line x1="896" y1="328" x2="1715" y2="30"   stroke="url(#wake-gray)"     strokeWidth="3.5" strokeLinecap="round" opacity="0.55" />
          <line x1="848" y1="380" x2="1660" y2="86"   stroke="url(#wake-crimson)"  strokeWidth="6"  strokeLinecap="round" opacity="0.7" />


        </g>

        {/* ── Rear rain-light LED */}
        <circle id="rear-glow-el" cx="892" cy="275" r="18" fill="url(#rain-light-glow)" />
        <circle cx="892" cy="275" r="3.5" fill="#ffffff" />
      </svg>

      {/* ── F1 Car Graphic ───────────────────────────────── */}
      <picture>
        <source srcSet="/images/f1-car.webp" type="image/webp" />
        <img
          src="/images/f1-car.png"
          alt="F1 Car — 3/4 front isometric view with DRS wing"
          className="relative z-10 block h-full w-full object-contain"
          style={{ filter: "drop-shadow(0 20px 32px rgba(43,45,44,0.45)) drop-shadow(0 4px 8px rgba(197,18,22,0.15))" }}
          draggable="false"
          loading="eager"
        />
      </picture>

      {/* ── Aero streamlines (over car) ─────────────── */}
      <svg
        viewBox="0 0 1024 571"
        className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <path
          d="M 110,480 C 170,510 260,530 420,538"
          fill="none" stroke="#C51216" strokeWidth="2"
          strokeLinecap="round" opacity="0.65" strokeDasharray="8 12"
        />
        <path
          d="M 485,275 C 530,260 590,265 670,295"
          fill="none" stroke="#D9D9D9" strokeWidth="1.5"
          strokeLinecap="round" opacity="0.55"
        />
      </svg>
    </div>
  );
}
