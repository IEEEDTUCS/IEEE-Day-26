import { SectionHeading } from "../../ui";

export function RegisterCta() {
  return (
    <section
      id="register"
      className="relative flex min-h-[60vh] items-center justify-center overflow-hidden border-t border-silver bg-paper py-28 sm:py-36"
    >
      <div className="container-page relative z-10 text-center">
        <SectionHeading>Register</SectionHeading>
      </div>
    </section>
  );
}
