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
      {
        protocol: "https",
        hostname: "wiki.uc.ac.id",
        port: "",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
