/**
 * One event card in the orbit — follows the design system's Event card spec
 * (docs/DESIGN_SYSTEM.md §5): paper tile, left red accent bar, number + type
 * tag in the header, Montserrat 700 title, meta row with the Register link.
 * Hover: accent bar extends full height and the card lane-changes 2px right.
 *
 * Structure: the outer div carries the ring placement transform (its value is
 * constant — never make it dynamic or React will rewrite it over GSAP's live
 * rotation). A transparent full-card button opens the dossier; the Register
 * link sits above it so both stay clickable and tabbable.
 */
export function EventCard({ event, index, isFront, onFocus, onSelect }) {
  const number = String(event.number).padStart(2, "0");

  return (
    <div
      data-orbit-card
      className="group absolute inset-0"
      style={{
        transform:
          "rotateY(calc(var(--i) * (360deg / var(--n)))) translateZ(var(--radius))",
        backfaceVisibility: "hidden",
        "--i": index + 1,
      }}
    >
      {/* Visual card */}
      <div
        className={`relative flex h-full w-full flex-col overflow-hidden border-2 bg-paper transition-[transform,border-color] duration-(--duration-fast) ease-race group-hover:translate-x-[2px] group-focus-within:translate-x-[2px] ${
          isFront ? "border-red" : "border-charcoal"
        }`}
      >
        {/* Left accent bar — extends to full height on hover/focus */}
        <span
          aria-hidden="true"
          className={`absolute left-0 top-0 z-10 w-1.5 bg-red transition-[height] duration-(--duration-fast) ease-race ${
            isFront
              ? "h-full"
              : "h-[38%] group-hover:h-full group-focus-within:h-full"
          }`}
        />

        {/* Header: number + type tag */}
        <span className="flex items-start justify-between gap-2 border-b border-charcoal/15 px-3.5 pb-2.5 pl-5 pt-3">
          <span className="text-[13px] font-bold leading-none tabular text-red">
            #{number}
          </span>
          <span
            className={`px-2 py-1 text-[9px] font-bold uppercase leading-tight tracking-[0.16em] ${
              event.featured ? "bg-red text-paper" : "bg-silver text-charcoal"
            }`}
          >
            {event.tag}
          </span>
        </span>

        {/* Body: title + tagline, left-aligned */}
        <span className="flex flex-1 flex-col justify-center gap-2 px-3.5 pl-5">
          <span className="text-[19px] font-bold leading-[1.1] text-charcoal sm:text-[21px]">
            {event.title}
          </span>
          <span className="text-[11px] font-medium leading-snug text-charcoal/70">
            {event.tagline}
          </span>
        </span>

        {/* Meta row + Register */}
        <span className="flex items-center justify-between gap-2 border-t border-charcoal/15 px-3.5 pb-3 pl-5 pt-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-charcoal/70">
            {event.dateLabel} · {event.teamLabel}
          </span>
          <a
            href={event.register}
            target="_blank"
            rel="noreferrer"
            onFocus={onFocus}
            aria-label={`Register for ${event.title} on Unstop (opens in a new tab)`}
            className="relative z-20 inline-flex items-center gap-1 bg-red px-2.5 py-1.5 text-[9px] font-bold uppercase leading-none tracking-[0.14em] text-paper transition-colors duration-(--duration-fast) hover:bg-red-deep"
          >
            Register ↗
          </a>
        </span>
      </div>

      {/* Transparent dossier opener — sits over the visuals, under the link */}
      <button
        type="button"
        onFocus={onFocus}
        onClick={() => onSelect(event)}
        aria-label={`Open event dossier for ${event.title}`}
        className="absolute inset-0 z-10 cursor-pointer"
      />
    </div>
  );
}
