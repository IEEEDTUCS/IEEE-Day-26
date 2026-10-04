import { hosts } from "../../content";

const [, gtbit] = hosts;

export function HostMarks() {
  return (
    <div className="flex shrink-0 items-center gap-3 xl:gap-4">
      <img
        src={gtbit.navMark.src}
        alt={gtbit.navMark.alt}
        width={gtbit.navMark.width}
        height={gtbit.navMark.height}
        className="h-10 w-auto object-contain xl:h-14"
      />
      <img
        src={gtbit.navSeal.src}
        alt={gtbit.navSeal.alt}
        width={gtbit.navSeal.width}
        height={gtbit.navSeal.height}
        className="h-10 w-auto object-contain xl:h-14"
      />
    </div>
  );
}
