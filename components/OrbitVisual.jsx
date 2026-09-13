import Image from "next/image";

export default function OrbitVisual() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <Image
        src="/images/hero_backdrop.JPG"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 h-full w-full object-cover object-[center_42%]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-ink/60" />
      <div className="absolute inset-0 bg-electric/[.04] mix-blend-screen" />
    </div>
  );
}
