import FabricBackground from "@/components/ui/FabricBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

/**
 * `?embed=1` support. The Revon app opens these pages in a WebView and wants the
 * document only: no navbar, footer or background, in the phone's colour scheme.
 *
 * The script runs while the body is still being parsed, before the first paint,
 * and only sets `data-embed` on <html>. globals.css does the hiding, so there is
 * no redirect and no flash of the site chrome. Links between legal pages keep
 * `?embed=1` through a capture-phase click handler, which avoids rewriting hrefs
 * that React has already rendered (and the hydration warning that would cause).
 */
export const EMBED_SCRIPT = `(function(){try{
var q=new URLSearchParams(location.search);if(q.get("embed")!=="1")return;
var d=document.documentElement;d.setAttribute("data-embed","");d.removeAttribute("data-theme");
document.addEventListener("click",function(e){
var a=e.target&&e.target.closest&&e.target.closest("a[href]");if(!a)return;
var h=a.getAttribute("href");if(!h||h.charAt(0)!=="/"||a.target==="_blank")return;
var u=new URL(h,location.origin);if(u.searchParams.get("embed")==="1")return;
u.searchParams.set("embed","1");e.preventDefault();e.stopPropagation();
location.assign(u.pathname+u.search+u.hash);
},true);
}catch(e){}})();`;

/**
 * Chrome for the standalone legal pages (Revon privacy, terms, account deletion,
 * and the Velobits cookie and payment policies). Static, server-rendered content:
 * no login, no geo checks.
 */
export default function LegalChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: EMBED_SCRIPT }} />
      <div data-site-chrome>
        <FabricBackground />
        <Navbar />
      </div>
      <main className="relative z-1 flex-1">{children}</main>
      <div data-site-chrome>
        <Footer />
      </div>
    </>
  );
}
