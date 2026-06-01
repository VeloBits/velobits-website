import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { brand } from "@/lib/site-content";

// Vercel Analytics is used to track page views and other analytics data.
// It is included in the RootLayout so that it is available on all pages of the application.
import { Analytics } from "@vercel/analytics/next";

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

export const metadata: Metadata = {
  title: "Velobits: FixMyText AI Writing Assistant",
  description:
    "Velobits builds FixMyText, an AI writing assistant for grammar fixes, sentence rewriting, and tone improvement. Join the FixMyText waitlist.",
  keywords: [
    "Velobits",
    "FixMyText",
    "AI writing assistant",
    "grammar fixer",
    "sentence rewriter",
    "tone improvement",
    "waitlist",
  ],
  alternates: {
    canonical: "https://velobits.dev/",
  },
  openGraph: {
    title: "Velobits: FixMyText AI Writing Assistant",
    description:
      "Velobits builds FixMyText, an AI writing assistant for grammar fixes, sentence rewriting, and tone improvement. Join the FixMyText waitlist.",
    url: "https://velobits.dev/",
    siteName: "Velobits",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Velobits: FixMyText AI Writing Assistant",
    description:
      "Velobits builds FixMyText, an AI writing assistant for grammar fixes, sentence rewriting, and tone improvement. Join the FixMyText waitlist.",
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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
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
