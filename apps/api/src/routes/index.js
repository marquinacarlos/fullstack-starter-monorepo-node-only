import { Router } from 'express';
import { createHealthRouter } from '../modules/health/health.routes.js';
import { createV1Router } from './v1.js';

export function createRoutes(prisma) {
  const router = Router();
  router.use('/health', createHealthRouter());
  router.use('/api/v1', createV1Router(prisma));
  return router;
}
