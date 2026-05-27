import CursorGlow from "./components/CursorGlow";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Products from "./components/Products";
import CommunityPulse from "./components/CommunityPulse";
import About from "./components/About";
import Roadmap from "./components/Roadmap";
import Waitlist from "./components/Waitlist";
import Footer from "./components/Footer";

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
