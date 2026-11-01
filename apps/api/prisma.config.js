import { defineConfig } from 'prisma/config';
import { loadEnv, resolveDatabasePath } from './src/core/config.js';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations', seed: 'node src/db/seed.js' },
  datasource: { url: `file:${resolveDatabasePath(loadEnv().DATABASE_PATH)}` },
});
