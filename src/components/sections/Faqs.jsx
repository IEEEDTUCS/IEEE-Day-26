import { SectionHeading } from "../ui/SectionHeading";

export default function Faqs() {
  return (
    <section
      id="faqs"
      className="relative flex min-h-[60vh] items-center justify-center overflow-hidden border-t border-silver bg-paper py-28 sm:py-36"
    >
      <div className="container-page relative z-10 text-center">
        <SectionHeading>Frequently Asked <span className="text-red">Questions</span></SectionHeading>
      </div>
    </section>
  );
}
