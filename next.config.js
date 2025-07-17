/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'books.google.com',
        port: '',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'covers.openlibrary.org',
        port: '',
        pathname: '**'
      }
    ]
  }
};

module.exports = nextConfig;
