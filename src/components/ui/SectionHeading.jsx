// Fixed section heading component to reuse
export function SectionHeading({ children, align = "center" }) {
  return (
    <div className={align === "center" ? "flex flex-col items-center" : ""}>
      <h2 className="text-h2 text-charcoal">{children}</h2>
      <div aria-hidden="true" className="mt-5 h-bar w-16 bg-red" />
    </div>
  );
}

export default SectionHeading;
