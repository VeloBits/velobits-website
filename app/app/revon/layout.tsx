import FabricBackground from "@/components/ui/FabricBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

/**
 * Chrome for the Revon pages (privacy policy, terms). The home page mounts its
 * own chrome in app/page.tsx, so these routes mount the same navbar and footer
 * here to match it. Static server-rendered content, no login or geo checks.
 */
export default function RevonLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FabricBackground />
      <Navbar />
      <main className="relative z-1 flex-1">{children}</main>
      <Footer />
    </>
  );
}
