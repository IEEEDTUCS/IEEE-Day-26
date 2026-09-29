import { useEffect } from "react";
import SiteNav from "./components/SiteNav";
import ScrollReveal from "./components/ScrollReveal";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import FAQ from "./pages/FAQ";
import Gallery from "./pages/Gallery";

export default function App() {
  useEffect(() => {
    // If URL has a hash or section pathname, scroll into view
    const hash = window.location.hash.replace("#", "");
    const pathname = window.location.pathname.replace(/^\//, "").toLowerCase();
    const targetId = hash || pathname;

    if (targetId && targetId !== "/") {
      setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-ink text-[#f5f8ff]">
      <ScrollReveal />
      <SiteNav />
      <main className="flex-1">
        <Home />
        <About />
        <Events />
        <FAQ />
        <Gallery />
      </main>
      <Footer />
    </div>
  );
}
