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
