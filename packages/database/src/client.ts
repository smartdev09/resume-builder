import { PrismaClient } from "@prisma/client";

// Extend PrismaClient if you have custom extensions
const prismaClientSingleton = () => {
  return new PrismaClient().$extends({
    // Add your Prisma client extensions here, if any
  });
};

// Type definition for the singleton
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// Global object to ensure a single instance in development
const globalForPrisma = global as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

// Initialize Prisma client
export const prisma =
  globalForPrisma.prisma ?? prismaClientSingleton();

// Prevent reinitialization in development mode
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
