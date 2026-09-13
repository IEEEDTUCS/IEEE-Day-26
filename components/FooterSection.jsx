import Image from "next/image";
import SocialIcon from "./SocialIcon";

const quickLinks = [
  ["Home", "/"],
  ["About Us", "/#about"],
  ["Events", "/#events"],
  ["Council", "/#council"],
  ["Join Us", "/join-now"],
];

const socials = [
  ["Instagram", "https://www.instagram.com/ieee.dtu"],
  ["LinkedIn", "https://www.linkedin.com/company/ieee-dtu/"],
  ["Facebook", "https://www.facebook.com/ieeedtu"],
];

const contacts = [
  ["Rudit Madaan", "+91 96257 01606"],
  ["Bhavit Jain", "+91 97737 25773"],
  ["Jitendra Kumar Singh", "+91 75368 21441"],
];

export default function FooterSection() {
  return (
    <footer id="footer" className="relative overflow-hidden border-t border-white/10 bg-[#050914]">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(ellipse_at_20%_20%,rgba(32,217,255,.12),transparent_28%),radial-gradient(ellipse_at_85%_70%,rgba(35,76,255,.1),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 bg-grid-fade bg-[size:72px_72px] opacity-[.025]" />

      <div className="relative mx-auto w-full max-w-[1440px] px-6 pb-8 pt-16 sm:px-10 lg:px-16">
        <div data-reveal className="flex flex-col items-center text-center">
          <Image src="/logos/ieee_dtu_white.png" alt="IEEE DTU" width={230} height={64} className="h-12 w-auto object-contain" />
          <p className="mt-4 max-w-sm text-xs uppercase tracking-[0.18em] text-muted">Fostering innovation &amp; excellence for humanity</p>
        </div>

        <div data-reveal className="mt-16 grid gap-12 border-b border-white/10 pb-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-white">Quick Links</h2>
            <div className="mt-5 h-px w-full bg-white/10" />
            <nav className="mt-5 flex flex-col items-start gap-3 text-sm text-muted" aria-label="Footer navigation">
              {quickLinks.map(([label, href]) => <a key={label} href={href} className="transition hover:text-electric">{label}</a>)}
            </nav>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-white">Follow Us</h2>
            <div className="mt-5 h-px w-full bg-white/10" />
            <div className="mt-5 flex flex-col gap-3">
              {socials.map(([label, href]) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg border border-white/10 bg-panel px-4 py-3 text-sm text-muted transition hover:border-electric/50 hover:text-white">
                  <span className="grid h-6 w-6 place-items-center rounded-full border border-electric/50 text-electric"><span className="sr-only">{label}</span><SocialIcon name={label} size={14} /></span>
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-white">Contact Us</h2>
            <div className="mt-5 h-px w-full bg-white/10" />
            <div className="mt-5 space-y-4 text-sm">
              {contacts.map(([name, phone]) => (
                <div key={name}>
                  <p className="font-semibold text-white">{name}</p>
                  <a href={`tel:${phone.replaceAll(" ", "")}`} className="mt-1 block text-muted transition hover:text-electric">⌕&nbsp; {phone}</a>
                </div>
              ))}
              <p className="pt-2 leading-6 text-muted">Delhi Technological University,<br />Shahbad Daulatpur, Main Bawana Road,<br />Delhi-110042, India</p>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-white">Join IEEE DTU</h2>
            <div className="mt-5 h-px w-full bg-white/10" />
            <p className="mt-5 text-sm leading-6 text-muted">Find your people, explore your interests, and start building what&apos;s next with us.</p>
            <a href="/join-now" className="mt-6 inline-flex items-center gap-2 rounded-full bg-electric px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-ink shadow-glow transition hover:bg-signal">Join Now <span className="text-sm">↗</span></a>
          </div>

        </div>

        <div data-reveal className="flex flex-col items-center justify-between gap-2 pt-6 text-center text-[10px] uppercase tracking-[0.12em] text-muted sm:flex-row sm:text-left">
          <p>© 2026 IEEE DTU. All rights reserved.</p>
          <p>Made with <span className="text-electric">♥</span> by IEEE WebDev Team</p>
        </div>
      </div>
    </footer>
  );
}
