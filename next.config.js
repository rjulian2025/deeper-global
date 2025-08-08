/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/questions', destination: '/answers', permanent: true },
      { source: '/questions/', destination: '/answers', permanent: true },
      { source: '/questions/:slug*', destination: '/answers/:slug*', permanent: true },
    ]
  },
};

module.exports = nextConfig;
