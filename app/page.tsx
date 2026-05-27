import CursorGlow from "@/components/ui/CursorGlow";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/ui/Marquee";
import Products from "@/components/sections/Products";
import CommunityPulse from "@/components/sections/CommunityPulse";
import About from "@/components/sections/About";
import Roadmap from "@/components/sections/Roadmap";
import Waitlist from "@/components/sections/Waitlist";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <CursorGlow />
      <Navbar />
      <main style={{ flex: 1 }}>
        <Hero />
        <Marquee />
        <Products />
        <div className="divider" style={{ margin: "0 2rem" }} />
        <CommunityPulse />
        <div className="divider" style={{ margin: "0 2rem" }} />
        <About />
        <div className="divider" style={{ margin: "0 2rem" }} />
        <Roadmap />
        <div className="divider" style={{ margin: "0 2rem" }} />
        <Waitlist />
      </main>
      <Footer />
    </>
  );
}
