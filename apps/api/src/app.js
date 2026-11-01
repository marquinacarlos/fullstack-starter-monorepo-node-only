import express from 'express';
import {
  corsMiddleware,
  errorHandler,
  notFound,
  requestId,
  requestLogger,
} from './core/middlewares.js';
import { createRoutes } from './routes/index.js';

/**
 * Builds the Express app. It does not listen and does not read the environment,
 * so tests can create as many apps as they need.
 */
export function createApp({ config, prisma, quiet = false }) {
  const app = express();
  const log = quiet ? () => {} : undefined;

  // Order matters:
  // 1. CORS first, so even errors and 404s carry CORS headers.
  // 2. Request id, so every later log line can show it.
  // 3. Request logging, which needs the id.
  app.use(corsMiddleware(config.corsOrigins));
  app.use(requestId);
  app.use(requestLogger(log));
  app.use(express.json());

  app.use(createRoutes(prisma));

  app.use(notFound);
  app.use(errorHandler(log));
  return app;
}
