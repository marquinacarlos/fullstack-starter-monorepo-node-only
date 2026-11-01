import { Router } from 'express';
import { createItemsRouter } from '../modules/items/items.routes.js';

/**
 * API version 1: /api/v1/items.
 * A breaking change goes in a new file (v2.js) mounted next to this one in routes/index.js.
 */
export function createV1Router(prisma) {
  const router = Router();
  router.use('/items', createItemsRouter(prisma));
  return router;
}
