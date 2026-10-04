const CHEVRONS = ["bg-track", "bg-steel", "bg-red"];
const CHEVRON_CLIP =
  "[clip-path:polygon(0_0,45%_0,100%_50%,45%_100%,0_100%,55%_50%)]";

function MetaCell({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5 lg:gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] lg:text-[11px] lg:tracking-[0.26em]">
        {label}
      </span>
      <span className="tabular text-[15px] font-bold [transition:color_0s_0.12s] lg:text-[clamp(15px,1.25vw,18px)]">
        {value}
      </span>
    </div>
  );
}

export function ScheduleRow({ event, index }) {
  // Digits roll in one at a time, so the time is split per character.
  const digits = [...(event.start ? event.start.time : "TBA")];

  return (
    <article data-sch-row data-index={index} className="group/row relative">
      <span
        data-row-hl
        aria-hidden="true"
        className="absolute inset-x-0 -top-px bottom-0 block origin-left scale-x-0 bg-charcoal transition-transform duration-[450ms] ease-[var(--ease-race)] group-data-[live]/row:scale-x-100"
      />
      <span
        data-row-bar
        aria-hidden="true"
        className="absolute inset-y-0 left-0 z-[1] block w-1 origin-top scale-y-[0.3] bg-red transition-transform duration-[350ms] ease-[var(--ease-race)] group-hover/row:scale-y-100 group-data-[live]/row:scale-y-100 lg:w-[5px]"
      />

      {/* Three chevrons point at the live row from the panel. Wide layouts only. */}
      <span
        aria-hidden="true"
        className="absolute -left-[clamp(40px,3.47vw,50px)] top-1/2 hidden -translate-x-2 -translate-y-1/2 gap-0.5 opacity-0 transition-[opacity,transform] duration-[350ms] ease-[var(--ease-race)] group-data-[live]/row:translate-x-0 group-data-[live]/row:opacity-100 lg:flex"
      >
        {CHEVRONS.map((tone) => (
          <i
            key={tone}
            className={`block h-5 w-[11px] ${tone} ${CHEVRON_CLIP}`}
          />
        ))}
      </span>

      {/* Phone only: the checkpoint this row owns, sitting out on the mini track. */}
      <span
        data-row-cp
        aria-hidden="true"
        className="absolute -left-14 top-1/2 block h-0 w-11 lg:hidden"
      >
        <i
          data-cp-line
          className="absolute inset-x-[9px] -top-px block h-0.5 bg-steel transition-colors duration-200 group-data-[passed]/row:bg-red"
        />
      </span>

      <span
        data-row-rule
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 block h-px origin-left bg-silver"
      />
      <span
        data-row-wipe
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[3] block origin-left scale-x-0 bg-red"
      />

      <div
        data-row-in
        className="relative grid grid-cols-[minmax(0,1fr)] gap-y-1.5 py-[15px] pl-3.5 pr-2.5 [transition:transform_0.2s_var(--ease-race),color_0s_0.12s] group-hover/row:translate-x-0.5 group-data-[live]/row:text-paper lg:grid-cols-[clamp(120px,11.67vw,168px)_minmax(0,1fr)_clamp(104px,9.72vw,140px)] lg:gap-x-[clamp(18px,1.94vw,28px)] lg:gap-y-0 lg:py-[clamp(20px,1.81vw,26px)] lg:pl-[clamp(22px,2.36vw,34px)] lg:pr-[clamp(16px,1.67vw,24px)]"
      >
        <p className="m-0 flex flex-wrap items-baseline gap-x-1.5 gap-y-1.5 lg:mt-0.5 lg:gap-x-2">
          <span className="tabular inline-flex text-[24px] font-bold leading-none tracking-[-0.01em] transition-colors duration-[250ms] group-data-[live]/row:text-red-bright lg:text-[clamp(28px,2.5vw,36px)]">
            {digits.map((char, i) => (
              <span
                key={i}
                className="inline-block h-[1.05em] overflow-hidden align-bottom"
              >
                <span data-digit className="inline-block">
                  {char}
                </span>
              </span>
            ))}
          </span>

          {event.start ? (
            <span className="text-[11px] font-bold tracking-[0.12em] lg:text-[13px]">
              {event.start.ampm}
            </span>
          ) : (
            // Not a placeholder style choice: events.js genuinely has no start time yet.
            <span className="ml-1 w-max self-center whitespace-nowrap border-[1.5px] border-dashed border-red px-1 py-0.5 text-[8.5px] font-bold uppercase tracking-[0.1em] text-red group-data-[live]/row:border-red-bright group-data-[live]/row:text-red-bright lg:ml-0 lg:mt-1.5 lg:basis-full lg:self-auto lg:px-1.5 lg:py-[3px] lg:text-[10px] lg:tracking-[0.16em]">
              TODO · time
            </span>
          )}
        </p>

        <div className="min-w-0">
          <span
            className={`inline-block w-max skew-x-[-10deg] px-[9px] py-1 lg:px-3 lg:py-[5px] ${
              event.featured
                ? "bg-red text-paper"
                : "bg-silver group-data-[live]/row:bg-track"
            }`}
          >
            <span className="inline-block skew-x-[10deg] text-[10px] font-bold uppercase tracking-[0.14em] lg:text-[11px] lg:tracking-[0.16em]">
              {event.tag}
            </span>
          </span>

          <h4 className="m-0 mb-[3px] mt-[7px] text-[16px] font-bold uppercase leading-[1.15] tracking-[0.01em] lg:mb-1.5 lg:mt-3 lg:text-[clamp(18px,1.6vw,23px)]">
            {event.title}
          </h4>
          <p className="m-0 max-w-[46ch] text-[14px] font-medium leading-[1.45] lg:text-[clamp(13px,1.04vw,15px)] lg:leading-[1.55]">
            {event.tagline}
          </p>
        </div>

        <div className="col-start-1 flex flex-row gap-[22px] pt-1 lg:col-start-3 lg:flex-col lg:gap-3.5">
          <MetaCell label="Team" value={event.teamLabel} />
          {/* Only events whose dossier states one. */}
          {event.duration && (
            <MetaCell label="Duration" value={event.duration} />
          )}
        </div>
      </div>
    </article>
  );
}
