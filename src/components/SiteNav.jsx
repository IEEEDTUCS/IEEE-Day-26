import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import BrandMark from "./BrandMark";
import { navLinks } from "../data/navigation";

export default function SiteNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("top");

  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ["footer", "gallery", "faq", "events", "about", "top"];
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

  const handleScrollTo = (href) => (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace("#", "");
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-4 sm:px-10 lg:px-16">
        <BrandMark />

        {/* Desktop Navigation */}
        <nav
          className="hidden items-center gap-7 text-xs font-semibold uppercase tracking-[0.18em] text-muted md:flex"
          aria-label="Primary navigation"
        >
          {navLinks.map((link) => {
            const sectionId = link.href.replace("#", "");
            const isActive = activeSection === sectionId;
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={handleScrollTo(link.href)}
                className={`transition-colors duration-200 hover:text-white ${
                  isActive ? "text-electric font-bold" : ""
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Desktop CTA Action Button - takes straight to footer */}
        <div className="hidden items-center md:flex">
          <a
            href="#footer"
            onClick={handleScrollTo("#footer")}
            className="rounded-full border border-electric bg-electric px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink shadow-glow transition hover:bg-signal"
          >
            Contact Us <span className="ml-1">↓</span>
          </a>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
          className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white transition hover:border-electric hover:text-electric md:hidden"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-white/10 bg-[#0b1324]/95 px-6 py-5 shadow-2xl backdrop-blur-2xl md:hidden">
          <nav className="flex flex-col gap-2 text-[11px] font-semibold uppercase tracking-[0.18em]" aria-label="Mobile navigation">
            {navLinks.map((link) => {
              const sectionId = link.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={handleScrollTo(link.href)}
                  className={`rounded-lg px-4 py-3 transition hover:bg-white/10 ${
                    isActive ? "bg-white/5 text-electric font-bold" : "text-muted hover:text-white"
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
