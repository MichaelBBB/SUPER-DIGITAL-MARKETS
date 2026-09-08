/** @type {import('next').NextConfig} */
const nextConfig = {
  // We are removing the custom headers to prevent CSP blocking Supabase/Unsplash.
  // Vercel's default configuration is sufficient for this setup.
};

module.exports = nextConfig;
