import SocialIcon from "./SocialIcon";
import { scrollToSection } from "../../motion/useLenis";
import { navLinks } from "../../content/navigation";
import { contacts, socials, venue } from "../../content/contact";

/** Column heading: paper text over a red accent bar. */
function ColumnHeading({ children }) {
  return (
    <>
      <h2 className="heading-plain text-sm uppercase text-paper">{children}</h2>
      <div aria-hidden="true" className="mt-5 h-[3px] w-12 bg-red" />
    </>
  );
}

export default function Footer() {
  const handleScrollTo = (id) => (e) => {
    e.preventDefault();
    scrollToSection(id);
  };

  return (
    <footer id="contact" className="relative bg-charcoal">
      <div className="container-page pb-8 pt-16">
        <div className="flex flex-col items-center text-center">
          <img
            src="/logos/ieee_dtu_white.png"
            alt="IEEE DTU Student Branch logo"
            width={230}
            height={64}
            className="h-12 w-auto object-contain"
          />
          <p className="label-spaced mt-5 max-w-sm text-steel">
            Fostering innovation &amp; excellence for humanity
          </p>
        </div>

        <div className="mt-16 grid gap-12 border-b border-paper/15 pb-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          <div>
            <ColumnHeading>Quick Links</ColumnHeading>
            <nav
              className="mt-5 flex flex-col items-start gap-3 text-sm text-steel"
              aria-label="Footer navigation"
            >
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={`#${link.id}`}
                  onClick={handleScrollTo(link.id)}
                  className="transition-colors duration-(--duration-fast) hover:text-paper"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <ColumnHeading>Follow Us</ColumnHeading>
            <div className="mt-5 flex flex-col gap-3">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 border border-paper/20 px-4 py-3 text-sm text-steel transition-colors duration-(--duration-fast) hover:bg-paper/5 hover:text-paper"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-dot border border-paper/30 text-paper">
                    <SocialIcon name={social.name} size={14} />
                  </span>
                  {social.name}
                </a>
              ))}
            </div>
          </div>

          <div>
            <ColumnHeading>Coordinators</ColumnHeading>
            <div className="mt-5 space-y-4 text-sm">
              {contacts.map((contact) => (
                <div key={contact.name}>
                  <p className="font-semibold text-paper">{contact.name}</p>
                  <a
                    href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                    className="mt-1 block text-xs text-steel transition-colors duration-(--duration-fast) hover:text-paper"
                  >
                    {contact.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div>
            <ColumnHeading>Event Venue</ColumnHeading>
            <p className="mt-5 text-sm leading-6 text-steel">
              {venue.name}
              <br />
              {venue.address}
            </p>
            <p className="mt-3 text-xs text-steel">
              Email:{" "}
              <a
                href={`mailto:${venue.email}`}
                className="text-paper underline underline-offset-4 transition-opacity duration-(--duration-fast) hover:opacity-70"
              >
                {venue.email}
              </a>
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-2 pt-6 text-center text-[10px] uppercase tracking-[0.12em] text-steel sm:flex-row sm:text-left">
          <p>© 2026 IEEE DTU. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span aria-hidden="true" className="h-[3px] w-6 bg-red" />
            Made with <span className="text-paper">♥</span> by IEEE WebDev Team
          </p>
        </div>
      </div>
    </footer>
  );
}
