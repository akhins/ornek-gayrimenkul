import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "placehold.co" },
    ],
  },
  async redirects() {
    return [
      {
        source: '/.env',
        destination: '/',
        permanent: true,
      },
      {
        source: '/.env.:path*',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
