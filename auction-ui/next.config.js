/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: function (config, options) {
    if (!options.isServer) {
      config.resolve.fallback.fs = false;
    }
    config.experiments = { asyncWebAssembly: true };
    return config;
  },
  images: {
    domains: ['media.giphy.com'],
  },
};

module.exports = nextConfig;
