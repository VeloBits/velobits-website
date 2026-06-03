import CursorGlow from "@/components/ui/CursorGlow";
import BackgroundSpark from "@/components/ui/BackgroundSpark";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

/**
 * Route-group layout for /blog. The homepage chrome (cursor glow, background,
 * navbar, footer) lives in app/page.tsx — not the root layout — so blog pages
 * mount the same chrome here to match the homepage without touching it.
 */
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CursorGlow />
      <BackgroundSpark />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
