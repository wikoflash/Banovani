import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@banovani/config', '@banovani/types', '@banovani/validation'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;
