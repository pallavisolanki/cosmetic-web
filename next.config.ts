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
              ? "script-src 'self' 'unsafe-eval' 'unsafe-inline';"
              : "script-src 'self';", // stricter in production
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
