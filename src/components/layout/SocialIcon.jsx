// Social glyphs, drawn to match the footer prototype. Same API everywhere:
// <SocialIcon name="LinkedIn" size={18} /> inherits its colour from the button.
export function SocialIcon({ name, size = 15 }) {
  const box = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };

  if (name === "Instagram") {
    return (
      <svg {...box} fill="none" stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (name === "LinkedIn") {
    return (
      <svg {...box} fill="currentColor">
        <rect x="3" y="9" width="4" height="12" />
        <circle cx="5" cy="5" r="2.2" />
        <path d="M10 9h3.8v1.8c.6-1.1 2-2.1 4-2.1 3.6 0 4.2 2.3 4.2 5.4V21h-4v-6c0-1.5 0-3.3-2-3.3s-2.3 1.6-2.3 3.2V21H10z" />
      </svg>
    );
  }

  return (
    <svg {...box} fill="currentColor">
      <path d="M14 8V6.3c0-.8.5-1.3 1.4-1.3H17V1.5h-2.6C11.4 1.5 10 3.4 10 6v2H7.5v3.6H10V22.5h4V11.6h2.7l.4-3.6z" />
    </svg>
  );
}
