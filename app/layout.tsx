import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
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
  title: "Velobits — Software That Works For You",
  description:
    "Velobits is a startup building thoughtful, everyday software products that solve real problems. First up: FixMyText — your AI writing companion.",
  keywords: ["Velobits", "FixMyText", "software", "AI writing", "productivity tools"],
  openGraph: {
    title: "Velobits — Software That Works For You",
    description:
      "Thoughtful software products that solve real problems. Join the community and decide what we build next.",
    url: "https://velobits.dev",
    siteName: "Velobits",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Velobits — Software That Works For You",
    description: "Thoughtful everyday software. Join us at velobits.dev",
  },
  metadataBase: new URL("https://velobits.dev"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
      <Analytics />
    </html>
  );
}
