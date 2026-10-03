import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/pi",
  assetPrefix: "/pi",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
