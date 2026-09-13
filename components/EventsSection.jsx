"use client";

import {useEffect, useRef, useState} from "react";
import Image from "next/image";

const events = [
    {
        number: "01",
        name: "Project Wievek",
        field: "SIG",
        image: "/images/events/wievek.jpeg",
        link: "https://www.instagram.com/p/DblO5ZPBOsp/",
        description: "An initiative dedicated to igniting curiosity, fostering innovation, and empowering the next generation through engaging STEM experiences.",
        accent: "from-[#123b61] via-[#0b1c39] to-[#07101f]",
    },
    {
        number: "02",
        name: "Bootstrap",
        field: "Orientation",
        image: "/images/events/bootstrap.jpeg",
        link: "https://www.instagram.com/p/Dc5hLzwRZYw/",
        description: "IEEE DTU's annual induction, connecting new members with opportunities, mentors, and a community that helps them grow beyond the classroom.",
        accent: "from-[#073f52] via-[#0a2637] to-[#07101f]",
    },
    {
        number: "03",
        name: "IEEE Day",
        field: "Techfest",
        image: "/images/events/ieee_day.jpeg",
        description: "A mini tech fiesta celebrating IEEE through competitions, tech games, and innovation-packed challenges for curious minds.",
        accent: "from-[#153567] via-[#141a3e] to-[#07101f]",
        comingSoon: true,
    },
    {
        number: "04",
        name: "Tinkercase",
        field: "Robotics",
        image: "/images/events/tinkercase.jpeg",
        description: "A hardware showcase where creativity meets engineering, turning circuits, prototypes, and bold ideas into real-world marvels.",
        accent: "from-[#153567] via-[#141a3e] to-[#07101f]",
        comingSoon: true,
    },
    {
        number: "05",
        name: "Dreamforge",
        field: "Non-Tech",
        image: "/images/events/dreamforge.JPG",
        description: "IEEE Day's flagship non-tech challenge, designed to test analytical thinking through case-based problem solving and sharp decision-making.",
        accent: "from-[#153567] via-[#141a3e] to-[#07101f]",
        comingSoon: true,
    },
    {
        number: "06",
        name: "Vihaan",
        field: "Hackathon",
        image: "/images/events/vihaan.jpg",
        description: "North India's largest student-run hackathon, challenging teams across software and hardware tracks to build solutions that matter.",
        accent: "from-[#28335f] via-[#1b1c3e] to-[#07101f]",
        comingSoon: true,
    },
    {
        number: "07",
        name: "Techweek",
        field: "Techfest",
        image: "/images/events/techweek.JPG",
        description: "A flagship platform for innovation, learning, and collaboration across machine learning, robotics, web design, programming, and graphic design.",
        accent: "from-[#28335f] via-[#1b1c3e] to-[#07101f]",
        comingSoon: true,
    },
    {
        number: "08",
        name: "Invictus",
        field: "Core",
        image: "/images/events/invictus.JPG",
        description: "DTU's annual technical festival, carrying forward the legacy of IEEE DTU's Troika through ambitious builds, competitions, and engineering challenges.",
        accent: "from-[#123f53] via-[#102b39] to-[#07101f]",
        comingSoon: true,
    },
    {
        number: "09",
        name: "Pitchfork",
        field: "Non-Tech",
        image: "/images/events/pitchfork.jpg",
        description: "Conducted under Invictus, Pitchfork brings founders into the spotlight to pitch bold ideas, gain expert feedback, and move closer to growth.",
        accent: "from-[#3d4a79] via-[#252d52] to-[#07101f]",
        comingSoon: true,
    },
    {
        number: "10",
        name: "Guess-a-Palooza",
        field: "Non-Tech",
        image: "/images/events/guess-a-palooza.JPG",
        description: "A fast-paced guessing challenge that puts observation, instinct, and quick thinking to the test.",
        accent: "from-[#553a78] via-[#2b234c] to-[#07101f]",
        comingSoon: true,
    },
    {
        number: "11",
        name: "RoboWars",
        field: "Robotics",
        image: "/images/events/robowars.JPG",
        description: "An all-out robot combat clash where power, control, and tactics decide which machine rules the arena.",
        accent: "from-[#124f64] via-[#102d40] to-[#07101f]",
        comingSoon: true,
    },
    {
        number: "12",
        name: "LFR Challenge",
        field: "Robotics",
        image: "/images/events/lfr.JPG",
        description: "Put your robot's stability, logic, and control to the test as it navigates a demanding course against tough competition.",
        accent: "from-[#07555b] via-[#0b3037] to-[#07101f]",
        comingSoon: true,
    },
    {
        number: "13",
        name: "CodeKaze",
        field: "Tech",
        image: "/images/events/codekaze.JPG",
        description: "A three-hour competitive programming championship where speed, accuracy, and strategy decide the leaderboard.",
        accent: "from-[#234d79] via-[#182d50] to-[#07101f]",
        comingSoon: true,
    },
    {
        number: "14",
        name: "Quidditch",
        field: "Robotics",
        image: "/images/events/quidditch.jpeg",
        description: "A fast-paced 2v2 robotic pitch where design, coding, precision control, and teamwork decide who lifts the trophy.",
        accent: "from-[#3d4f7d] via-[#202d50] to-[#07101f]",
        comingSoon: true,
    },
    {
        number: "15",
        name: "Digithon",
        field: "Tech",
        image: "/images/events/digithon.JPG",
        description: "A hardware design challenge that puts your Verilog skills to work through real-time problems, circuit optimization, and functional builds.",
        accent: "from-[#19476b] via-[#172b4b] to-[#07101f]",
        comingSoon: true,
    },
    {
        number: "16",
        name: "BITS",
        field: "Tech",
        image: "/images/events/bits.JPG",
        description: "A high-pressure coding arena where logic, speed, and problem-solving separate the fastest thinkers from the rest.",
        accent: "from-[#0d5b68] via-[#123943] to-[#07101f]",
        comingSoon: true,
    },
    {
        number: "17",
        name: "ILUX",
        field: "Design",
        image: "/images/events/ilux.JPG",
        description: "A visual design competition where ideas become impact through color, pixels, storytelling, and imagination.",
        accent: "from-[#65428f] via-[#352653] to-[#07101f]",
        comingSoon: true,
    },
    {
        number: "18",
        name: "CodeCrunch",
        field: "Tech",
        image: "/images/events/codecrunch.JPG",
        description: "An AI challenge focused on model building, optimization, and semantic segmentation using synthetic datasets, presented by Duality and Genesis.",
        accent: "from-[#0c4770] via-[#0c263f] to-[#07101f]",
        comingSoon: true,
    },
    {
        number: "19",
        name: "RoboRace",
        field: "Robotics",
        image: "/images/events/roborace.JPG",
        description: "An adrenaline-charged robotics race where bots navigate obstacles, hold control, and outrun the competition on the track.",
        accent: "from-[#244b6f] via-[#192e4c] to-[#07101f]",
        comingSoon: true,
    },
    {
        number: "20",
        name: "RoboSoccer",
        field: "Robotics",
        image: "/images/events/robosoccer.JPG",
        description: "A robotics football showdown where control, coordination, and engineering come together on the field.",
        accent: "from-[#19476b] via-[#172b4b] to-[#07101f]",
        comingSoon: true,
    },
];

const fieldStyles = {
    Tech: "border-electric/60 bg-electric/15 text-signal",
    "Non-Tech": "border-violet-300/55 bg-violet-300/10 text-violet-200",
    Core: "border-amber-300/55 bg-amber-300/10 text-amber-200",
    Robotics: "border-orange-300/55 bg-orange-300/10 text-orange-200",
    Design: "border-pink-300/55 bg-pink-300/10 text-pink-200",
    Techfest: "border-cyan-300/55 bg-cyan-300/10 text-cyan-200",
    SIG: "border-lime-300/55 bg-lime-300/10 text-lime-200",
    Hackathon: "border-blue-300/55 bg-blue-300/10 text-blue-200",
    Orientation: "border-emerald-300/55 bg-emerald-300/10 text-emerald-200",
};

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
                <div data-reveal className="mb-10 flex items-end justify-between gap-8">
                    <div>
                        <p className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-electric">
                            <span className="h-px w-8 bg-electric"/> Our Flagship Events
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
                    className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[11vw] pb-6 pt-5 [scroll-padding-inline:11vw] [scrollbar-width:none] sm:-mx-10 sm:px-10 sm:[scroll-padding-inline:2.5rem] lg:-mx-16 lg:px-16 lg:[scroll-padding-inline:4rem] [&::-webkit-scrollbar]:hidden"
                >
                    {events.map((event) => {
                        const Card = event.link ? "a" : "article";
                        return (
                        <Card data-reveal key={event.name}
                                 href={event.link || undefined}
                                 target={event.link ? "_blank" : undefined}
                                 rel={event.link ? "noreferrer" : undefined}
                                 className="group relative z-0 min-w-[min(78vw,285px)] snap-start sm:min-w-[310px] lg:min-w-[calc((100%-48px)/4)] hover:z-10">
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
                                <div className="absolute left-5 top-5 z-10">
                                    <span className={`rounded-full border bg-ink/75 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.16em] backdrop-blur-md ${fieldStyles[event.field]}`}>
                                        {event.field}
                                    </span>
                                </div>
                                <div
                                    className="absolute right-5 top-5 z-10 rounded-full bg-ink/60 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-signal/90 backdrop-blur-md">
                                    {event.number}
                                </div>
                                <p
                                    className="pointer-events-none absolute bottom-[150px] left-5 right-5 translate-y-3 text-justify text-sm font-medium leading-6 text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:text-base sm:leading-7">
                                    {event.description}
                                </p>
                                <div className="absolute bottom-5 left-5 right-5">
                                    <div className="mb-5 h-px w-full bg-white/10"/>
                                    <h3 className="text-2xl font-bold tracking-[-0.04em] text-white sm:text-3xl">{event.name}</h3>
                                    <span
                                        className="mt-3 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-electric">
                    {event.comingSoon ? "Coming soon" : "Discover event"} <span>↗</span>
                  </span>
                                </div>
                            </div>
                        </Card>
                        );
                    })}
                </div>
                <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-muted/70 sm:hidden">Swipe to
                    explore <span className="ml-2 text-electric">→</span></p>
            </div>
        </section>
    );
}
