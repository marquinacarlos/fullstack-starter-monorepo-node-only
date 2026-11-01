import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@prisma/client';

/** The only database connection of the API: one Prisma client on the SQLite file. */
export function createPrisma(databasePath) {
  mkdirSync(dirname(databasePath), { recursive: true });
  return new PrismaClient({ adapter: new PrismaBetterSqlite3({ url: `file:${databasePath}` }) });
}
