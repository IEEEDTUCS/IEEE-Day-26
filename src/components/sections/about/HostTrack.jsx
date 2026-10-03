// Badge
const BADGE =
  "[clip-path:polygon(12px_0,100%_0,calc(100%_-_12px)_100%,0_100%)] bg-red font-heading font-black italic uppercase text-paper";

const DASH = "block flex-none bg-track";

export function HostTrack() {
  return (
    <>
      <span className="sr-only">and</span>

      {/* Tablet and up*/}
      <div
        aria-hidden="true"
        className="relative hidden flex-[0_0_clamp(72px,10vw,150px)] items-center md:flex"
      >
        <div
          data-ab-track
          data-axis="x"
          className="relative flex h-9 w-full origin-left items-center overflow-hidden border-y-2 border-steel"
        >
          <div className="flex w-full justify-between gap-2 px-1">
            {Array.from({ length: 9 }, (_, i) => (
              <span key={i} className={`${DASH} h-0.5 w-2.5`} />
            ))}
          </div>
          <div
            data-ab-shuttle
            data-axis="x"
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="block size-3 rounded-dot border-[3px] border-paper bg-red" />
          </div>
        </div>
        <div
          data-ab-badge
          className={`absolute left-1/2 top-1/2 -ml-7 -mt-7 flex size-14 items-center justify-center text-[32px] ${BADGE}`}
        >
          ×
        </div>
      </div>

      {/* Phones*/}
      <div
        aria-hidden="true"
        className="relative z-2 -my-1 flex h-9 justify-center md:hidden"
      >
        <div
          data-ab-track
          data-axis="y"
          className="relative flex h-full w-9 origin-top flex-col items-center justify-between overflow-hidden border-x-2 border-steel py-1.5"
        >
          <span className={`${DASH} h-2 w-0.5`} />
          <span className={`${DASH} h-2 w-0.5`} />
          <div
            data-ab-shuttle
            data-axis="y"
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="block size-3 rounded-dot border-[3px] border-paper bg-red" />
          </div>
        </div>
        <div
          data-ab-badge
          className={`absolute left-1/2 top-1/2 -ml-5.75 -mt-5 flex h-10 w-11.5 items-center justify-center text-[26px] ${BADGE}`}
        >
          ×
        </div>
      </div>
    </>
  );
}
