import { describe, expect, it } from 'vitest';
import { parseConfig } from '../src/core/config.js';

describe('config', () => {
  it('requires CORS_ORIGINS', () => {
    expect(() => parseConfig({})).toThrow('CORS_ORIGINS is required');
    expect(() => parseConfig({ CORS_ORIGINS: '' })).toThrow('CORS_ORIGINS is required');
  });

  it('applies defaults and parses the origin list', () => {
    const config = parseConfig({ CORS_ORIGINS: 'http://a.test, http://b.test' });
    expect(config).toMatchObject({
      appEnv: 'development',
      port: 8000,
      corsOrigins: ['http://a.test', 'http://b.test'],
    });
    expect(config.databasePath).toMatch(/apps\/api\/data\/dev\.db$/);
  });
});
