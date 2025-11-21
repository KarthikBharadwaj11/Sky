/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export for now to support dynamic routes
  transpilePackages: ['recharts'],
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig