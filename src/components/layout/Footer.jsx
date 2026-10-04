import { Fragment, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { SocialIcon } from "./SocialIcon";
import {
  gsap,
  eases,
  buildHeadingReveal,
  scrollToSection,
  scrollToTop,
  useReducedMotion,
} from "../../motion";
import { useMediaQuery } from "../../hooks";
import {
  navLinks,
  event,
  hosts,
  linktree,
  showEventLeads,
  eventLeads,
  LEAD_SLOTS,
  venues,
  emails,
  copyright,
  footerCopy,
} from "../../content";

const NETWORKS = ["Instagram", "LinkedIn", "Facebook"];
const SOCIAL_KEYS = {
  Instagram: "instagram",
  LinkedIn: "linkedin",
  Facebook: "facebook",
};

// Elements animation timings
const AT = {
  heading: { follow: 0.5, leads: 0.6, venue: 0.7 },
  rule: { follow: 0.65, leads: 0.75, venue: 0.85 },
  followGroup: [0.7, 0.85],
  leadsGroup: [0.8, 0.9],
  venueBlock: [0.9, 1.0],
  chip: [
    [0.78, 0.84, 0.9],
    [0.93, 0.99, 1.05],
  ],
  lead: [
    [0.85, 0.91, 0.97],
    [0.95, 1.01, 1.07],
  ],
};

// Sweep animation for red bar
const SWEEP =
  "absolute -inset-[2px] origin-left scale-x-0 transition-transform duration-(--duration-base) ease-race group-hover:scale-x-100 group-focus-visible:scale-x-100";

const PAGE_LINKS = [
  ...navLinks.filter((link) => link.id !== "home"),
  { id: "register", label: "Register" },
];
const [dtuHost, gtbitHost] = hosts;

function ColumnHeading({ id, label, at, ruleAt }) {
  return (
    <div className="flex flex-col gap-3.5">
      <h2
        data-ft-heading
        data-at={at}
        className="heading-caps m-0 text-[15px] uppercase text-paper"
      >
        <span id={id}>{label}</span>
      </h2>
      <span
        data-ft-rule
        data-at={ruleAt}
        aria-hidden="true"
        className="block h-1 w-16 origin-left bg-red [clip-path:polygon(4px_0,100%_0,calc(100%-4px)_100%,0_100%)]"
      />
    </div>
  );
}

function GroupLabel({ children, at }) {
  return (
    <div data-ft-group data-at={at} className="flex items-center gap-2.5">
      <span aria-hidden="true" className="block h-3.5 w-0.75 bg-red" />
      <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-steel">
        {children}
      </span>
    </div>
  );
}

function SocialChip({ host, network, at }) {
  const href = host.socials[SOCIAL_KEYS[network]];
  const label = footerCopy.socialLabel(host.name, network);
  const live = Boolean(href);

  return (
    <a
      data-ft-chip
      data-at={at}
      aria-label={label}
      {...(live
        ? { href, target: "_blank", rel: "noopener noreferrer" }
        : {
            "aria-disabled": "true",
            title: footerCopy.socialTodo(host.name, network),
          })}
      className="group relative isolate flex size-11 shrink-0 items-center justify-center overflow-hidden border-[1.5px] border-track text-silver transition-colors duration-(--duration-base) hover:border-red hover:text-paper focus-visible:border-red focus-visible:text-paper"
    >
      <span aria-hidden="true" className={`${SWEEP} bg-red`} />
      <span className="relative flex">
        <SocialIcon name={network} size={18} />
      </span>
    </a>
  );
}

function KnowMore() {
  const live = Boolean(linktree.href);

  return (
    <a
      data-ft-cta
      aria-label={footerCopy.linktreeLabel}
      {...(live
        ? { href: linktree.href, target: "_blank", rel: "noopener noreferrer" }
        : { "aria-disabled": "true", title: footerCopy.linktreeTodo })}
      className="group relative isolate flex min-h-13 items-center justify-between gap-3.5 overflow-hidden bg-red px-5.5 text-[13px] font-extrabold uppercase tracking-[0.26em] text-paper [clip-path:polygon(0_0,100%_0,calc(100%-14px)_100%,0_100%)]"
    >
      <span aria-hidden="true" className={`${SWEEP} bg-red-deep`} />
      <span className="relative">{linktree.label}</span>
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        aria-hidden="true"
        className="relative mr-2 block transition-transform duration-(--duration-base) ease-race group-hover:translate-x-0.75 group-hover:-translate-y-0.75 group-focus-visible:translate-x-0.75 group-focus-visible:-translate-y-0.75"
      >
        <path
          d="M2 12 12 2M4 2h8v8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="square"
        />
      </svg>
    </a>
  );
}

function FollowUs() {
  return (
    <section
      aria-labelledby="ft-follow"
      className={`flex flex-col gap-4.5 lg:col-start-1 lg:row-start-1 lg:gap-5.5 ${
        showEventLeads ? "" : "lg:row-span-2"
      }`}
    >
      <ColumnHeading
        id="ft-follow"
        label={footerCopy.followUs}
        at={AT.heading.follow}
        ruleAt={AT.rule.follow}
      />
      <div className="flex flex-col">
        {hosts.map((host, row) => (
          <div
            key={host.id}
            className="flex items-center justify-between gap-4 border-b border-track py-3"
          >
            <GroupLabel at={AT.followGroup[row]}>{host.name}</GroupLabel>
            <div className="flex gap-2">
              {NETWORKS.map((network, i) => (
                <SocialChip
                  key={network}
                  host={host}
                  network={network}
                  at={AT.chip[row][i]}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <KnowMore />
    </section>
  );
}

function EmailBlock() {
  return (
    <div
      data-ft-email
      className={`flex flex-col gap-2 border-t border-track pt-4 lg:row-start-2 lg:mt-1 lg:pt-1.5 ${
        showEventLeads ? "lg:col-start-1" : "lg:col-start-2"
      }`}
    >
      <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-steel lg:pt-2.5">
        {footerCopy.email}
      </span>
      {hosts.map((host) => {
        const address = emails[host.id];
        if (!address) {
          return (
            <span key={host.id} className="text-xs font-semibold text-steel">
              {footerCopy.todo.email(host.shortName)}
            </span>
          );
        }
        return (
          <a
            key={host.id}
            href={`mailto:${address}`}
            className="my-[-12.5px] inline-flex w-fit items-center py-[12.5px] text-[15px] font-semibold text-paper transition-colors duration-(--duration-base) hover:text-red-bright focus-visible:text-red-bright lg:text-sm"
          >
            <span className="border-b-[1.5px] border-red-bright pb-px">
              {address}
            </span>
          </a>
        );
      })}
    </div>
  );
}

function LeadList({ host, leads, column }) {
  const slots = leads.length
    ? leads
    : Array.from({ length: LEAD_SLOTS }, () => null);

  return (
    <div
      className={`flex flex-col gap-3.5 ${column === 1 ? "pt-2 lg:pt-0" : ""}`}
    >
      <GroupLabel at={AT.leadsGroup[column]}>{host.name}</GroupLabel>
      {slots.map((lead, i) =>
        lead ? (
          <div
            key={lead.name}
            data-ft-item
            data-at={AT.lead[column][i]}
            className="flex flex-col gap-1"
          >
            <span className="text-[15px] font-bold text-paper">
              {lead.name}
            </span>
            <a
              href={`tel:${lead.phone.replace(/\s+/g, "")}`}
              className="my-[-13.5px] inline-flex w-fit items-center py-[13.5px] text-[13px] font-medium tracking-[0.04em] tabular-nums text-steel transition-colors duration-(--duration-base) hover:text-red-bright focus-visible:text-red-bright"
            >
              {lead.phone}
            </a>
          </div>
        ) : (
          <div
            key={`todo-${i}`}
            data-ft-item
            data-at={AT.lead[column][i]}
            className="flex flex-col gap-1 border-l-2 border-dashed border-track px-2.5 py-1.5"
          >
            <span className="text-sm font-bold text-steel">
              {footerCopy.todo.leadName(host.shortName, i + 1)}
            </span>
            <span className="text-xs font-medium tracking-[0.04em] text-steel">
              {footerCopy.todo.leadPhone}
            </span>
          </div>
        ),
      )}
    </div>
  );
}

function EventLeads() {
  return (
    <section
      aria-labelledby="ft-leads"
      className="flex flex-col gap-4.5 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:gap-5.5"
    >
      <ColumnHeading
        id="ft-leads"
        label={footerCopy.eventLeads}
        at={AT.heading.leads}
        ruleAt={AT.rule.leads}
      />
      <div className="flex flex-col gap-3.5 lg:grid lg:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] lg:gap-x-7 lg:gap-y-6">
        <LeadList host={dtuHost} leads={eventLeads.dtu} column={0} />
        <LeadList host={gtbitHost} leads={eventLeads.gtbit} column={1} />
      </div>
    </section>
  );
}

function EventVenue() {
  return (
    <section
      aria-labelledby="ft-venue"
      className={`flex flex-col gap-4.5 lg:row-start-1 lg:gap-5.5 ${
        showEventLeads ? "lg:col-start-3 lg:row-span-2" : "lg:col-start-2"
      }`}
    >
      <ColumnHeading
        id="ft-venue"
        label={footerCopy.eventVenue}
        at={AT.heading.venue}
        ruleAt={AT.rule.venue}
      />
      <div
        className={
          showEventLeads
            ? "flex flex-col gap-4.5 lg:gap-5.5"
            : "flex flex-col gap-4.5 lg:grid lg:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] lg:gap-x-10 lg:gap-y-7"
        }
      >
        {venues.map((venue, i) => (
          <div
            key={venue.id}
            data-ft-item
            data-at={AT.venueBlock[i]}
            className="flex flex-col gap-2.5"
          >
            <GroupLabel at={AT.venueBlock[i]}>{venue.label}</GroupLabel>
            <div className="flex flex-col gap-1">
              <span className="text-[15px] font-bold text-paper">
                {venue.name}
              </span>
              <span className="text-[13.5px] leading-[1.6] text-steel">
                {venue.lines.map((line, n) => (
                  <Fragment key={line}>
                    {line}
                    {n < venue.lines.length - 1 && <br />}
                  </Fragment>
                ))}
              </span>

              <a
                href={venue.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={footerCopy.directionsLabel(venue.name, venue.label)}
                className="group -mt-2.5 -mb-3.5 inline-flex w-fit items-center py-3.5 text-[11px] font-bold uppercase tracking-[0.22em] text-paper transition-colors duration-(--duration-base) hover:text-red-bright focus-visible:text-red-bright"
              >
                <span className="border-b-[1.5px] border-red-bright pb-0.5">
                  {footerCopy.directions}{" "}
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-(--duration-base) ease-race group-hover:translate-x-0.75 group-hover:-translate-y-0.75 group-focus-visible:translate-x-0.75 group-focus-visible:-translate-y-0.75"
                  >
                    ↗
                  </span>
                </span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Chevrons() {
  const tones = ["text-track", "text-steel", "text-red"];

  return (
    <div aria-hidden="true" className="flex gap-1 lg:order-3">
      {tones.map((tone) => (
        <span key={tone} data-ft-chevron className={`block ${tone}`}>
          <svg
            width="10"
            height="15"
            viewBox="0 0 30 44"
            aria-hidden="true"
            className="block h-3.75 w-2.5 lg:h-4.5 lg:w-3"
          >
            <polygon
              points="0,0 13,0 30,22 13,44 0,44 17,22"
              fill="currentColor"
            />
          </svg>
        </span>
      ))}
    </div>
  );
}

export function Footer() {
  const scope = useRef(null);
  const reduced = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const goTo = (id) => (e) => {
    e.preventDefault();
    scrollToSection(id);
  };

  const goTop = (e) => {
    e.preventDefault();
    scrollToTop();
  };

  useGSAP(
    () => {
      if (reduced) return;
      const q = gsap.utils.selector(scope);
      const at = (el) => Number(el.dataset.at);

      const edge = q("[data-ft-edge]");
      const words = q("[data-ft-word]");
      const stripes = q("[data-ft-stripe]");
      const meta = q("[data-ft-meta]");
      const lights = q("[data-ft-light]");
      const hosted = q("[data-ft-hosted]");
      const backTop = q("[data-ft-top]");
      const headings = q("[data-ft-heading]");
      const rules = q("[data-ft-rule]");
      const groups = q("[data-ft-group]");
      const chips = q("[data-ft-chip]");
      const items = q("[data-ft-item]");
      const cta = q("[data-ft-cta]");
      const email = q("[data-ft-email]");
      const chevrons = q("[data-ft-chevron]");

      // Hidden states live here, never in CSS — the footer must be complete
      // and readable if JS never runs.
      gsap.set(edge, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(rules, { scaleX: 0, transformOrigin: "left center" });
      gsap.set([...meta, ...hosted, ...email, ...groups], { opacity: 0 });
      gsap.set([...lights, ...chevrons], { opacity: 0.12 });
      gsap.set([...headings, ...items, ...cta], { opacity: 0, x: -24 });
      gsap.set([...backTop, ...chips], { opacity: 0, scale: 0.6 });

      const pulse = gsap.to(chevrons[chevrons.length - 1], {
        opacity: 0.4,
        duration: 1.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        paused: true,
      });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: scope.current, start: "top 90%", once: true },
      });

      tl.to(edge, { scaleX: 1, duration: 0.7, ease: eases.race }, 0.2);

      words.forEach((word, i) => {
        tl.add(
          buildHeadingReveal({
            text: word,
            stripe: stripes[i],
            x: -20,
            skewX: -8,
            stripeDuration: 0.34,
            textDuration: 0.7,
            retractAt: "<0.02",
          }),
          0.3 + i * 0.12,
        );
      });

      headings.forEach((el) =>
        tl.to(
          el,
          { opacity: 1, x: 0, duration: 0.6, ease: eases.race },
          at(el),
        ),
      );
      rules.forEach((el) =>
        tl.to(el, { scaleX: 1, duration: 0.6, ease: eases.race }, at(el)),
      );
      groups.forEach((el) =>
        tl.to(el, { opacity: 1, duration: 0.4, ease: "none" }, at(el)),
      );
      chips.forEach((el) =>
        tl.to(
          el,
          { opacity: 1, scale: 1, duration: 0.4, ease: eases.race },
          at(el),
        ),
      );
      items.forEach((el) =>
        tl.to(
          el,
          { opacity: 1, x: 0, duration: 0.5, ease: eases.race },
          at(el),
        ),
      );

      tl.to(meta, { opacity: 1, duration: 0.5, ease: "none" }, 0.8)
        .to(
          lights,
          { opacity: 1, duration: 0.15, ease: "none", stagger: 0.15 },
          0.9,
        )
        .to(hosted, { opacity: 1, duration: 0.5, ease: "none" }, 0.9)
        .to(
          backTop,
          { opacity: 1, scale: 1, duration: 0.5, ease: eases.race },
          1.1,
        )
        .to(cta, { opacity: 1, x: 0, duration: 0.6, ease: eases.race }, 1.15)
        .to(email, { opacity: 1, duration: 0.5, ease: "none" }, 1.15)
        .to(
          chevrons,
          { opacity: 1, duration: 0.25, ease: "none", stagger: 0.1 },
          1.4,
        )
        // The red chevron then idles. Its beat is the same at every width, so
        // it runs outside the timeline that mobile speeds up.
        .call(() => pulse.play(), null, 2);

      if (!isDesktop) tl.timeScale(1.25);
    },
    { scope, dependencies: [reduced, isDesktop] },
  );

  return (
    <footer
      id="contact"
      ref={scope}
      aria-label={footerCopy.landmark}
      className="relative overflow-hidden bg-charcoal text-paper"
    >
      {/* Stepped slant: paper above, charcoal below, red on the raised part. */}
      <div aria-hidden="true" className="relative h-11 bg-paper lg:h-16">
        <div className="absolute inset-0 bg-charcoal [clip-path:polygon(0_44px,0_20px,40%_20px,48%_0,100%_0,100%_44px)] lg:[clip-path:polygon(0_64px,0_28px,54%_28px,58%_0,100%_0,100%_64px)]" />
        <div
          data-ft-edge
          className="absolute top-0 left-[48%] h-1 w-[52%] bg-red lg:left-[58%] lg:h-bar lg:w-[30%]"
        />
      </div>

      <div className="px-4 pt-5 lg:mx-auto lg:max-w-350 lg:px-[clamp(1rem,4vw,4rem)] lg:pt-8">
        <div className="flex flex-wrap items-start gap-x-4 gap-y-5 border-b border-track pb-7 lg:items-center lg:gap-x-7 lg:gap-y-7 lg:pb-9">
          <div className="flex min-w-0 flex-1 flex-col gap-2.5 lg:mr-auto lg:flex-none lg:flex-row lg:flex-wrap lg:items-end lg:gap-5">
            <p
              aria-label={`${event.name} ${event.year}`}
              className="m-0 font-heading text-[46px] leading-[0.84] font-black tracking-[-0.035em] uppercase italic lg:text-[clamp(44px,4.4vw,64px)]"
            >
              <span className="relative inline-block">
                <span data-ft-word className="inline-block">
                  IEEE
                </span>
                <span
                  data-ft-stripe
                  aria-hidden="true"
                  className="absolute top-[6%] right-[-0.04em] bottom-[-2%] left-[-0.04em] block origin-left scale-x-0 bg-red"
                />
              </span>
              <span className="inline-block w-[0.2em]" />
              <span className="relative inline-block">
                <span data-ft-word className="inline-block text-red-bright">
                  Day
                </span>
                <span
                  data-ft-stripe
                  aria-hidden="true"
                  className="absolute top-[6%] right-[-0.04em] bottom-[-2%] left-[-0.04em] block origin-left scale-x-0 bg-paper"
                />
              </span>
            </p>

            <div
              data-ft-meta
              className="flex items-center gap-2.5 lg:flex-col lg:items-start lg:gap-1.5 lg:pb-0.5"
            >
              <span aria-hidden="true" className="flex gap-bar">
                <span
                  data-ft-light
                  className="block size-1.75 rounded-dot bg-steel"
                />
                <span
                  data-ft-light
                  className="block size-1.75 rounded-dot bg-steel"
                />
                <span
                  data-ft-light
                  className="block size-1.75 rounded-dot bg-red"
                />
              </span>
              <span className="text-[11px] font-bold tracking-[0.28em] text-silver uppercase lg:text-xs lg:tracking-[0.3em]">
                {event.dateLabel}
              </span>
            </div>
          </div>

          <div
            data-ft-hosted
            className="order-3 flex basis-full flex-wrap items-center gap-3.5 lg:order-2 lg:basis-auto lg:flex-nowrap lg:gap-4.5"
          >
            <span className="w-full text-[10px] font-bold tracking-[0.28em] text-steel uppercase lg:w-auto lg:text-[11px] lg:tracking-[0.3em]">
              {footerCopy.hostedBy}
            </span>
            <img
              src={dtuHost.logo.src}
              alt={dtuHost.logo.alt}
              width={dtuHost.logo.width}
              height={dtuHost.logo.height}
              loading="lazy"
              className="block h-9.5 w-auto lg:h-11"
            />
            <span
              aria-hidden="true"
              className="font-heading text-xl font-black text-red-bright italic lg:text-[22px]"
            >
              ×
            </span>
            <img
              src={gtbitHost.logo.src}
              alt={gtbitHost.logo.alt}
              width={gtbitHost.logo.width}
              height={gtbitHost.logo.height}
              loading="lazy"
              className="block size-11.5 lg:size-13"
            />
          </div>

          <a
            data-ft-top
            href="#home"
            onClick={goTop}
            aria-label={footerCopy.backToTop}
            className="group relative isolate order-2 grid size-12 shrink-0 place-items-center overflow-hidden border-2 border-track text-paper lg:order-3 lg:size-13"
          >
            <span aria-hidden="true" className={`${SWEEP} bg-red`} />
            <svg
              width="16"
              height="18"
              viewBox="0 0 16 18"
              aria-hidden="true"
              className="relative block transition-transform duration-(--duration-base) ease-race group-hover:-translate-y-0.75 group-focus-visible:-translate-y-0.75"
            >
              <path
                d="M8 17V2M2 7.5 8 1.5l6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="square"
              />
            </svg>
          </a>
        </div>

        <div
          className={`grid gap-y-10 pt-8 pb-10 lg:items-start lg:gap-y-5.5 lg:pt-12 lg:pb-14 ${
            showEventLeads
              ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-x-14"
              : "lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-x-20"
          }`}
        >
          <FollowUs />
          <EmailBlock />
          {showEventLeads && <EventLeads />}
          <EventVenue />
        </div>
      </div>

      <div className="bg-pit-deep">
        <div className="flex flex-col gap-3 px-4 pt-4.5 pb-5.5 lg:mx-auto lg:max-w-350 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-3 lg:px-[clamp(1rem,4vw,4rem)] lg:py-4.5">
          <nav
            aria-label={footerCopy.navLabel}
            className="flex flex-wrap gap-x-5.5 lg:order-2 lg:gap-x-6 lg:gap-y-1"
          >
            {PAGE_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={goTo(link.id)}
                // Same trick as the other text links: padding makes the 44px tap target,
                // the negative margin hands the space back so the bar keeps its height.
                className="inline-flex min-h-11 min-w-11 items-center py-2.5 text-[11px] font-bold tracking-[0.2em] text-steel uppercase transition-colors duration-(--duration-base) hover:text-paper focus-visible:text-paper lg:-my-2 lg:min-h-0 lg:py-3.5 lg:tracking-[0.22em]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center justify-between gap-3 border-t border-track pt-2.5 lg:contents">
            <span className="text-[11px] font-medium tracking-[0.04em] text-steel lg:order-1 lg:text-xs">
              {copyright}
            </span>
            <Chevrons />
          </div>
        </div>
      </div>
    </footer>
  );
}
