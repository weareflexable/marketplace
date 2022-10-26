/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    STRIPE_PUBLIC_KEY:
      "pk_live_51LkqgnLY9m0w00gpcdDH7JaOEXQo3DYhOiLfA8Eebg2ZQhuzGpxYu9PEOcnU9qrQIjn1OyJQO9nW01GrrXfqXaZF002uirDAjV",
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
