// Corner slab shape

const SLAB =
  "[clip-path:polygon(36px_0,100%_0,100%_100%,0_100%)] lg:[clip-path:polygon(64px_0,100%_0,100%_100%,0_100%)]";

export function CornerSlabs() {
  return (
    <div aria-hidden="true">
      <span
        data-slab
        className={`absolute -right-5 top-0 block h-9 w-42.5 bg-silver lg:-right-7.5 lg:h-15 lg:w-95 ${SLAB}`}
      />
      <span
        data-slab
        className={`absolute -right-5 top-0 block h-9 w-20 bg-charcoal lg:-right-7.5 lg:h-15 lg:w-45 ${SLAB}`}
      />
      <span
        data-slab-bar
        className="absolute right-15 top-9 block h-1 w-27.5 origin-right bg-red [clip-path:polygon(6px_0,100%_0,calc(100%-6px)_100%,0_100%)] lg:right-37.5 lg:top-15 lg:h-1.5 lg:w-57.5"
      />
    </div>
  );
}
