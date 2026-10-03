import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import BrandMark from "./BrandMark";
import { Button } from "../ui/Button";
import { scrollToSection } from "../../motion/useLenis";
import { navLinks, sections } from "../../content/navigation";

export default function SiteNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const headerRef = useRef(null);

  // Publish the nav height so scroll offsets can't drift out of sync.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return undefined;

    const publish = () => {
      document.documentElement.style.setProperty(
        "--nav-height",
        `${el.offsetHeight}px`,
      );
    };

    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(el);
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
      <div className="container-page flex items-center justify-between py-4">
        <BrandMark />

        {/* Desktop Navigation */}
        <nav
          className="hidden items-center gap-7 text-label font-semibold uppercase tracking-[0.08em] text-charcoal md:flex"
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
                className={`relative py-1 transition-colors duration-(--duration-fast) hover:text-red ${isActive ? "text-red" : ""
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

        {/* Desktop CTA Action Button - takes straight to footer */}
        <div className="hidden items-center md:flex">
          <Button
            href="#contact"
            onClick={handleScrollTo("contact")}
            trailing="↓"
          >
            Register
          </Button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
          className="grid h-11 w-11 place-items-center border border-charcoal text-charcoal transition-colors duration-(--duration-fast) hover:bg-charcoal hover:text-paper md:hidden"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="container-page border-t border-silver bg-paper py-4 md:hidden">
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
                  className={`border-l-[3px] px-4 py-3.5 transition-colors duration-(--duration-fast) ${isActive
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
