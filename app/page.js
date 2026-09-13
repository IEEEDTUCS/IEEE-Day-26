import Hero from "../components/Hero";
import AboutSection from "../components/AboutSection";
import EventsSection from "../components/EventsSection";
import ChaptersSection from "../components/ChaptersSection";
import FacultySection from "../components/FacultySection";
import CouncilSection from "../components/CouncilSection";
import FooterSection from "../components/FooterSection";
import SiteNav from "../components/SiteNav";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main>
      <Hero />
      <AboutSection />
      <EventsSection />
      <ChaptersSection />
      <FacultySection />
      <CouncilSection />
      <FooterSection />
      </main>
    </>
  );
}
