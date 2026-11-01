// DML only and idempotent: it only inserts what is missing (matched by name).
// Run with: pnpm db:seed   (refuses APP_ENV=production unless you pass --force)
// Also runs after "prisma migrate reset" (see prisma.config.js).
import { loadConfig } from '../core/config.js';
import { createPrisma } from './client.js';

const DEMO_ITEMS = [
  { name: 'First item', description: 'Created by the seed' },
  { name: 'Second item', description: 'Edit or delete it from any client' },
  { name: 'Third item', description: null },
];

/** Returns how many rows were added. Throws a clear error if the table is missing. */
export async function seed(prisma) {
  let added = 0;
  try {
    for (const item of DEMO_ITEMS) {
      const found = await prisma.$queryRaw`SELECT 1 AS found FROM items WHERE name = ${item.name}`;
      if (found.length === 0) {
        await prisma.$executeRaw`
          INSERT INTO items (name, description) VALUES (${item.name}, ${item.description})`;
        added += 1;
      }
    }
  } catch (err) {
    if (/no such table/.test(err.message)) {
      throw new Error('Table "items" is missing. Run db:migrate first.', { cause: err });
    }
    throw err;
  }
  return added;
}

// Only run when called as a script, so tests can import `seed`.
if (import.meta.url === `file://${process.argv[1]}`) {
  let prisma;
  try {
    const config = loadConfig();
    if (config.appEnv === 'production' && !process.argv.includes('--force')) {
      throw new Error('Refusing to seed in production. Use --force if you really mean it.');
    }
    prisma = createPrisma(config.databasePath);
    console.log(`${await seed(prisma)} row(s) added`);
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  } finally {
    await prisma?.$disconnect();
  }
}
