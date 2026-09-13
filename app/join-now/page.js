import FooterSection from "../../components/FooterSection";
import JoinPage from "../../components/JoinPage";
import SiteNav from "../../components/SiteNav";

export const metadata = {
  title: "Join IEEE DTU",
  description: "Connect with an IEEE DTU membership coordinator and join the community.",
};

export default function JoinRoute() {
  return (
    <>
      <SiteNav />
      <JoinPage />
      <FooterSection />
    </>
  );
}
