import type { NextConfig } from "next";
// const { withTurbo } = require('@turbo/next');
const nodeExternals = require('webpack-node-externals');

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@prisma/client', '@resume/db'],
  
  outputFileTracingIncludes: {
    '/apps/resume': [
      '../../packages/database/generated/**/*',
      '../../node_modules/@prisma/engines/**/*'
    ]
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Use webpack-node-externals for server bundle
      config.externals = [
        nodeExternals({
          allowlist: [/@prisma\/client/],
        }),
        ...(config.externals || [])
      ];
      
      // Add special handling for Prisma
      config.module.rules.push({
        test: /\.prisma$/,
        loader: 'null-loader'
      });
    }
    
    return config;
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
