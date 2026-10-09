import { scrollToTop } from "../../motion";
import { hosts } from "../../content";

const [, gtbit] = hosts;

export function HostMarks({ onNavigate } = {}) {
  const handleClick = (e) => {
    e.preventDefault();
    onNavigate?.();
    scrollToTop();
  };

  return (
    <div className="flex shrink-0 items-center gap-3 xl:gap-4">
      <a
        href="#home"
        onClick={handleClick}
        aria-label={`${gtbit.navMark.alt} — back to top`}
        className="group flex items-center"
      >
        <img
          src={gtbit.navMark.src}
          alt=""
          width={gtbit.navMark.width}
          height={gtbit.navMark.height}
          className="h-7 sm:h-8 md:h-9 w-auto object-contain transition-opacity duration-(--duration-fast) group-hover:opacity-70 lg:h-9 xl:h-14"
        />
      </a>
      <img
        src={gtbit.navSeal.src}
        alt={gtbit.navSeal.alt}
        width={gtbit.navSeal.width}
        height={gtbit.navSeal.height}
        className="hidden h-10 w-auto object-contain lg:block xl:h-14"
      />
    </div>
  );
}
