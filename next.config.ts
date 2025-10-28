import withPWA from "next-pwa";
import { NextConfig } from "next";

const nextConfig: NextConfig = withPWA({
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
  },
  // Cette ligne désactive Turbopack pour éviter le conflit
  webpack: (config) => config,
});

export default nextConfig;