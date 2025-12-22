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
    // 使用 SERVER_API_URL 用于服务器端代理（Docker 内部网络）
    // 使用 NEXT_PUBLIC_API_URL 作为后备（开发环境）
    const apiUrl = process.env.SERVER_API_URL
      || process.env.NEXT_PUBLIC_API_URL
      || 'http://localhost:3001';

    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
