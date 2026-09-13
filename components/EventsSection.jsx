"use client";

import {useEffect, useRef, useState} from "react";
import Image from "next/image";

const events = [
    {
        number: "01",
        name: "Wievek",
        image: "/images/events/wievek.jpeg",
        description: "A high-energy celebration of women in engineering, built around ideas, people, and the spirit of IEEE DTU.",
        accent: "from-[#123b61] via-[#0b1c39] to-[#07101f]",
    },
    {
        number: "02",
        name: "Bootstrap",
        image: "/images/events/bootstrap.jpeg",
        description: "A launchpad for curious minds to learn, collaborate, and turn a first idea into something real.",
        accent: "from-[#073f52] via-[#0a2637] to-[#07101f]",
    },
    {
        number: "03",
        name: "IEEE Day",
        image: "/images/events/ieee_day.jpeg",
        description: "A celebration of the people and possibilities that make IEEE a global community. Coming soon.",
        accent: "from-[#153567] via-[#141a3e] to-[#07101f]",
        comingSoon: true,
    },
    {
        number: "04",
        name: "Vihaan",
        image: "/images/events/vihaan.jpg",
        description: "Vihaan X is on the horizon — a new edition of one of IEEE DTU's biggest ideas. Coming soon.",
        accent: "from-[#28335f] via-[#1b1c3e] to-[#07101f]",
        comingSoon: true,
    },
    {
        number: "05",
        name: "Invictus",
        image: "/images/events/invictus.JPG",
        description: "The next chapter begins with Invictus '27, bringing the IEEE DTU community together around what comes next.",
        accent: "from-[#123f53] via-[#102b39] to-[#07101f]",
        comingSoon: true,
    },
];

export default function EventsSection() {
    const carouselRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return undefined;

        const interval = window.setInterval(() => {
            const carousel = carouselRef.current;
            if (!carousel) return;

            const isAtEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 8;
            carousel.scrollTo({
                left: isAtEnd ? 0 : carousel.scrollLeft + 326,
                behavior: "smooth",
            });
        }, 3600);

        return () => window.clearInterval(interval);
    }, [isPaused]);

    const moveCarousel = (direction) => {
        carouselRef.current?.scrollBy({left: direction * 340, behavior: "smooth"});
    };

    return (
        <section id="events" className="relative overflow-hidden bg-[#070d19] py-24 sm:py-32">
            <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-16">
                <div className="mb-10 flex items-end justify-between gap-8">
                    <div>
                        <p className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-electric">
                            <span className="h-px w-8 bg-electric"/> What we do
                        </p>
                        <h2 className="max-w-xl text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl">
                            Moments that <span className="text-electric">move us.</span>
                        </h2>
                    </div>
                    <div className="hidden gap-2 sm:flex">
                        <button
                            type="button"
                            onClick={() => moveCarousel(-1)}
                            aria-label="Previous events"
                            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white transition hover:border-electric hover:text-electric"
                        >
                            ←
                        </button>
                        <button
                            type="button"
                            onClick={() => moveCarousel(1)}
                            aria-label="Next events"
                            className="grid h-10 w-10 place-items-center rounded-full border border-electric text-electric transition hover:bg-electric hover:text-ink"
                        >
                            →
                        </button>
                    </div>
                </div>

                <div
                    ref={carouselRef}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onFocus={() => setIsPaused(true)}
                    onBlur={() => setIsPaused(false)}
                    className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-6 pt-5 [scrollbar-width:none] sm:-mx-10 sm:px-10 lg:-mx-16 lg:px-16 [&::-webkit-scrollbar]:hidden"
                >
                    {events.map((event) => (
                        <article key={event.name}
                                 className="group relative z-0 min-w-[min(82vw,310px)] snap-start sm:min-w-[310px] lg:min-w-[calc((100%-48px)/4)] hover:z-10">
                            <div
                                className={`relative min-h-[380px] overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br ${event.accent} p-5 transition duration-500 group-hover:-translate-y-1 group-hover:border-electric/50 group-hover:shadow-[0_0_36px_rgba(32,217,255,.13)]`}>
                                {event.image && (
                                    <Image
                                        loading="eager"
                                        src={event.image}
                                        alt={`${event.name} event at IEEE DTU`}
                                        fill
                                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 310px, 82vw"
                                        className="object-cover object-center transition duration-700 group-hover:scale-105 group-hover:blur-[2px] group-hover:brightness-50"
                                    />
                                )}
                                <div
                                    className="absolute inset-0 bg-gradient-to-t from-[#07101f] via-[#07101f]/15 to-transparent transition duration-500 group-hover:bg-[#050914]/65"/>
                                <div
                                    className="absolute -right-12 -top-16 h-44 w-44 rounded-full border border-electric/20 bg-electric/10 blur-2xl transition duration-500 group-hover:bg-electric/20"/>
                                <div
                                    className="absolute right-5 top-5 text-[9px] font-bold uppercase tracking-[0.2em] text-signal/80">
                                    {event.number}
                                </div>
                                <p
                                    className="pointer-events-none absolute bottom-[150px] left-5 right-5 translate-y-3 text-justify text-sm font-medium leading-6 text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:text-base sm:leading-7">
                                    {event.description}
                                </p>
                                <div className="absolute bottom-5 left-5 right-5">
                                    <div className="mb-5 h-px w-full bg-white/10"/>
                                    <h3 className="text-3xl font-bold tracking-[-0.04em] text-white">{event.name}</h3>
                                    <span
                                        className="mt-3 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-electric">
                    {event.comingSoon ? "Coming soon" : "Discover event"} <span>↗</span>
                  </span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
                <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-muted/70 sm:hidden">Swipe to
                    explore <span className="ml-2 text-electric">→</span></p>
            </div>
        </section>
    );
}
