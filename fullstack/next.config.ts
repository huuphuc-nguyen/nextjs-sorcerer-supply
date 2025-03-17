import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow all HTTPS image sources
      },
    ],
  },
};

export default nextConfig;
