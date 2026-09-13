import Image from "next/image";

export default function BrandMark() {
  return (
    <a href="#top" aria-label="IEEE DTU home" className="group flex items-center gap-3">
      <Image
        src="/logos/ieee_dtu_white.png"
        alt="IEEE DTU"
        width={166}
        height={46}
        priority
        className="h-9 w-auto object-contain transition-opacity group-hover:opacity-80"
      />
    </a>
  );
}
