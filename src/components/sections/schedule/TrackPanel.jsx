import { SectorBar } from "./SectorBar";
import { TrackView } from "./TrackView";

function RaceReadout({ total }) {
  return (
    <div
      data-rd
      aria-hidden="true"
      className="hidden min-h-23 flex-none items-stretch border-t border-track bg-pit lg:flex"
    >
      <p
        data-rd-pos
        className="tabular m-0 flex w-32 flex-none items-baseline justify-center gap-0.5 bg-red pl-4.5 pr-6 pt-5.5 font-bold leading-[0.9] text-paper [clip-path:polygon(0_0,100%_0,calc(100%-18px)_100%,0_100%)] data-[next]:bg-track"
      >
        <b data-rd-n className="text-[40px] font-bold">
          00
        </b>
        <span className="text-[17px]">/{String(total).padStart(2, "0")}</span>
      </p>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 py-4 pl-3.5 pr-6.5">
        <p className="m-0 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-steel">
          <span data-rd-time className="tabular tracking-[0.08em] text-paper">
            —
          </span>
          <span data-rd-tag>—</span>
        </p>
        <p
          data-rd-title
          className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-[21px] font-bold uppercase leading-[1.1] tracking-[0.01em] text-paper"
        >
          —
        </p>
      </div>
    </div>
  );
}

export function TrackPanel({ days, events, onJump, showTrack }) {
  return (
    <aside
      data-trk
      className="sticky top-[var(--nav-height)] z-[5] col-span-full -mx-4 flex flex-col bg-charcoal text-paper lg:top-[calc(var(--nav-height)+24px)] lg:z-[1] lg:col-span-1 lg:col-start-1 lg:mx-0 lg:h-[min(800px,calc(100svh-var(--nav-height)-48px))] lg:min-h-150 lg:overflow-hidden lg:[clip-path:polygon(0_0,calc(100%-44px)_0,100%_44px,100%_100%,0_100%)]"
    >
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 z-[2] block h-1 w-16 bg-red lg:h-[5px] lg:w-24"
      />
      <SectorBar days={days} onJump={onJump} />
      {showTrack && <TrackView days={days} events={events} />}
      <RaceReadout total={events.length} />
    </aside>
  );
}
