import { Router } from 'express';
import { NotFoundError } from '../../core/errors.js';
import { createItemsRepository } from './items.repository.js';
import { createItemSchema, parseId, updateItemSchema, validate } from './items.schema.js';

export function createItemsRouter(prisma) {
  const items = createItemsRepository(prisma);
  const router = Router();

  const found = (value) => {
    if (!value) throw new NotFoundError('Item not found');
    return value;
  };

  router.get('/', async (_req, res) => {
    res.json(await items.list());
  });

  router.get('/:id', async (req, res) => {
    res.json(found(await items.get(parseId(req.params.id))));
  });

  router.post('/', async (req, res) => {
    res.status(201).json(await items.create(validate(createItemSchema, req.body)));
  });

  router.patch('/:id', async (req, res) => {
    const id = parseId(req.params.id);
    res.json(found(await items.update(id, validate(updateItemSchema, req.body))));
  });

  router.delete('/:id', async (req, res) => {
    found(await items.remove(parseId(req.params.id)));
    res.status(204).end();
  });

  return router;
}
