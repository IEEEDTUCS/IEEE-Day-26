import { scheduleSection } from "../../../content";

// "EVENT SCHEDULE" on one line on wide screens, stacked on phones. Same two-word
// racing-stripe pattern as AboutTitle — the stripe sweeps, then retracts off the word.
export function ScheduleTitle({ id }) {
  const [word1, word2] = scheduleSection.headingWords;

  return (
    <h2
      id={id}
      data-sch-head
      aria-label={scheduleSection.headingLabel}
      className="m-0 -ml-[0.04em] mb-7 text-[min(76px,19.5vw)] uppercase leading-[0.84] tracking-[-0.04em] lg:-ml-[0.05em] lg:mb-16 lg:whitespace-nowrap lg:text-[clamp(68px,8.6vw,128px)]"
    >
      <span className="relative block w-max lg:inline-block">
        <span data-sch-word className="inline-block">
          {word1}
        </span>
        <span
          data-sch-stripe
          aria-hidden="true"
          className="absolute inset-x-[-0.04em] bottom-[2%] top-[6%] block origin-left scale-x-0 bg-red"
        />
      </span>

      {/* The word gap only exists while both words share a line. */}
      <span aria-hidden="true" className="hidden w-[0.22em] lg:inline-block" />

      <span className="relative block w-max lg:inline-block">
        <span data-sch-word className="inline-block text-red">
          {word2}
        </span>
        <span
          data-sch-stripe
          aria-hidden="true"
          className="absolute inset-x-[-0.04em] bottom-[2%] top-[6%] block origin-left scale-x-0 bg-charcoal"
        />
      </span>
    </h2>
  );
}
