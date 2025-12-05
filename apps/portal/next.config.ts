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
        protocol: 'https',
        hostname: '**.clouddn.com',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
