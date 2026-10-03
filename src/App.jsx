import { SiteNav, Footer } from "./components/layout";
import {
  Hero,
  About,
  Events,
  // Speakers,
  Schedule,
  Gallery,
  Faqs,
  RegisterCta,
} from "./components/sections";
import { useLenis } from "./motion";
import { useInitialScroll } from "./hooks";

export function App() {
  useLenis();
  useInitialScroll();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />
      <main className="flex-1">
        <Hero />
        <About />
        <Events />
        {/*<Speakers />*/}
        <Schedule />
        <Gallery />
        <Faqs />
        <RegisterCta />
      </main>
      <Footer />
    </div>
  );
}
