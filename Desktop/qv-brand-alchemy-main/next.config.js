/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Preserve public assets
  trailingSlash: false,
};

module.exports = nextConfig;
