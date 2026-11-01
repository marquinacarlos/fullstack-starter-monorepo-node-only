import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globalSetup: ['./tests/global-setup.js'],
    // All test files share one SQLite file, so they run one after another.
    fileParallelism: false,
  },
});
