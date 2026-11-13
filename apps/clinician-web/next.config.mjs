/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@docaas/design-system', '@docaas/domain', '@docaas/models', '@docaas/validation'],
  reactStrictMode: true,
};

export default nextConfig;
