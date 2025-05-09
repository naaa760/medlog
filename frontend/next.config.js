/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["img.clerk.com", "images.clerk.dev"],
  },
};

module.exports = nextConfig;
