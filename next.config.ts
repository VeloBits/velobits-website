import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

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
