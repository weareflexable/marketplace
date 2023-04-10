/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')
const bundleAnalyzer = withBundleAnalyzer({enabled: process.env.ANALYZE === 'true'})
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nftstorage.link',
        port: '',
        pathname: '/ipfs/**',
      },
    ], 
  },
};

module.exports = withBundleAnalyzer(bundleAnalyzer, nextConfig);
