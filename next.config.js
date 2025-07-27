/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['elevenlabs'],
  webpack: (config) => {
    config.externals = [...config.externals, 'canvas', 'jsdom'];
    return config;
  }
}

module.exports = nextConfig