import { PrismaClient } from "@prisma/client";

/**
 * Единый экземпляр Prisma Client. В режиме разработки сохраняем его
 * в globalThis, чтобы hot reload не создавал новые подключения.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
