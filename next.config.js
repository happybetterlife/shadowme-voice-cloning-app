/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['elevenlabs'],
  webpack: (config) => {
    config.externals = [...config.externals, 'canvas', 'jsdom'];
    return config;
  },
  env: {
    ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY,
    NEXT_PUBLIC_SUPABASE_URL: 'https://zxyvqsevekrhwzjulyaq.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4eXZxc2V2ZWtyaHd6anVseWFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NTMzNDgsImV4cCI6MjA2ODIyOTM0OH0.1uG9-dGGkuiFFWz0zxtjN54dPjMxbSWjii0n9SC-KgY',
  },
}

module.exports = nextConfig