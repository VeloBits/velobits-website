import type { NextConfig } from "next";

const allowedOrigins = [
  "velobits.dev",
  "www.velobits.dev",
  "velobits.vercel.app",
  "localhost:3000",
];

const nextConfig: NextConfig = {
  output: "standalone",

  serverActions: {
    allowedOrigins,
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
