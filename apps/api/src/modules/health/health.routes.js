import { Router } from 'express';

export function createHealthRouter() {
  const router = Router();

  // Liveness: never touches the database.
  router.get('/', (_req, res) => {
    res.json({ status: 'ok' });
  });

  return router;
}
