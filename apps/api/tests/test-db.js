import { tmpdir } from 'node:os';
import { join } from 'node:path';

// A throwaway SQLite file: tests need no Docker and never touch the development database.
export const TEST_DB_PATH = join(tmpdir(), 'fullstack-starter-test.db');
