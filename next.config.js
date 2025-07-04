/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,       // Enables React strict mode for highlighting issues
  swcMinify: true,             // Use Next.js SWC compiler for minification
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  // Future config options can be added here, e.g. redirects, rewrites
};

module.exports = nextConfig;
