/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@aura/design-system', '@aura/domain', '@aura/models', '@aura/validation'],
  reactStrictMode: true,
};

export default nextConfig;
