import { about } from "../../../content";

export function AboutTitle({ id }) {
  const { tag, word1, word2 } = about.title;

  return (
    <h2
      id={id}
      aria-label={`${tag} ${word1} ${word2}`}
      className="m-0 flex flex-col gap-3 pb-2.5 lg:gap-3.5"
    >
      <span className="flex items-center gap-3 lg:gap-4">
        <span
          data-ab-plate
          className="inline-block flex-none bg-red py-2 pl-3 pr-7 text-[20px] uppercase leading-none tracking-[0.04em] text-paper [clip-path:polygon(0_0,100%_0,calc(100%-14px)_100%,0_100%)] lg:py-2.25 lg:pl-4 lg:pr-8.5 lg:text-[clamp(20px,1.8vw,26px)] lg:[clip-path:polygon(0_0,100%_0,calc(100%-16px)_100%,0_100%)]"
        >
          {tag}
        </span>

        <span
          data-ab-kicker
          className="font-body flex-1 text-[10px] font-semibold uppercase not-italic tracking-[0.3em] text-charcoal lg:flex-none lg:text-[11px] lg:tracking-[0.42em]"
        >
          {about.kicker}
        </span>

        {/* Only the wide layout has room for the rule. */}
        <span
          data-ab-rule
          aria-hidden="true"
          className="hidden h-px min-w-6 flex-1 origin-left bg-steel lg:block"
        />

        <span aria-hidden="true" className="flex flex-none gap-bar lg:gap-1.5">
          {["bg-charcoal", "bg-charcoal", "bg-red"].map((tone, i) => (
            <span
              key={i}
              data-ab-light
              className={`block size-1.75 rounded-dot lg:size-2 ${tone}`}
            />
          ))}
        </span>
      </span>

      <span className="ml-[-0.04em] block whitespace-nowrap text-[min(76px,19.5vw)] uppercase leading-[0.84] tracking-[-0.04em] md:text-[clamp(76px,11vw,110px)] lg:ml-[-0.05em] lg:text-[clamp(68px,9.4vw,146px)] lg:leading-[0.82]">
        <span className="relative inline-block">
          <span data-ab-word className="inline-block">
            {word1}
          </span>
          <span
            data-ab-stripe
            aria-hidden="true"
            className="absolute inset-x-[-0.04em] bottom-[2%] top-[6%] block origin-left scale-x-0 bg-red"
          />
        </span>
        <span className="inline-block w-[0.2em] lg:w-[0.22em]" />
        <span className="relative inline-block">
          <span data-ab-word className="inline-block text-red">
            {word2}
          </span>
          <span
            data-ab-stripe
            aria-hidden="true"
            className="absolute inset-x-[-0.04em] bottom-[2%] top-[6%] block origin-left scale-x-0 bg-charcoal"
          />
        </span>
      </span>
    </h2>
  );
}
