import { about, hosts } from "../../../content";

// Pit panels. The cut corner and the red tab mirror between the two cards, so
// the pair reads as one unit with the track between them.
const SIDE = {
  left: {
    card: "[clip-path:polygon(0_0,calc(100%_-_22px)_0,100%_22px,100%_100%,0_100%)] lg:[clip-path:polygon(0_0,calc(100%_-_26px)_0,100%_26px,100%_100%,0_100%)]",
    tab: "left-0",
  },
  right: {
    card: "[clip-path:polygon(22px_0,100%_0,100%_100%,0_100%,0_22px)] lg:[clip-path:polygon(26px_0,100%_0,100%_100%,0_100%,0_26px)]",
    tab: "right-0",
  },
};

export function HostCard({ card, side }) {
  const host = hosts.find((h) => h.id === card.hostId);
  if (!host) return null;

  const { card: shape, tab } = SIDE[side];

  return (
    <article
      data-ab-card
      data-side={side}
      // w-full + the stretching row keep the pair the same height whatever
      // length the two blurbs end up being.
      className={`relative flex w-full flex-col gap-3 bg-pit p-5 lg:gap-3.5 lg:p-[22px_24px] ${shape}`}
    >
      <span
        aria-hidden="true"
        className={`absolute top-0 block h-1 w-14 bg-red lg:w-16 ${tab}`}
      />

      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-steel">
        {card.tag}
      </span>

      {/* Logo beside the name on phones, stacked once the cards are paired. */}
      <div className="flex min-h-12 items-center gap-3.5 md:flex-col md:items-start lg:min-h-15">
        <img
          src={host.logo.src}
          alt={host.logo.alt}
          width={host.logo.width}
          height={host.logo.height}
          loading="lazy"
          className="block h-10 w-auto lg:h-13"
        />
        <h3 className="m-0 whitespace-nowrap font-heading text-[22px] font-black uppercase italic leading-none text-paper lg:text-[clamp(24px,2vw,30px)]">
          {host.name}
        </h3>
      </div>

      {card.blurb ? (
        <p className="m-0 text-xs font-medium leading-relaxed text-silver">
          {card.blurb}
        </p>
      ) : (
        <div className="flex min-h-12 items-center border-2 border-dashed border-track px-3 py-2.5 text-xs font-semibold text-steel">
          {about.todoBlurb(host.name)}
        </div>
      )}
    </article>
  );
}
