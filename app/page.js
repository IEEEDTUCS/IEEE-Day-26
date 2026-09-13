import Hero from "../components/Hero";
import AboutSection from "../components/AboutSection";
import EventsSection from "../components/EventsSection";
import FacultySection from "../components/FacultySection";
import CouncilSection from "../components/CouncilSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <AboutSection />
      <EventsSection />
      <FacultySection />
      <CouncilSection />
    </main>
  );
}
