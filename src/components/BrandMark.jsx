export default function BrandMark() {
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <a href="#top" onClick={scrollToTop} aria-label="IEEE DTU home" className="group flex items-center gap-3">
      <img
        src="/logos/ieee_dtu_white.png"
        alt="IEEE DTU"
        width={166}
        height={46}
        className="h-9 w-auto object-contain transition-opacity group-hover:opacity-80"
      />
    </a>
  );
}
