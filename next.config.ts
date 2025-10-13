import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https', 
        hostname: '*.swagstore.ca', // Allow subdomain images
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Enable subdomain support
  async rewrites() {
    return [
      // Subdomain rewriting for tenants
      {
        source: '/((?!admin|api|login-admin|request-store|_next|favicon.ico).*)',
        destination: '/tenant/:path*',
        has: [
          {
            type: 'host',
            value: '(?<subdomain>.*).swagstore.ca',
          },
        ],
      },
    ];
  },
  // Handle subdomain headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Subdomain',
            value: '${subdomain}',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
