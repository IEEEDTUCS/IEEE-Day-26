// Home page — assembles every section of the IEEE Day site in scroll order
import Navbar from "../components/Navbar/Navbar.jsx";
import Landing from "../components/Landing/Landing.jsx";
import About from "../components/About/About.jsx";
import Gallery from "../components/Gallery/Gallery.jsx";
import Events from "../components/Events/Events.jsx";
import Prizes from "../components/Prizes/Prizes.jsx";
import Sponsors from "../components/Sponsors/Sponsors.jsx";
import Team from "../components/Team/Team.jsx";
import Footer from "../components/Footer/Footer.jsx";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Landing />
        <About />
        <Gallery />
        <Events />
        <Prizes />
        <Sponsors />
        <Team />
      </main>
      <Footer />
    </>
  );
}
