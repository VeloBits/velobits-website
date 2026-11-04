import LegalChrome from "@/components/legal/LegalChrome";

/** Revon-only pages: privacy policy, terms of service and account deletion. */
export default function RevonLayout({ children }: { children: React.ReactNode }) {
  return <LegalChrome>{children}</LegalChrome>;
}
