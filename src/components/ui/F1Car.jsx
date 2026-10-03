// F1Car.jsx — F1 Car Graphic component matching Concise Asset Spec
// Features wake trails, directional ground shadow, and 3/4 front isometric F1 Car graphic with DRS rear wing.

export default function F1Car({ className = "" }) {
  return (
    <div
      id="f1-car-container"
      className={`relative select-none ${className}`}
      style={{ aspectRatio: "1024 / 571" }}
    >
      {/* ── 5. Directional Drop Shadow under Chassis & Tires ───── */}
      <div
        className="pointer-events-none absolute -bottom-[4%] left-[8%] right-[5%] h-[20%] rounded-full opacity-70 blur-md"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(43,45,44,0.85) 0%, rgba(197,18,22,0.25) 40%, transparent 75%)",
          transform: "rotate(-3deg) translateY(4px)",
        }}
      />

      {/* ── 4. Speed & Wake Effects (Trailing strokes toward top-right) ── */}
      <svg
        viewBox="0 0 1024 571"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          {/* Alternating Crimson #C51216 wake stroke */}
          <linearGradient id="wake-crimson" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#C51216" stopOpacity="0" />
            <stop offset="35%" stopColor="#C51216" stopOpacity="0.4" />
            <stop offset="75%" stopColor="#C51216" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#C51216" stopOpacity="1" />
          </linearGradient>

          {/* Alternating Charcoal #2B2D2C wake stroke */}
          <linearGradient id="wake-charcoal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2B2D2C" stopOpacity="0" />
            <stop offset="40%" stopColor="#2B2D2C" stopOpacity="0.35" />
            <stop offset="80%" stopColor="#2B2D2C" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#2B2D2C" stopOpacity="0.9" />
          </linearGradient>

          {/* Light Gray #D9D9D9 contour stroke */}
          <linearGradient id="wake-gray" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#D9D9D9" stopOpacity="0" />
            <stop offset="50%" stopColor="#D9D9D9" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#D9D9D9" stopOpacity="0.65" />
          </linearGradient>

          {/* Rear rain light LED glow */}
          <radialGradient id="rain-light-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C51216" stopOpacity="1" />
            <stop offset="40%" stopColor="#C51216" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#C51216" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ══════════════════════════════════════════════════════════
            HORIZONTAL & DIAGONAL TRAILING WAKE STROKES
            Flowing from rear wing & diffuser toward top-right
            Alternating Crimson (#C51216) & Charcoal (#2B2D2C)
            with tapered, blunt ends (strokeLinecap="round")
            ══════════════════════════════════════════════════════════ */}
        <g id="speed-lines">
          {/* Cluster 1: Rear Wing Upper Flap */}
          <line x1="840" y1="115" x2="1550" y2="-169" stroke="url(#wake-charcoal)" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
          <line x1="855" y1="127" x2="1580" y2="-165" stroke="url(#wake-crimson)" strokeWidth="9" strokeLinecap="round" opacity="0.95" />
          <line x1="870" y1="140" x2="1560" y2="-136" stroke="url(#wake-gray)" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
          <line x1="890" y1="153" x2="1600" y2="-131" stroke="url(#wake-crimson)" strokeWidth="11" strokeLinecap="round" opacity="0.95" />

          {/* Cluster 2: Rear Wing Lower Flap & Engine Cover */}
          <line x1="810" y1="192" x2="1560" y2="-108" stroke="url(#wake-charcoal)" strokeWidth="6" strokeLinecap="round" opacity="0.75" />
          <line x1="830" y1="205" x2="1590" y2="-99" stroke="url(#wake-crimson)" strokeWidth="10" strokeLinecap="round" opacity="0.9" />
          <line x1="848" y1="218" x2="1570" y2="-70" stroke="url(#wake-charcoal)" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
          <line x1="865" y1="230" x2="1580" y2="-56" stroke="url(#wake-gray)" strokeWidth="3.5" strokeLinecap="round" opacity="0.55" />

          {/* Cluster 3: Rear Tire Top & Suspension */}
          <line x1="865" y1="258" x2="1570" y2="-24" stroke="url(#wake-crimson)" strokeWidth="11" strokeLinecap="round" opacity="0.92" />
          <line x1="882" y1="272" x2="1580" y2="-7" stroke="url(#wake-charcoal)" strokeWidth="7" strokeLinecap="round" opacity="0.8" />
          <line x1="900" y1="285" x2="1590" y2="9" stroke="url(#wake-crimson)" strokeWidth="8" strokeLinecap="round" opacity="0.85" />
          <line x1="875" y1="265" x2="1565" y2="-11" stroke="url(#wake-gray)" strokeWidth="3" strokeLinecap="round" opacity="0.5" />

          {/* Cluster 4: Diffuser & Underfloor Main Wake */}
          <line x1="905" y1="322" x2="1600" y2="44" stroke="url(#wake-crimson)" strokeWidth="15" strokeLinecap="round" opacity="0.95" />
          <line x1="890" y1="340" x2="1590" y2="60" stroke="url(#wake-charcoal)" strokeWidth="9" strokeLinecap="round" opacity="0.85" />
          <line x1="878" y1="355" x2="1580" y2="74" stroke="url(#wake-crimson)" strokeWidth="12" strokeLinecap="round" opacity="0.9" />
          <line x1="862" y1="370" x2="1560" y2="91" stroke="url(#wake-charcoal)" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
          <line x1="895" y1="332" x2="1595" y2="52" stroke="url(#wake-gray)" strokeWidth="4" strokeLinecap="round" opacity="0.6" />

          {/* Cluster 5: Lower Ground-Effect Streamers */}
          <line x1="870" y1="408" x2="1550" y2="136" stroke="url(#wake-crimson)" strokeWidth="9" strokeLinecap="round" opacity="0.85" />
          <line x1="852" y1="428" x2="1540" y2="153" stroke="url(#wake-charcoal)" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
          <line x1="836" y1="448" x2="1520" y2="174" stroke="url(#wake-crimson)" strokeWidth="8" strokeLinecap="round" opacity="0.78" />
          <line x1="820" y1="465" x2="1500" y2="193" stroke="url(#wake-charcoal)" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
        </g>

        {/* ── Rear Crash Structure LED Light ── */}
        <circle id="rear-glow-el" cx="892" cy="275" r="16" fill="url(#rain-light-glow)" />
        <circle cx="892" cy="275" r="3.5" fill="#ffffff" />
      </svg>

      {/* ── 6. F1 Car Graphic (3/4 Front Isometric View with DRS) ── */}
      <picture>
        <source srcSet="/images/f1-car.webp" type="image/webp" />
        <img
          src="/images/f1-car.png"
          alt="F1 Car Graphic — 3/4 Front Isometric View with DRS Wing"
          className="relative z-10 block h-full w-full object-contain filter drop-shadow-[0_18px_28px_rgba(43,45,44,0.4)] transition-transform duration-500 ease-out"
          draggable="false"
          loading="eager"
        />
      </picture>

      {/* ── Dynamic Aero Airflow Streamlines ── */}
      <svg
        viewBox="0 0 1024 571"
        className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        {/* Front wing ground suction streak */}
        <path
          d="M 110,480 C 170,510 260,530 420,538"
          fill="none"
          stroke="#C51216"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
          strokeDasharray="8 12"
        />
        {/* Curved Halo airflow guide */}
        <path
          d="M 485,275 C 530,260 590,265 670,295"
          fill="none"
          stroke="#D9D9D9"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}

