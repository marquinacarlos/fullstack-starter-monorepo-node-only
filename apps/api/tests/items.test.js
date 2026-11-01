import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTestContext } from './helpers.js';

let ctx;
beforeEach(async () => {
  ctx = await createTestContext();
});
afterEach(() => ctx.prisma.$disconnect());

const url = '/api/v1/items';

describe('items CRUD', () => {
  it('starts empty', async () => {
    const res = await request(ctx.app).get(url);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('creates, reads, updates and deletes', async () => {
    const created = await request(ctx.app).post(url).send({ name: '  Milk ', description: 'Cold' });
    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({ name: 'Milk', description: 'Cold' });
    expect(new Date(created.body.createdAt).toISOString()).toBe(created.body.createdAt);

    const id = created.body.id;
    expect((await request(ctx.app).get(`${url}/${id}`)).body.name).toBe('Milk');

    const updated = await request(ctx.app).patch(`${url}/${id}`).send({ name: 'Oat milk' });
    expect(updated.body).toMatchObject({ name: 'Oat milk', description: 'Cold' });

    expect((await request(ctx.app).delete(`${url}/${id}`)).status).toBe(204);
    expect((await request(ctx.app).get(`${url}/${id}`)).status).toBe(404);
  });

  it('rejects an empty or too long name with 422', async () => {
    for (const name of ['', '   ', 'x'.repeat(101)]) {
      const res = await request(ctx.app).post(url).send({ name });
      expect(res.status).toBe(422);
      expect(res.body.details[0].path).toBe('name');
    }
  });

  it('answers 404 for a missing or invalid id', async () => {
    expect((await request(ctx.app).get(`${url}/999`)).status).toBe(404);
    expect((await request(ctx.app).patch(`${url}/999`).send({ name: 'x' })).status).toBe(404);
    expect((await request(ctx.app).delete(`${url}/999`)).status).toBe(404);
    expect((await request(ctx.app).delete(`${url}/abc`)).status).toBe(404);
  });

  it('answers 400 for broken JSON', async () => {
    const res = await request(ctx.app)
      .post(url)
      .set('Content-Type', 'application/json')
      .send('{bad');
    expect(res.status).toBe(400);
  });
});
