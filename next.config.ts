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
    ];
  },
};

export default nextConfig;
