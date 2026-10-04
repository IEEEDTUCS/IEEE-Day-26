export function SectorBar({ days, onJump }) {
  return (
    <nav
      aria-label="Schedule days"
      className="grid flex-none grid-cols-3 gap-[5px] bg-charcoal px-3 pb-[7px] pt-2 lg:gap-1.5 lg:py-0 lg:pb-4 lg:pl-[clamp(14px,1.53vw,22px)] lg:pr-[clamp(16px,4.17vw,60px)] lg:pt-5"
    >
      {days.map((day, index) => (
        <button
          key={day.id}
          type="button"
          data-sec
          data-index={index}
          aria-label={`Jump to ${day.plate}, ${day.weekday} ${day.date}, ${day.campus}`}
          onClick={() => onJump(index)}
          className="group/sec relative flex min-h-11 cursor-pointer flex-col items-start gap-1 border-0 bg-pit pb-[11px] pl-2.5 pr-2 pt-[7px] text-left text-steel [clip-path:polygon(0_0,100%_0,calc(100%-8px)_100%,0_100%)] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-paper lg:min-h-15.5 lg:gap-1.25 lg:pb-3.5 lg:pl-2 lg:pr-1.5 lg:pt-2 xl:pl-3 xl:pr-2.5 lg:[clip-path:polygon(0_0,100%_0,calc(100%-10px)_100%,0_100%)]"
        >
          <span className="font-heading text-[15px] font-black italic uppercase leading-none tracking-[-0.01em] transition-colors duration-200 group-hover/sec:text-paper group-data-[cur]/sec:text-paper group-data-[passed]/sec:text-paper lg:text-[clamp(15px,1.39vw,20px)]">
            {day.plate}
          </span>
          <span className="whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.12em] group-data-[cur]/sec:text-paper lg:text-[8.5px] lg:tracking-[0.06em] xl:text-[9px] xl:tracking-[0.12em] min-[1400px]:text-[10px] min-[1400px]:tracking-[0.2em]">
            {day.date} · {day.campus.replace(/\s*campus$/i, "")}
          </span>
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-0 right-2 block h-[3px] bg-track lg:right-2.5 lg:h-1"
          >
            <span
              data-sec-fill
              className="absolute inset-0 block origin-left scale-x-0 bg-red"
            />
          </span>
        </button>
      ))}
    </nav>
  );
}
