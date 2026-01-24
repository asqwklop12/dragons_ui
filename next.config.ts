import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const apiUrl = process.env.SERVER_API_URL || "http://localhost:8089";
    console.log(`[Next.js] Proxying /api requests to: ${apiUrl}`);

    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
