import request from 'supertest';
import { afterEach, describe, expect, it } from 'vitest';
import { CORS_ORIGIN, createTestContext } from './helpers.js';

let ctx;
afterEach(() => ctx.prisma.$disconnect());

describe('health', () => {
  it('answers liveness', async () => {
    ctx = await createTestContext();
    const res = await request(ctx.app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('creates a request id and reuses the one sent by the client', async () => {
    ctx = await createTestContext();
    const created = await request(ctx.app).get('/health');
    expect(created.headers['x-request-id']).toBeTruthy();
    const reused = await request(ctx.app).get('/health').set('X-Request-ID', 'abc-123');
    expect(reused.headers['x-request-id']).toBe('abc-123');
  });

  it('keeps CORS headers on errors', async () => {
    ctx = await createTestContext();
    const res = await request(ctx.app).get('/nope').set('Origin', CORS_ORIGIN);
    expect(res.status).toBe(404);
    expect(res.headers['access-control-allow-origin']).toBe(CORS_ORIGIN);
  });
});
