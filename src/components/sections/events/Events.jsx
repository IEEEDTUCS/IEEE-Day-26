import { SectionHeading } from "../../ui";

export function Events() {
  return (
    <section
      id="events"
      className="relative flex min-h-[60vh] items-center justify-center overflow-hidden border-t border-silver bg-paper py-28 sm:py-36"
    >
      <div className="container-page relative z-10 text-center">
        <SectionHeading><span className="text-red">Events</span></SectionHeading>
      </div>
    </section>
  );
}
