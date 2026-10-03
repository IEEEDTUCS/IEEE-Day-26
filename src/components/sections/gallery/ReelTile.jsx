import { Expand } from "./Icons";

// Tilt
const SLANT = 30;

const SPACING = 14 - 16;

const CLIP = `polygon(${SLANT}px 0, 100% 0, calc(100% - ${SLANT}px) 100%, 0 100%)`;

// Reel tile component
export function ReelTile({
  photo,
  number,
  total,
  width,
  eager = false,
  ghost = false,
  onOpen,
}) {
  return (
    <button
      type="button"
      tabIndex={ghost ? -1 : undefined}
      aria-hidden={ghost || undefined}
      aria-label={
        ghost
          ? undefined
          : `Open photo ${String(number).padStart(2, "0")} of ${total}`
      }
      onClick={(event) => onOpen(number - 1, event.currentTarget)}
      style={{
        width: `calc(${width}px * var(--tile-scale))`,
        height: "var(--row-h)",
        marginRight: SPACING,
        clipPath: CLIP,
      }}
      className="group relative block shrink-0 overflow-hidden bg-pit-deep outline-none"
    >
      <img
        src={photo.reel}
        alt={ghost ? "" : photo.alt}
        width={photo.width}
        height={photo.height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={eager ? "high" : undefined}
        style={{ objectPosition: photo.focal }}
        className="h-full w-full object-cover saturate-[0.85] transition-[transform,filter] duration-900 ease-race group-hover:scale-[1.06] group-hover:saturate-100 group-focus-visible:scale-[1.06] group-focus-visible:saturate-100"
      />

      {/* Expand affordance, revealed on hover or focus. Inset past the slant so
          it never hangs off the lean. */}
      <span
        aria-hidden="true"
        className="absolute top-[14px] grid h-9 w-9 place-items-center bg-paper text-charcoal opacity-0 transition-opacity duration-(--duration-base) ease-race group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{ right: SLANT + 10 }}
      >
        <Expand size={14} />
      </span>

      {/* Focus ring, drawn over the photo — an inset shadow would paint under
          the image and never be seen. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[3px] border-red opacity-0 group-focus-visible:opacity-100"
      />

      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-bar origin-left scale-x-0 bg-red transition-transform duration-450 ease-race group-hover:scale-x-100 group-focus-visible:scale-x-100"
      />
    </button>
  );
}
