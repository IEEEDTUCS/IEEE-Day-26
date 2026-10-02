import { forwardRef } from "react";

// Horizontal dot grid, used in gallery to indicate which image is active
export const DotGrid = forwardRef(function DotGrid(
  { count = 6, redIndex = 0, size = 8, gap = 10, className = "" },
  ref,
) {
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`inline-flex items-center ${className}`}
      style={{ gap }}
    >
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          data-dot={i}
          className={`block rounded-dot ${i === redIndex ? "bg-red" : "bg-silver"}`}
          style={{ width: size, height: size }}
        />
      ))}
    </span>
  );
});
