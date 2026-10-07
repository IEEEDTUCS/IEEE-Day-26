import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { BrandMark } from "./BrandMark";
import { HostMarks } from "./HostMarks";
import { Button } from "../ui";
import { scrollToSection } from "../../motion";
import { navLinks, sections } from "../../content";

export function SiteNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const headerRef = useRef(null);
  const barRef = useRef(null);

  // Publish the nav height so scroll offsets can't drift out of sync.
  useEffect(() => {
    const header = headerRef.current;
    const bar = barRef.current;
    if (!header || !bar) return undefined;

    // The bar only — an open mobile menu must not inflate the scroll offset.
    const publish = () => {
      const border = header.offsetHeight - header.clientHeight;
      document.documentElement.style.setProperty(
        "--nav-height",
        `${bar.offsetHeight + border}px`,
      );
    };

    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(bar);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = sections.map((s) => s.id).reverse();
      const scrollPosition = window.scrollY + 220;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (id) => (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50 border-b border-silver bg-paper"
    >
      <div
        ref={barRef}
        className="container-page flex items-center justify-between gap-4 py-4 xl:py-4.5"
      >
        <BrandMark onNavigate={() => setMobileMenuOpen(false)} />

        {/* Desktop Navigation */}
        <nav
          className="hidden items-center gap-3 text-label font-semibold uppercase tracking-[0.08em] text-charcoal lg:flex xl:gap-6"
          aria-label="Primary navigation"
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.label}
                href={`#${link.id}`}
                onClick={handleScrollTo(link.id)}
                aria-current={isActive ? "true" : undefined}
                className={`relative py-1 transition-colors duration-(--duration-fast) hover:text-red ${
                  isActive ? "text-red" : ""
                }`}
              >
                {link.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-1 h-[3px] bg-red"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right side: Host marks, CTA, and Mobile menu toggle */}
        <div className="flex shrink-0 items-center gap-3 lg:gap-4 xl:gap-5">
          <span aria-hidden="true" className="hidden h-9 w-px bg-silver lg:block xl:h-12" />
          <HostMarks onNavigate={() => setMobileMenuOpen(false)} />
          <span aria-hidden="true" className="hidden h-9 w-px bg-silver lg:block xl:h-12" />
          <Button
            onClick={(e) => { e.preventDefault(); scrollToSection("register"); }}
            trailing="↗"
            className="hidden whitespace-nowrap cursor-pointer lg:inline-flex"
          >
            Register
          </Button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="grid h-11 w-11 place-items-center border border-charcoal text-charcoal transition-colors duration-(--duration-fast) hover:bg-charcoal hover:text-paper lg:hidden"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="container-page border-t border-silver bg-paper py-4 lg:hidden">
          <nav
            className="flex flex-col text-label font-semibold uppercase tracking-[0.08em]"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.label}
                  href={`#${link.id}`}
                  onClick={handleScrollTo(link.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={`border-l-[3px] px-4 py-3.5 transition-colors duration-(--duration-fast) ${
                    isActive
                      ? "border-red bg-silver text-red"
                      : "border-transparent text-charcoal hover:bg-silver"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
