import { useCallback, useEffect, useRef } from "react";
import { gsap, eases } from "../../../motion";

function Thumb({
  photo,
  number,
  total,
  active,
  onJump,
  register,
  className = "",
}) {
  return (
    <button
      type="button"
      ref={(el) => register(number - 1, el)}
      onClick={() => onJump(number - 1)}
      aria-label={`Show photo ${String(number).padStart(2, "0")} of ${total}`}
      aria-current={active ? "true" : undefined}
      className={`relative block overflow-hidden bg-pit transition-opacity duration-(--duration-base) ease-race ${
        active ? "opacity-100" : "opacity-50 hover:opacity-85"
      } ${className}`}
    >
      <img
        src={photo.thumb}
        alt=""
        width={240}
        height={180}
        loading="lazy"
        decoding="async"
        style={{ objectPosition: photo.focal }}
        className="h-full w-full object-cover"
      />
    </button>
  );
}

// Single strip marker
function Marker({ markerRef }) {
  return (
    <span
      ref={markerRef}
      aria-hidden="true"
      className="pointer-events-none invisible absolute left-0 top-0 border-2 border-red"
    >
      <span className="absolute inset-x-0 bottom-0 h-[3px] bg-red" />
    </span>
  );
}

// Animation that moves marker
function useGlidingMarker({ strip, marker, index, reduced }) {
  const thumbs = useRef([]);
  const placed = useRef(false);

  const register = useCallback((i, el) => {
    thumbs.current[i] = el;
  }, []);

  useEffect(() => {
    const place = (animate) => {
      const box = strip.current;
      const dot = marker.current;
      const target = thumbs.current[index];
      // A thumb in the strip its breakpoint has hidden has no offsetParent.
      if (!box || !dot || !target || !target.offsetParent) return;

      const a = target.getBoundingClientRect();
      const b = box.getBoundingClientRect();
      const x = a.left - b.left;
      const y = a.top - b.top;

      if (animate && !reduced && placed.current) {
        gsap.to(dot, { x, y, duration: 0.45, ease: eases.snap });
      } else {
        gsap.set(dot, { x, y, width: a.width, height: a.height, autoAlpha: 1 });
      }
      placed.current = true;
    };

    place(true);
    const onResize = () => place(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [index, marker, reduced, strip]);

  return register;
}

// Full thumbnail filmstrip
export function Filmstrip({ photos, index, onJump, reduced }) {
  const total = photos.length;
  const wideStrip = useRef(null);
  const wideMarker = useRef(null);
  const narrowStrip = useRef(null);
  const narrowMarker = useRef(null);

  const registerWide = useGlidingMarker({
    strip: wideStrip,
    marker: wideMarker,
    index,
    reduced,
  });
  const registerNarrow = useGlidingMarker({
    strip: narrowStrip,
    marker: narrowMarker,
    index,
    reduced,
  });

  return (
    <>
      {/* Desktop — all ten in a single row */}
      <div
        data-lb-strip
        ref={wideStrip}
        className="relative hidden h-[104px] shrink-0 items-center justify-center gap-2 px-10 lg:flex"
      >
        {photos.map((photo, i) => (
          <Thumb
            key={photo.src}
            photo={photo}
            number={i + 1}
            total={total}
            active={i === index}
            onJump={onJump}
            register={registerWide}
            className="aspect-[3/2] w-full max-w-[108px] flex-1"
          />
        ))}
        <Marker markerRef={wideMarker} />
      </div>

      {/* Mobile — every photo, five across */}
      <div
        data-lb-strip
        ref={narrowStrip}
        className="relative grid shrink-0 grid-cols-5 gap-[5px] px-4 pb-5 lg:hidden"
      >
        {photos.map((photo, i) => (
          <Thumb
            key={photo.src}
            photo={photo}
            number={i + 1}
            total={total}
            active={i === index}
            onJump={onJump}
            register={registerNarrow}
            className="aspect-[4/3] w-full"
          />
        ))}
        <Marker markerRef={narrowMarker} />
      </div>
    </>
  );
}
