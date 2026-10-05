import { InstagramIcon, LinkedInIcon } from "./SocialIcons";

/**
 * TeamCard — F1 VIP Ticket Pass Design
 *
 * Modeled after official Formula 1 VIP Guest / Paddock Club lanyards:
 * - Woven lanyard strap & metallic clip fixture at top
 * - Die-cut slot hole
 * - Diagonal red & carbon hazard speed stripes
 * - Bold "VIP" badge with handwritten cursive "Council" overlay
 * - Framed credential portrait photo with corner telemetry marks
 * - Member name and role badge with sleek social links
 */
export function TeamCard({ member, index }) {
  const { image, name, role, instagram, linkedin } = member;
  const passNumber = String(index + 1).padStart(2, "0");

  return (
    <div className="relative pt-6 select-none group/ticket">
      {/* ─── LANYARD STRAP & METALLIC CLIP ─── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
        {/* Woven Fabric Strap */}
        <div className="lanyard-strap w-12 h-6 rounded-t-sm flex items-center justify-center overflow-hidden border-x border-t border-black/40">
          <span className="text-[7px] font-mono font-black uppercase tracking-tighter text-white/90 transform rotate-90 scale-75 whitespace-nowrap">
            F1 • IEEE
          </span>
        </div>
        {/* Metallic Clip Buckle */}
        <div className="metallic-clip w-8 h-4 rounded-sm border border-white/60 -mt-0.5 z-10 flex items-center justify-center shadow-md">
          <div className="w-4 h-1 rounded-full bg-neutral-900/70" />
        </div>
      </div>

      {/* ─── VIP PASS TICKET BODY ─── */}
      <article
        data-team-card
        className="vip-pass-card relative overflow-hidden flex flex-col bg-[#111314] text-white rounded-2xl"
        style={{ "--card-index": index }}
      >
        {/* Pass Top Slot Hole */}
        <div className="pt-3 pb-1 flex justify-center z-10">
          <div className="w-10 h-2.5 rounded-full bg-[#080909] border border-white/20 shadow-inner" />
        </div>

        {/* ─── TOP HEADER: RACING STRIPES & LOGO ─── */}
        <div className="relative px-3.5 pt-1 pb-2">
          {/* Diagonal Hazard Red Stripes Background */}
          <div className="relative h-12 w-full rounded-lg overflow-hidden border border-red-600/30 bg-[#161819]">
            <div className="absolute inset-0 bg-race-stripes opacity-90" />
            
            {/* Dark angular overlay cut */}
            <div 
              className="absolute inset-0 bg-[#0e1011]" 
              style={{ clipPath: "polygon(0 0, 70% 0, 48% 100%, 0 100%)" }}
            />

            {/* F1 / IEEE 26 Emblem */}
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 flex items-center gap-1.5">
              <span className="font-heading italic font-black text-base md:text-lg tracking-tighter text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                F1<span className="text-[#e10600]">26</span>
              </span>
              <span className="text-[8px] font-mono uppercase tracking-widest text-neutral-300 font-bold bg-black/60 px-1 py-0.5 rounded border border-white/10">
                PASS
              </span>
            </div>

            {/* Stencil 2026 Watermark */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10 select-none pointer-events-none">
              <span className="font-heading italic font-black text-2xl tracking-tighter text-white/25">
                2026
              </span>
            </div>
          </div>
        </div>

        {/* ─── CREDENTIAL PHOTO WITH TELEMETRY BRACKETS ─── */}
        <div className="px-3.5 pt-1">
          <div className="relative aspect-[4/4.6] w-full overflow-hidden rounded-xl border-2 border-neutral-800 bg-[#0c0d0e] group-hover/ticket:border-[#e10600]/60 transition-colors duration-400">
            {/* Member portrait */}
            <img
              src={`/images/council/${image}`}
              alt={name}
              loading="lazy"
              className="h-full w-full object-cover object-top transition-transform duration-700 ease-[var(--ease-race)] group-hover/ticket:scale-105"
            />

            {/* Vignette & bottom fade */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111314] via-transparent to-black/20 opacity-80" />

            {/* Telemetry Corner Brackets */}
            <div className="pointer-events-none absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#e10600]/80" />
            <div className="pointer-events-none absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#e10600]/80" />
            <div className="pointer-events-none absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#e10600]/80" />
            <div className="pointer-events-none absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#e10600]/80" />

            {/* Pass Serial Pill on Photo */}
            <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm border border-white/20 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold text-neutral-300">
              #{passNumber}
            </div>
          </div>
        </div>

        {/* ─── VIP CENTERPIECE WITH CURSIVE OVERLAY ─── */}
        <div className="relative mx-3.5 my-2.5 rounded-xl bg-gradient-to-r from-[#e10600] via-[#c51216] to-[#e10600] p-2.5 shadow-inner overflow-hidden border border-red-500/40">
          {/* Subtle background diagonal texture */}
          <div className="absolute inset-0 bg-race-stripes opacity-20" />
          
          <div className="relative flex items-center justify-between">
            {/* Bold VIP Typography */}
            <div className="relative flex items-baseline">
              <span className="font-heading font-black italic text-3xl md:text-4xl tracking-tight text-black drop-shadow-[0_2px_0_rgba(255,255,255,0.2)]">
                VIP
              </span>
              {/* Handwritten Cursive "Council" / "Guest" */}
              <span className="vip-script-overlay absolute -left-1 top-0.5 text-2xl md:text-3xl text-[#5ce1e6] font-bold select-none pointer-events-none">
                Team
              </span>
            </div>

            {/* Access Level Badge */}
            <div className="text-right flex flex-col items-end">
              <span className="text-[8px] font-black uppercase tracking-wider text-black/90 bg-white/90 px-1.5 py-0.5 rounded shadow-sm font-mono">
                PADDOCK CLUB
              </span>
              <span className="text-[7px] font-mono tracking-widest text-black/75 font-bold uppercase mt-0.5">
                ALL ACCESS PASS
              </span>
            </div>
          </div>
        </div>

        {/* ─── MEMBER INFO & SOCIALS ─── */}
        <div className="px-3.5 pb-4 pt-1 flex flex-col gap-2">
          {/* Name */}
          <h3 className="text-base md:text-lg font-heading font-black italic tracking-tight text-white line-clamp-1 group-hover/ticket:text-[#ff4d4f] transition-colors">
            {name}
          </h3>

          {/* Role Pill and Socials */}
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 bg-[#1c1f21] border border-[#e10600]/40 text-[#ff4d4f] text-[10px] font-mono font-bold tracking-wider px-2 py-1 rounded-md uppercase max-w-[170px] truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e10600] animate-pulse shrink-0" />
              <span className="truncate">{role}</span>
            </span>

            {/* Social Links */}
            <div className="flex items-center gap-1.5 shrink-0">
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${name} on Instagram`}
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-[#1a1d1e] border border-neutral-700 text-neutral-300 transition-all duration-200 hover:bg-[#e10600] hover:border-[#e10600] hover:text-white hover:shadow-[0_0_10px_rgba(225,6,0,0.5)]"
                >
                  <InstagramIcon size={12} />
                </a>
              )}
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${name} on LinkedIn`}
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-[#1a1d1e] border border-neutral-700 text-neutral-300 transition-all duration-200 hover:bg-[#e10600] hover:border-[#e10600] hover:text-white hover:shadow-[0_0_10px_rgba(225,6,0,0.5)]"
                >
                  <LinkedInIcon size={12} />
                </a>
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}