import { SectionHeading } from "../../ui";

export function Speakers() {
  return (
    <section
      id="speakers"
      className="relative flex min-h-[60vh] items-center justify-center overflow-hidden border-t border-silver bg-paper py-28 sm:py-36"
    >
      <div className="container-page relative z-10 text-center">
        <SectionHeading>Speakers</SectionHeading>
      </div>
    </section>
  );
}
