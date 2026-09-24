import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["motion"],
  images: {
    unoptimized: true,
  },
  devIndicators: false,
};

export default nextConfig;
