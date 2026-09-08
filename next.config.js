/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            // CRITICAL FIX: Explicitly allows YOUR Supabase URL for connections AND Unsplash for images
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.peachpayments.com https://pnc43975.jscrambler.com https://cdn.peachpayments.com; style-src 'self' 'unsafe-inline' https://*.peachpayments.com https://fonts.googleapis.com; frame-src 'self' https://*.peachpayments.com https://secure.peachpayments.com; connect-src 'self' https://qrfmfvbcorbuqcdpliqs.supabase.co https://*.peachpayments.com wss://*.peachpayments.com wss://qrfmfvbcorbuqcdpliqs.supabase.co; img-src 'self' data: https://*.peachpayments.com https://images.unsplash.com https://fonts.gstatic.com; font-src 'self' data: https://fonts.gstatic.com;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
