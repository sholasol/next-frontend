import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000', // Match your Laravel backend port
        pathname: '/storage/**', // Match the path used in your URLs
      },
      // {
      //   protocol: 'https',
      //   hostname: 'your-production-domain.com', // Add your production domain
      //   pathname: '/storage/**',
      // },
    ],
  },
};

export default nextConfig;
