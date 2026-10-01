import { scrollToTop } from "../../motion/useLenis";

export default function BrandMark() {
  const handleClick = (e) => {
    e.preventDefault();
    scrollToTop();
  };

  return (
    <a
      href="#home"
      onClick={handleClick}
      aria-label="IEEE DTU home"
      className="group flex items-center gap-3"
    >
      <img
        src="/logos/ieee_dtu_black.png"
        alt="IEEE DTU Student Branch logo"
        width={166}
        height={46}
        className="h-9 w-auto object-contain transition-opacity group-hover:opacity-70"
      />
    </a>
  );
}
