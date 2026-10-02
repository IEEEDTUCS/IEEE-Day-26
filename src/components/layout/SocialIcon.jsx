export function SocialIcon({ name, size = 15 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (name === "Instagram") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r=".7" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (name === "LinkedIn") {
    return (
      <span aria-hidden="true" className="text-[10px] font-bold leading-none">
        in
      </span>
    );
  }

  return (
    <svg {...common}>
      <path
        d="M14 8h3V4h-3c-3.3 0-5 2-5 5v3H6v4h3v8h4v-8h3l1-4h-4V9c0-.7.3-1 1-1Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}
