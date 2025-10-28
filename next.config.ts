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
turbo: false, // utilise Webpack pour éviter les conflits avec next-pwa
});
export default nextConfig;
