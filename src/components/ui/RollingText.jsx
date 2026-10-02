import { RollingNumber } from "./RollingNumber";

// Rolling Text in gallery header
export function RollingText({ value, direction = 1, className = "", ...rest }) {
  return (
    <RollingNumber
      value={value}
      direction={direction}
      pad={0}
      className={className}
      {...rest}
    />
  );
}
