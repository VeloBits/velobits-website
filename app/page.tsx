import { Suspense } from "react";
import CursorGlow from "@/components/ui/CursorGlow";
import ScrollReveal from "@/components/ui/ScrollReveal";
import FabricBackground from "@/components/ui/FabricBackground";
import ScrollPet from "@/components/ui/ScrollPet";
import Navbar from "@/components/layout/Navbar";
import ScrollToHash from "@/components/layout/ScrollToHash";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/ui/Marquee";
import Products from "@/components/sections/Products";
import CommunityPulse from "@/components/sections/CommunityPulse";
import About from "@/components/sections/About";
import Roadmap from "@/components/sections/Roadmap";
import LatestUpdates from "@/components/sections/LatestUpdates";
import Waitlist from "@/components/sections/Waitlist";
import Footer from "@/components/layout/Footer";
import { SECTION } from "@/lib/ui-classes";

/**
 * `data-pet-perch` marks a landing spot for ScrollPet. Keeping them declared
 * here rather than inside each section means the pet's route is legible in one
 * place, and a section can be added to the page without touching the pet.
 *
 * The gradient DIVIDER rules between sections are gone: the fabric background
 * now separates sections, and a stack of identical accent lines was the main
 * thing making every section feel like the same section.
 */
export default function Home() {
  return (
    <>
      <ScrollToHash />
      <ScrollReveal />
      <CursorGlow />
      <FabricBackground />
      <ScrollPet />
      <Navbar />
      <main className="relative z-1 flex-1">
        <div data-pet-perch>
          <Hero />
        </div>
        <Marquee />
        <div data-pet-perch>
          <Products />
        </div>
        <CommunityPulse />
        <About />
        <Roadmap />
        <Suspense fallback={<div className={SECTION} aria-hidden="true" />}>
          <div data-pet-perch>
            <LatestUpdates />
          </div>
        </Suspense>
        <div data-pet-perch>
          <Waitlist />
        </div>
      </main>
      <Footer />
    </>
  );
}
