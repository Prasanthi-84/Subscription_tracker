/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api/v1";
    // Extract the origin (scheme + host) from the API URL
    const apiOrigin = new URL(apiUrl).origin;

    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data: blob:",
      "img-src 'self' data: blob:",
      `connect-src 'self' ${apiOrigin}`,
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: csp,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
