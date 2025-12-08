import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 't6mfwj8xf.hn-bkt.clouddn.com',
      },
      {
        protocol: 'http',
        hostname: 't6yfyzu7s.hn-bkt.clouddn.com',
      },
      {
        protocol: 'https',
        hostname: '**.clouddn.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/:path*`
          : 'http://localhost:3001/:path*',
      },
    ];
  },
};

export default withNextIntl(nextConfig);
