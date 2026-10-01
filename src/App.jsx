import SiteNav from "./components/layout/SiteNav";
import Footer from "./components/layout/Footer";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Events from "./components/sections/Events";
import Speakers from "./components/sections/Speakers";
import Schedule from "./components/sections/Schedule";
import Sponsors from "./components/sections/Sponsors";
import Gallery from "./components/sections/Gallery";
import Faqs from "./components/sections/Faqs";
import RegisterCta from "./components/sections/RegisterCta";
import { useLenis } from "./motion/useLenis";

export default function App() {
  useLenis();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />
      <main className="flex-1">
        <Hero />
        <About />
        <Events />
        <Speakers />
        <Schedule />
        <Sponsors />
        <Gallery />
        <Faqs />
        <RegisterCta />
      </main>
      <Footer />
    </div>
  );
}
