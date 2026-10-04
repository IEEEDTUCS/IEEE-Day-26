// Schedule day header
export function ScheduleDayHeader({ day, index, count }) {
  return (
    <div
      data-sch-day
      data-index={index}
      className="group/day relative mb-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 lg:mb-3.5 lg:flex-nowrap lg:gap-[clamp(10px,1.25vw,18px)]"
    >
      <span
        data-day-cp
        aria-hidden="true"
        className="absolute -left-14 top-1/2 block h-0 w-11 lg:hidden"
      >
        <i
          data-cp-line
          className="absolute inset-x-[7px] -top-0.5 block h-1 bg-paper transition-colors duration-200 group-data-[passed]/day:bg-red"
        />
      </span>

      <span
        data-day-item
        className="flex-none bg-charcoal py-1.5 pl-[11px] pr-[22px] font-heading text-[19px] font-black uppercase italic leading-none tracking-[-0.01em] text-paper [clip-path:polygon(0_0,100%_0,calc(100%-11px)_100%,0_100%)] lg:py-[9px] lg:pl-4 lg:pr-8 lg:text-[clamp(20px,1.8vw,26px)] lg:[clip-path:polygon(0_0,100%_0,calc(100%-16px)_100%,0_100%)]"
      >
        {day.plate}
      </span>
      <span
        data-day-item
        className="flex-none text-[13px] font-bold uppercase tracking-[0.06em] lg:text-[clamp(13px,1.11vw,16px)]"
      >
        {day.weekday} {day.date}
      </span>
      <span
        data-day-item
        className="flex-none text-[10px] font-semibold uppercase tracking-[0.2em] lg:text-[clamp(10px,0.83vw,12px)] lg:tracking-[0.3em]"
      >
        {day.campus}
      </span>
      {/* Only the wide layout has room for the rule. */}
      <span
        data-day-item
        data-day-rule
        aria-hidden="true"
        className="hidden h-px flex-1 origin-left bg-silver lg:block"
      />
      <span
        data-day-item
        className="ml-auto flex-none text-[10px] font-semibold uppercase tracking-[0.14em] lg:ml-0 lg:text-[clamp(10px,0.83vw,12px)] lg:tracking-[0.2em]"
      >
        {count} events
      </span>

      <span
        data-day-under
        aria-hidden="true"
        className="absolute inset-x-0 -bottom-2.5 block h-0.5 origin-left bg-charcoal lg:-bottom-3.5"
      />
    </div>
  );
}
