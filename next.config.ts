import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP:
      process.env.NEXT_PUBLIC_BASE_URL?.includes("localhost"),
    remotePatterns: [new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/**`)],
  },
};

export default nextConfig;
