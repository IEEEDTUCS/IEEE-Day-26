import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { SiteNav, Footer } from "./components/layout";
import {
  Hero,
  About,
  Events,
  // Speakers,
  Schedule,
  Gallery,
  Teams,
  Faqs,
  RegisterCta,
} from "./components/sections";
import { useLenis, useScrollRefresh } from "./motion";
import { useInitialScroll } from "./hooks";

const CertificateClaim = lazy(() => import("./pages/CertificateClaim"));

function HomePage() {
  useLenis();
  useScrollRefresh();
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
        <Teams />
        <Faqs />
        <RegisterCta />
      </main>
      <Footer />
    </div>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/certificates"
        element={
          <Suspense
            fallback={
              <div className="min-h-screen bg-charcoal text-paper flex flex-col items-center justify-center font-mono text-xs gap-3">
                <div className="w-8 h-8 border-2 border-red border-t-transparent animate-spin" />
                <span className="tracking-widest text-steel">LOADING CREDENTIAL DESK...</span>
              </div>
            }
          >
            <CertificateClaim />
          </Suspense>
        }
      />
    </Routes>
  );
}
