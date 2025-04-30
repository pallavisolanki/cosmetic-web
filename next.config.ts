/** @type {import('next').NextConfig} */ 
const nextConfig = {
  reactStrictMode: true,

  async headers() {
    const isDev = process.env.NODE_ENV === "development";

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: isDev
              ? "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://checkout.razorpay.com;"
              : "script-src 'self' https://checkout.razorpay.com;", // allow Razorpay in prod
          },
        ],
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during the build process
  },

  webpack(config: any) {
    return config;
  },
};

module.exports = nextConfig;
