// Icons for the gallery section
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "square",
  strokeLinejoin: "miter",
  "aria-hidden": true,
};

export function ChevronLeft({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M15 4 7 12l8 8" />
    </svg>
  );
}

export function ChevronRight({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M9 4l8 8-8 8" />
    </svg>
  );
}

export function Expand({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M4 10V4h6M20 14v6h-6" />
      <path d="M4 4l6.5 6.5M20 20l-6.5-6.5" />
    </svg>
  );
}

export function Close({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}
