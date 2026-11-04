import LegalChrome from "@/components/legal/LegalChrome";

/** Velobits-wide policies that cover every app and the website. */
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return <LegalChrome>{children}</LegalChrome>;
}
