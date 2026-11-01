import { existsSync, readFileSync } from 'node:fs';
import { isAbsolute, resolve } from 'node:path';
import { parseEnv } from 'node:util';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const API_ROOT = fileURLToPath(new URL('../../', import.meta.url));
const DEFAULT_DATABASE_PATH = './data/dev.db';

const schema = z.object({
  APP_ENV: z.string().default('development'),
  PORT: z.coerce.number().int().positive().default(8000),
  // Required on purpose: no default, so a missing value stops the API at startup.
  CORS_ORIGINS: z
    .string({ error: 'CORS_ORIGINS is required (comma separated list of origins)' })
    .min(1, 'CORS_ORIGINS is required (comma separated list of origins)'),
  DATABASE_PATH: z.string().min(1).default(DEFAULT_DATABASE_PATH),
});

function readEnvFile(name) {
  const path = resolve(API_ROOT, name);
  return existsSync(path) ? parseEnv(readFileSync(path, 'utf8')) : {};
}

/**
 * Priority: real environment variables > .env.local > .env.<APP_ENV>.
 * APP_ENV picks the file and defaults to "development".
 */
export function loadEnv(processEnv = process.env) {
  const appEnv = processEnv.APP_ENV || 'development';
  return { ...readEnvFile(`.env.${appEnv}`), ...readEnvFile('.env.local'), ...processEnv };
}

/** Relative paths are relative to apps/api, so every process opens the same file. */
export function resolveDatabasePath(path = DEFAULT_DATABASE_PATH) {
  return isAbsolute(path) ? path : resolve(API_ROOT, path);
}

export function parseConfig(env) {
  const result = schema.safeParse(env);
  if (!result.success) {
    const problems = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
    throw new Error(`Invalid configuration:\n  ${problems.join('\n  ')}`);
  }
  const config = result.data;
  return {
    appEnv: config.APP_ENV,
    port: config.PORT,
    corsOrigins: config.CORS_ORIGINS.split(',')
      .map((o) => o.trim())
      .filter(Boolean),
    databasePath: resolveDatabasePath(config.DATABASE_PATH),
  };
}

export { API_ROOT };

export function loadConfig(processEnv = process.env) {
  return parseConfig(loadEnv(processEnv));
}
