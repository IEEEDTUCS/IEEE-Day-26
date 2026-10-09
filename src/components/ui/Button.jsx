// Fixed button component to reuse

// base style is automatically applied to all buttons
const base =
  "group items-center gap-2 font-semibold uppercase leading-none transition-colors duration-(--duration-fast)";

// size variants
const sizes = {
  default: "px-7 py-3.5 text-label tracking-button",
  nav: "px-2.5 py-1.5 text-[11px] tracking-wider sm:px-3.5 sm:py-2 sm:text-xs lg:px-7 lg:py-3.5 lg:text-label lg:tracking-button",
  sm: "px-3.5 py-2 text-xs tracking-button",
};

// Varients can be applied through props : variant
const variants = {
  primary: "bg-red text-paper hover:bg-red-deep",
  secondary:
    "bg-charcoal text-paper hover:bg-[color-mix(in_srgb,var(--color-charcoal)_88%,var(--color-paper))]",
  ghost:
    "border-[1.5px] border-paper text-paper hover:bg-paper hover:text-charcoal",
  // Outline variant of button
  outline: [
    "relative isolate min-h-[52px] overflow-hidden border-2 border-paper text-paper",
    "hover:border-red focus-visible:border-red",
    "before:absolute before:-inset-[2px] before:origin-left before:scale-x-0 before:bg-red before:content-['']",
    "before:transition-transform before:duration-(--duration-base) before:ease-race",
    "hover:before:scale-x-100 focus-visible:before:scale-x-100",
  ].join(" "),
};

// nudge directions
const nudge = {
  "↗": "group-hover:-translate-y-[3px] group-hover:translate-x-[3px]",
  "→": "group-hover:translate-x-[3px]",
  "↓": "group-hover:translate-y-[3px]",
};

export function Button({
  variant = "primary",
  size = "default",
  href,
  trailing,
  // Which way `trailing` nudges when it is a node rather than one of the
  // arrow characters above.
  trailingDirection = "→",
  children,
  className = "",
  ...props //Extra props
}) {
  const hasDisplayOverride = /\b(hidden|block|flex|inline-block|grid)\b/.test(className);
  const displayClass = hasDisplayOverride ? "" : "inline-flex";
  const sizeClasses = sizes[size] ?? sizes.default;
  const classes = `${base} ${displayClass} ${sizeClasses} ${variants[variant]} ${className}`.trim().replace(/\s+/g, " ");
  const direction = typeof trailing === "string" ? trailing : trailingDirection;

  const inner = (
    <>
      {children}
      {trailing && (
        <span
          aria-hidden="true"
          className={`flex transition-transform duration-(--duration-fast) ${
            nudge[direction] ?? ""
          }`}
        >
          {trailing}
        </span>
      )}
    </>
  );

  // Only `outline` paints behind its own label, so only it needs the lift.
  const content =
    variant === "outline" ? (
      <span className="relative z-10 flex items-center gap-2">{inner}</span>
    ) : (
      inner
    );

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  );
}
