import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createPrisma } from '../src/db/client.js';
import { seed } from '../src/db/seed.js';
import { createTestContext } from './helpers.js';

let prisma;
beforeEach(async () => {
  ({ prisma } = await createTestContext());
});
afterEach(() => prisma.$disconnect());

const count = async () => Number((await prisma.$queryRaw`SELECT COUNT(*) AS n FROM items`)[0].n);

describe('seed', () => {
  it('adds the demo rows once (idempotent)', async () => {
    expect(await seed(prisma)).toBe(3);
    expect(await seed(prisma)).toBe(0);
    expect(await count()).toBe(3);
  });

  it('keeps existing rows', async () => {
    await prisma.$executeRaw`INSERT INTO items (name, description) VALUES ('First item', 'Mine')`;
    expect(await seed(prisma)).toBe(2);
    const [row] = await prisma.$queryRaw`SELECT description FROM items WHERE name = 'First item'`;
    expect(row.description).toBe('Mine');
  });

  it('reports missing tables', async () => {
    const empty = createPrisma(join(tmpdir(), `fullstack-starter-empty-${process.pid}.db`));
    await expect(seed(empty)).rejects.toThrow('Run db:migrate first');
    await empty.$disconnect();
  });
});
