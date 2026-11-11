import FabricBackground from "@/components/ui/FabricBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

/** Chrome for the invite page, matching the rest of the site. */
export default function JoinLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FabricBackground />
      <Navbar />
      <main className="relative z-1 flex-1">{children}</main>
      <Footer />
    </>
  );
}
