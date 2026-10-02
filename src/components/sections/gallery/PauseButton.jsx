import { IconButton } from "./IconButton";

function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <rect x="2" y="1" width="3.5" height="12" fill="currentColor" />
      <rect x="8.5" y="1" width="3.5" height="12" fill="currentColor" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M2.5 1 12.5 7l-10 6Z" fill="currentColor" />
    </svg>
  );
}

// Pause button for gallery
export function PauseButton({
  playing,
  onToggle,
  size = 44,
  subject = "automatic replay",
  className = "",
}) {
  return (
    <IconButton
      variant="paper"
      size={size}
      label={`${playing ? "Pause" : "Resume"} ${subject}`}
      aria-pressed={!playing}
      onClick={onToggle}
      className={className}
    >
      {playing ? <PauseIcon /> : <PlayIcon />}
    </IconButton>
  );
}
