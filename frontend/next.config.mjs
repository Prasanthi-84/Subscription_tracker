/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api/v1";
    // Extract the origin (scheme + host) from the API URL
    const apiOrigin = new URL(apiUrl).origin;

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline';
              style-src 'self' 'unsafe-inline';
              font-src 'self' https://fonts.gstatic.com data:;
              img-src 'self' data:;
              connect-src 'self' ${apiOrigin}
            `.replace(/\s{2,}/g, " "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
