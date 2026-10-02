import { SectionHeading } from "../../ui";

export function About() {
  return (
    <section
      id="about"
      className="relative flex min-h-[60vh] items-center justify-center overflow-hidden border-t border-silver bg-paper py-28 sm:py-36"
    >
      <div className="container-page relative z-10 text-center">
        <SectionHeading>About <span className="text-red">Us</span></SectionHeading>
      </div>
    </section>
  );
}
