import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.kaplanco.com",
        pathname: "/catalog/**",
      },
    ],
  },
};

export default nextConfig;
