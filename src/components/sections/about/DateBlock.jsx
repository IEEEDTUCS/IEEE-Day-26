import { about } from "../../../content";

const SLANT = "[clip-path:polygon(6px_0,100%_0,calc(100%_-_6px)_100%,0_100%)]";

function CalendarIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="square"
      aria-hidden="true"
      className="block stroke-red lg:size-7.5"
    >
      <rect x="3" y="5" width="18" height="16" />
      <path d="M3 10h18M8 3v4M16 3v4M7 14h6" />
    </svg>
  );
}

// Race timetable: the dates, then the three days as grid slots.
export function DateBlock() {
  const { label, range, monthYear, days, ariaLabel } = about.date;

  return (
    <div className="flex items-stretch gap-3 lg:gap-5">
      <span
        data-ab-date-rule
        aria-hidden="true"
        className="block w-0.75 flex-none origin-top bg-red"
      />

      <div className="flex flex-col gap-2.5 lg:gap-3.5">
        <span data-ab-date-item className="block">
          <CalendarIcon />
        </span>

        <span
          data-ab-date-item
          className="text-[10px] font-bold uppercase leading-normal tracking-[0.28em] lg:text-[11px] lg:tracking-[0.32em]"
        >
          {label}
        </span>

        <span
          data-ab-date-item
          className="tabular text-[26px] font-extrabold uppercase leading-[1.05] lg:text-[34px]"
        >
          {range}
          <br />
          {monthYear}
        </span>

        <span
          role="img"
          aria-label={ariaLabel}
          className="flex gap-0.75 lg:gap-1"
        >
          {days.map((day) => (
            <span
              key={day}
              className={`relative flex h-6.5 w-10 items-center justify-center bg-charcoal lg:h-7 lg:w-11 ${SLANT}`}
            >
              <span
                data-ab-day-fill
                aria-hidden="true"
                className="absolute inset-0 block origin-left bg-red"
              />
              <span className="tabular relative text-xs font-extrabold text-paper">
                {day}
              </span>
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
