import { ReelTile } from "./ReelTile";

// Reel width
const WIDTHS = [520, 400, 460, 380, 500];

// Reel row height and scale
const ROW_VARS = [
  "[--row-h:210px] [--tile-scale:0.6] md:[--row-h:260px] md:[--tile-scale:0.78] lg:[--row-h:330px] lg:[--tile-scale:1]",
  "[--row-h:180px] [--tile-scale:0.55] md:[--row-h:230px] md:[--tile-scale:0.78] lg:[--row-h:290px] lg:[--tile-scale:1]",
];

// Fade width
const FADE = "[--fade:32px] md:[--fade:56px] lg:[--fade:80px]";

// Edge fade gradient for the left or right side of a reel
function EdgeFade({ side }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-y-0 z-10 w-(--fade) ${
        side === "left" ? "left-0" : "right-0"
      }`}
      style={{
        background: `linear-gradient(to ${side === "left" ? "right" : "left"}, var(--color-charcoal), transparent)`,
      }}
    />
  );
}

export function Reel({
  photos,
  offset,
  total,
  row,
  trackRef,
  reduced,
  onHold,
  onOpen,
}) {
  const tiles = (ghost) =>
    photos.map((photo, i) => (
      <ReelTile
        key={`${ghost ? "ghost" : "tile"}-${photo.src}`}
        photo={photo}
        number={offset + i + 1}
        total={total}
        width={WIDTHS[(i + row * 2) % WIDTHS.length]}
        eager={!ghost && row === 0 && i < 3}
        ghost={ghost}
        onOpen={onOpen}
      />
    ));

  return (
    <div
      data-g-row
      role="group"
      aria-label={`Gallery photos, row ${row + 1}`}
      className={`relative ${ROW_VARS[row]} ${FADE} ${
        reduced ? "" : "h-(--row-h) overflow-hidden"
      }`}
      onPointerEnter={(e) =>
        e.pointerType !== "touch" && onHold("pointer", true)
      }
      onPointerLeave={() => onHold("pointer", false)}
      onFocusCapture={() => onHold("focus", true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) onHold("focus", false);
      }}
    >
      <div
        ref={trackRef}
        className={
          reduced
            ? "flex flex-wrap gap-y-2.5"
            : "flex w-max will-change-transform"
        }
      >
        {tiles(false)}
        {!reduced && tiles(true)}
      </div>

      <EdgeFade side="left" />
      <EdgeFade side="right" />
    </div>
  );
}
