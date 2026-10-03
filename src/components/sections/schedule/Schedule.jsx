import { SectionHeading } from "../../ui";

export function Schedule() {
    return (
        <section
            id="schedule"
            className="relative flex min-h-[60vh] items-center justify-center overflow-hidden border-t border-silver bg-paper py-28 sm:py-36"
        >
            <div className="container-page relative z-10 text-center">
                <SectionHeading>Schedule</SectionHeading>
            </div>
        </section>
    );
}