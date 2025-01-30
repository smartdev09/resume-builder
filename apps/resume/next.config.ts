import type { NextConfig } from "next";
// const { withTurbo } = require('@turbo/next');

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@prisma/client', '@resume/db'],
  
  outputFileTracingIncludes: {
    '/apps/resume': [
      '../../packages/database/generated/**/*',
      '../../node_modules/@prisma/engines/**/*'
    ]
  },

  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    GITHUB_REPO: process.env.GITHUB_REPO,
    DOMAIN: process.env.DOMAIN,
    AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
    AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET
  },
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "**", // vercel blob
      }
    ]
  }
};

export default nextConfig;
