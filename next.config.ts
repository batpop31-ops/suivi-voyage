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
  // ⚠ Forcer Webpack au lieu de Turbopack
  turbopack: {}, // nécessaire pour Next 16 + Vercel
});

export default nextConfig;