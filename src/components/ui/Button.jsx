// Fixed button component to reuse

// base style is automatically applied to all buttons
const base =
  "group inline-flex items-center gap-2 px-7 py-3.5 text-label font-semibold uppercase tracking-button leading-none transition-colors duration-(--duration-fast)";

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
  href,
  trailing,
  // Which way `trailing` nudges when it is a node rather than one of the
  // arrow characters above.
  trailingDirection = "→",
  children,
  className = "",
  ...props //Extra props
}) {
  const classes = `${base} ${variants[variant]} ${className}`;
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
