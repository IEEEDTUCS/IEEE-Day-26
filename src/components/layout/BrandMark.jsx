import { scrollToTop } from "../../motion";
import { hosts } from "../../content";

const [dtu] = hosts;

export function BrandMark({ onNavigate } = {}) {
  const handleClick = (e) => {
    e.preventDefault();
    onNavigate?.();
    scrollToTop();
  };

  return (
    <div className="flex shrink-0 items-center gap-3 lg:gap-4 xl:gap-5">
      <img
        src={dtu.navSeal.src}
        alt={dtu.navSeal.alt}
        width={dtu.navSeal.width}
        height={dtu.navSeal.height}
        className="hidden h-10 w-auto object-contain lg:block xl:h-14"
      />
      <a
        href="#home"
        onClick={handleClick}
        aria-label={`${dtu.navMark.alt} — back to top`}
        className="group flex items-center"
      >
        <img
          src={dtu.navMark.src}
          alt=""
          width={dtu.navMark.width}
          height={dtu.navMark.height}
          className="h-7 sm:h-8 md:h-9 w-auto object-contain transition-opacity duration-(--duration-fast) group-hover:opacity-70 lg:h-9 xl:h-11.5"
        />
      </a>
      <span aria-hidden="true" className="hidden h-9 w-px bg-silver lg:block xl:h-12" />
    </div>
  );
}
