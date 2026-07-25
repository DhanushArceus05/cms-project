/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    dirs: ['src'],
  },
  // Produces a minimal, self-contained .next/standalone server (only the
  // files/deps actually needed at runtime) used by the production Dockerfile.
  output: 'standalone',
};

export default nextConfig;
