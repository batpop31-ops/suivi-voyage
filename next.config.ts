import withPWA from "next-pwa";

export default withPWA({
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
  },
  turbopack: {},
});