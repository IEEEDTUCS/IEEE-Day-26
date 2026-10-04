const LETTERING = {
  fontFamily: "var(--font-heading)",
  fontStyle: "italic",
  fontWeight: 900,
  fontSize: "4.6px",
  letterSpacing: "0.04em",
  fill: "var(--color-paper)",
};

export function TrackCar() {
  return (
    <g transform="scale(1.15)">
      <g data-streaks opacity="0">
        <rect
          x="-232"
          y="-21"
          width="92"
          height="2"
          fill="var(--color-paper)"
        />
        <rect x="-262" y="-1" width="130" height="2" fill="var(--color-red)" />
        <rect x="-226" y="19" width="86" height="2" fill="var(--color-paper)" />
        <rect
          x="-196"
          y="-11"
          width="60"
          height="1.4"
          fill="var(--color-steel)"
        />
        <rect
          x="-204"
          y="9.6"
          width="66"
          height="1.4"
          fill="var(--color-steel)"
        />
      </g>
      <g
        fill="none"
        stroke="var(--color-pit-deep)"
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <path d="M-17 -4 L-22 -16 L-30 -5 M-17 4 L-22 16 L-30 5" />
        <path d="M-96 -5 L-101 -14 L-108 -4 M-96 5 L-101 14 L-108 4" />
      </g>
      <path
        d="M-110 -9 L-96 -18 L-44 -19 L-36 -12 L-36 12 L-44 19 L-96 18 L-110 9 Z"
        fill="var(--color-pit-deep)"
      />
      <path
        d="M-50 -18.6 L-40 -16 M-50 18.6 L-40 16"
        stroke="var(--color-paper)"
        strokeWidth="0.8"
      />
      <g>
        <rect
          x="-109"
          y="-22"
          width="16"
          height="9"
          rx="2"
          fill="var(--color-pit-deep)"
        />
        <rect
          x="-109"
          y="13"
          width="16"
          height="9"
          rx="2"
          fill="var(--color-pit-deep)"
        />
        <rect
          x="-109"
          y="-22"
          width="16"
          height="1.6"
          fill="var(--color-charcoal)"
        />
        <rect
          x="-109"
          y="20.4"
          width="16"
          height="1.6"
          fill="var(--color-charcoal)"
        />
        <rect
          x="-109"
          y="-14.6"
          width="16"
          height="1.6"
          fill="var(--color-charcoal)"
        />
        <rect
          x="-109"
          y="13"
          width="16"
          height="1.6"
          fill="var(--color-charcoal)"
        />
      </g>
      <path
        d="M-112 -4.2 L-100 -6 L-92 -10 L-84 -14.5 L-74 -16 L-64 -16 L-59 -13 L-55 -8.2 L-46 -7.2 L-34 -6.4 L-24 -5 L-14 -3.6 L-6 -2.4 L-1 -1.4 L0 0 L-1 1.4 L-6 2.4 L-14 3.6 L-24 5 L-34 6.4 L-46 7.2 L-55 8.2 L-59 13 L-64 16 L-74 16 L-84 14.5 L-92 10 L-100 6 L-112 4.2 Z"
        fill="var(--color-red)"
      />
      <path
        d="M-90 -10.6 L-78 -14.8 L-74 -14.8 L-87 -10.2 Z M-90 10.6 L-78 14.8 L-74 14.8 L-87 10.2 Z"
        fill="var(--color-paper)"
      />
      <path
        d="M-60 -14.6 L-58.5 -9.6 L-60.5 -9.6 Z M-60 14.6 L-58.5 9.6 L-60.5 9.6 Z"
        fill="var(--color-pit-deep)"
      />
      <rect
        x="-61"
        y="-14.4"
        width="3.2"
        height="4.4"
        fill="var(--color-pit-deep)"
      />
      <rect
        x="-61"
        y="10"
        width="3.2"
        height="4.4"
        fill="var(--color-pit-deep)"
      />
      <rect
        x="-51"
        y="-12.6"
        width="3.4"
        height="2.4"
        fill="var(--color-charcoal)"
      />
      <rect
        x="-51"
        y="10.2"
        width="3.4"
        height="2.4"
        fill="var(--color-charcoal)"
      />
      <path
        d="M-49.5 -10.2 L-49.5 -7 M-49.5 10.2 L-49.5 7"
        stroke="var(--color-charcoal)"
        strokeWidth="0.8"
      />
      <path
        d="M-104 0 L-66 0"
        stroke="var(--color-red-deep)"
        strokeWidth="2.2"
      />
      <text x="-97" y="-6.2" style={LETTERING}>
        IEEE
      </text>
      <text x="-97" y="8.4" style={LETTERING}>
        IEEE
      </text>
      <path d="M-66 -3 L-58 -3 L-58 3 L-66 3 Z" fill="var(--color-pit-deep)" />
      <path
        d="M-58 -4.6 L-44 -4.6 L-41.5 0 L-44 4.6 L-58 4.6 Z"
        fill="var(--color-pit-deep)"
      />
      <circle cx="-51.5" cy="0" r="3.4" fill="var(--color-paper)" />
      <path
        d="M-49.6 -2.4 A3.4 3.4 0 0 1 -49.6 2.4"
        fill="none"
        stroke="var(--color-charcoal)"
        strokeWidth="1.6"
      />
      <path
        d="M-58 -5.4 C-51 -6.4 -44.5 -4.6 -44 0 C-44.5 4.6 -51 6.4 -58 5.4 M-44 0 L-39 0"
        fill="none"
        stroke="var(--color-charcoal)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <g data-steer="-1" transform="rotate(0 -22 -17.5)">
        <rect
          x="-30"
          y="-22"
          width="16"
          height="7"
          rx="1.8"
          fill="var(--color-pit-deep)"
        />
        <rect
          x="-30"
          y="-22"
          width="16"
          height="1.2"
          fill="var(--color-charcoal)"
        />
        <rect
          x="-30"
          y="-16.2"
          width="16"
          height="1.2"
          fill="var(--color-charcoal)"
        />
      </g>
      <g data-steer="1" transform="rotate(0 -22 17.5)">
        <rect
          x="-30"
          y="15"
          width="16"
          height="7"
          rx="1.8"
          fill="var(--color-pit-deep)"
        />
        <rect
          x="-30"
          y="15"
          width="16"
          height="1.2"
          fill="var(--color-charcoal)"
        />
        <rect
          x="-30"
          y="20.8"
          width="16"
          height="1.2"
          fill="var(--color-charcoal)"
        />
      </g>
      <path
        d="M-11 -21.4 L-3 -21.4 L0.4 -14 L1.8 -5 L1.8 5 L0.4 14 L-3 21.4 L-11 21.4 L-8.6 14 L-6.4 5 L-6.4 -5 L-8.6 -14 Z"
        fill="var(--color-charcoal)"
      />
      <path
        d="M-6 -20.6 L-3.2 -13.6 L-2 -5 L-2 5 L-3.2 13.6 L-6 20.6"
        fill="none"
        stroke="var(--color-paper)"
        strokeWidth="0.7"
      />
      <path
        d="M-9 -20.6 L-6.8 -13.8 L-5 -5"
        fill="none"
        stroke="var(--color-track)"
        strokeWidth="0.7"
      />
      <path
        d="M-9 20.6 L-6.8 13.8 L-5 5"
        fill="none"
        stroke="var(--color-track)"
        strokeWidth="0.7"
      />
      <rect x="-12" y="-22.6" width="10" height="1.8" fill="var(--color-red)" />
      <rect x="-12" y="20.8" width="10" height="1.8" fill="var(--color-red)" />
      <path
        d="M-24 -5 L-6 -2.4 L0 0 L-6 2.4 L-24 5 Z"
        fill="var(--color-red)"
      />
      <path
        d="M-12 -0.6 L-1 -0.6 L-1 0.6 L-12 0.6 Z"
        fill="var(--color-paper)"
      />
      <path
        d="M-113 -6 L-104 -6 L-104 6 L-113 6 Z"
        fill="var(--color-pit-deep)"
      />
      <rect
        x="-124"
        y="-11.5"
        width="6.5"
        height="23"
        fill="var(--color-charcoal)"
      />
      <path
        d="M-120.6 -11 L-120.6 11"
        stroke="var(--color-paper)"
        strokeWidth="0.7"
      />
      <rect x="-125" y="-12.6" width="9" height="1.6" fill="var(--color-red)" />
      <rect x="-125" y="11" width="9" height="1.6" fill="var(--color-red)" />
      <rect
        x="-116"
        y="-1.4"
        width="5"
        height="2.8"
        fill="var(--color-charcoal)"
      />
      <rect
        x="-125.5"
        y="-1.2"
        width="1.8"
        height="2.4"
        fill="var(--color-red-deep)"
      />
      <rect
        data-ers
        x="-126.5"
        y="-1.6"
        width="2.8"
        height="3.2"
        fill="var(--color-red-bright)"
        opacity="0.2"
      />
    </g>
  );
}
