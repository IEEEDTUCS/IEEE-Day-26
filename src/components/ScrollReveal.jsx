import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    const handleReveal = () => {
      const elements = document.querySelectorAll("[data-reveal]");
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.95) {
          el.classList.add("reveal-visible");
        }
      });
    };

    handleReveal();
    const timer = setTimeout(handleReveal, 100);

    window.addEventListener("scroll", handleReveal, { passive: true });
    window.addEventListener("resize", handleReveal, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleReveal);
      window.removeEventListener("resize", handleReveal);
    };
  }, []);

  return null;
}
