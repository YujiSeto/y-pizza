import type { NextConfig } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: baseUrl.includes("localhost"),
    remotePatterns: [new URL(`${baseUrl}/**`)],
  },
};

export default nextConfig;
