import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    GITHUB_REPO: process.env.GITHUB_REPO,
    DOMAIN: process.env.DOMAIN
  },
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "", // vercel blob
      }
    ]
  }
};

export default nextConfig;
