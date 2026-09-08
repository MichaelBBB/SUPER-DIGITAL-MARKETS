/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.peachpayments.com https://pnc43975.jscrambler.com https://cdn.peachpayments.com; style-src 'self' 'unsafe-inline' https://*.peachpayments.com https://fonts.googleapis.com; frame-src 'self' https://*.peachpayments.com https://secure.peachpayments.com; connect-src 'self' https://*.peachpayments.com wss://*.peachpayments.com; img-src 'self' data: https://*.peachpayments.com https://fonts.gstatic.com; font-src 'self' data: https://fonts.gstatic.com;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
