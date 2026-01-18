import 'server-only';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as { 
  prisma?: PrismaClient;
  pool?: Pool;
};

// Create connection pool if it doesn't exist
if (!globalForPrisma.pool) {
  globalForPrisma.pool = new Pool({ connectionString: process.env.DATABASE_URL });
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    adapter: new PrismaPg(globalForPrisma.pool)
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
