/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "klikyou-das-api.demo-kota.com",
        port: "",
        pathname: "/uploads/profile/**",
      },
      {
        protocol: "https",
        hostname: "klikyou-das-api.demo-kota.com",
        port: "",
        pathname: "/uploads/settings/**",
      },
    ],
  },
};

export default nextConfig;
