import { execFileSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { TEST_DB_PATH } from './test-db.js';

// Creates a fresh test database from the real Prisma migrations before any test runs.
export default function setup() {
  rmSync(TEST_DB_PATH, { force: true });
  execFileSync('pnpm', ['exec', 'prisma', 'migrate', 'deploy'], {
    env: { ...process.env, DATABASE_PATH: TEST_DB_PATH },
    stdio: 'pipe',
    shell: process.platform === 'win32',
  });
}
