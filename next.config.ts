import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  images: {
    // Notion serves cover/inline images from time-limited signed S3 URLs. Allow
    // the S3 hosts (and Unsplash, used by some covers) so next/image can serve
    // them; short ISR (BLOG_REVALIDATE) keeps cached pages within the URL TTL.
    remotePatterns: [
      { protocol: "https", hostname: "*.amazonaws.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  // The blog is hidden for now: every /blog URL (pages, tags and the RSS feed)
  // goes back to the home page. The code under app/blog is untouched, so removing
  // this block brings the blog back. Temporary (307) so search engines and
  // browsers do not cache the move.
  async redirects() {
    return [
      { source: "/blog", destination: "/", permanent: false },
      { source: "/blog/:path*", destination: "/", permanent: false },
    ];
  },

  async headers() {
    const cspFrameAncestors = [
      "'self'",
      "https://velobits.dev",
      "https://www.velobits.dev",
      "https://velobits.vercel.app",
      "http://localhost:3000",
    ].join(" ");

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors ${cspFrameAncestors}`,
          },
        ],
      },
      // The legal pages are public, read-only documents that the Revon app shows
      // in a WebView and, on its web build, in an iframe, so any site may frame
      // them. These come after the site-wide rule on purpose: when several rules
      // match, the later value for the same header wins.
      {
        source: "/app/revon/:path*",
        headers: [{ key: "Content-Security-Policy", value: "frame-ancestors *" }],
      },
      {
        source: "/legal/:path*",
        headers: [{ key: "Content-Security-Policy", value: "frame-ancestors *" }],
      },
    ];
  },
};

export default nextConfig;
