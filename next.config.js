/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/questions/:slug',
        destination: '/answers/:slug',
        permanent: true,
        statusCode: 308,
      },
    ]
  },
};

module.exports = nextConfig;
