import { createApp } from '../src/app.js';
import { createPrisma } from '../src/db/client.js';
import { TEST_DB_PATH } from './test-db.js';

export const CORS_ORIGIN = 'http://localhost:5173';

/** App + Prisma client on the test file, with an empty items table. */
export async function createTestContext() {
  const config = {
    appEnv: 'test',
    port: 0,
    corsOrigins: [CORS_ORIGIN],
    databasePath: TEST_DB_PATH,
  };
  const prisma = createPrisma(config.databasePath);
  await prisma.$executeRaw`DELETE FROM items`;
  return { config, prisma, app: createApp({ config, prisma, quiet: true }) };
}
