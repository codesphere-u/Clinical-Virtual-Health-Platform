import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  ...(process.env.STANDALONE_BUILD === 'true' ? { output: 'standalone' } : {}),
  transpilePackages: ['@aura/design-system'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
};

export default nextConfig;
