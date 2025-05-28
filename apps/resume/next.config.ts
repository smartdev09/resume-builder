import type { NextConfig } from "next";
// const { withTurbo } = require('@turbo/next');
const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin')

const nextConfig: NextConfig = {

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }
    
    // Handle canvas and other problematic modules
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
      encoding: false,
      'pdfjs-dist': 'pdfjs-dist/legacy/build/pdf',
    };

    // Externalize canvas for server-side rendering
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('canvas');
    }

    return config
  },
  experimental: {
   turbo: {
     resolveAlias: {
       canvas: './empty-module.ts',
       encoding: './empty-module.ts',
     },
   },
 },

  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    GITHUB_REPO: process.env.GITHUB_REPO,
    DOMAIN: process.env.DOMAIN,
    AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
    AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN
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
