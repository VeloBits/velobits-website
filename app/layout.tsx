import type { Metadata } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { brand } from "@/lib/site-content";
import { THEME_INIT_SCRIPT } from "@/components/ui/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Self-hosted rather than a <link> to fonts.googleapis.com. The external
// stylesheet was render-blocking and added two extra connections on the
// critical path; next/font inlines the @font-face and preloads the file.
const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Velobits: Revon Group Motorcycle Ride App",
  description:
    "Revon puts your whole riding group on one live map, with rider hand signals, SOS and regroup points. By Velobits, makers of FixMyText. Join the Revon waitlist.",
  keywords: [
    "Velobits",
    "Revon",
    "group motorcycle ride app",
    "live location for riders",
    "motorcycle convoy",
    "rider SOS",
    "FixMyText",
    "waitlist",
  ],
  alternates: {
    canonical: "https://velobits.dev/",
  },
  openGraph: {
    title: "Velobits: Revon Group Motorcycle Ride App",
    description:
      "Revon puts your whole riding group on one live map, with rider hand signals, SOS and regroup points. By Velobits, makers of FixMyText. Join the Revon waitlist.",
    url: "https://velobits.dev/",
    siteName: "Velobits",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Velobits: Revon Group Motorcycle Ride App",
    description:
      "Revon puts your whole riding group on one live map, with rider hand signals, SOS and regroup points. By Velobits, makers of FixMyText. Join the Revon waitlist.",
  },
  metadataBase: new URL("https://velobits.dev"),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: brand.name,
      url: brand.domain,
      logo: `${brand.domain}${brand.logo.src}`,
      description: brand.description,
      sameAs: [brand.socialLinks.github, brand.socialLinks.twitter],
    },
    {
      "@type": "WebSite",
      name: brand.name,
      url: brand.domain,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: THEME_INIT_SCRIPT sets data-theme on <html>
    // before React hydrates, so the client tree legitimately differs from the
    // server tree by that one attribute.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} h-full antialiased`}
    >
      <head>
        {/* Must run before first paint so a stored preference never flashes. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <meta name="theme-color" content="#faf9f6" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
      <Analytics />
    </html>
  );
}
