// button variants
const shells = {
  ghost: "border border-paper/70 bg-charcoal/55 text-paper",
  red: "bg-red text-paper",
  paper: "bg-paper text-charcoal",
  outline: "border border-paper text-paper",
};

const sweeps = {
  ghost: "bg-red origin-left scale-x-0 group-hover:scale-x-100",
  red: "bg-red-deep origin-left scale-x-0 group-hover:scale-x-100",
  paper: "bg-red origin-bottom scale-y-0 group-hover:scale-y-100",
  outline: "bg-red origin-left scale-x-0 group-hover:scale-x-100",
};

const nudges = {
  left: "group-hover:-translate-x-[3px]",
  right: "group-hover:translate-x-[3px]",
  up: "group-hover:-translate-y-[3px]",
  down: "group-hover:translate-y-[3px]",
  none: "",
};

export function IconButton({
  variant = "ghost",
  nudge = "none",
  size = 44,
  label,
  children,
  className = "",
  ...props
}) {
  return (
    <button
      type="button"
      aria-label={label}
      style={{ "--btn": `${size}px` }}
      className={`group relative grid h-(--btn) w-(--btn) shrink-0 place-items-center overflow-hidden ${shells[variant]} ${className}`}
      {...props}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-0 transition-transform duration-(--duration-base) ease-race ${sweeps[variant]}`}
      />
      <span
        className={`relative grid place-items-center transition-transform duration-(--duration-base) ease-race ${
          variant === "paper" ? "group-hover:text-paper" : ""
        } ${nudges[nudge]}`}
      >
        {children}
      </span>
    </button>
  );
}
