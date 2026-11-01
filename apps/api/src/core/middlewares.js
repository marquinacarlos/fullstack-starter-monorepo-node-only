import { randomUUID } from 'node:crypto';
import cors from 'cors';
import { NotFoundError, PublicError } from './errors.js';

export function corsMiddleware(origins) {
  return cors({ origin: origins, exposedHeaders: ['X-Request-ID'] });
}

/** Reuses the id sent by the client, otherwise creates one. */
export function requestId(req, res, next) {
  req.id = req.get('X-Request-ID') || randomUUID();
  res.set('X-Request-ID', req.id);
  next();
}

export function requestLogger(log = console.log) {
  return (req, res, next) => {
    const start = performance.now();
    res.on('finish', () => {
      const ms = Math.round(performance.now() - start);
      log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms [${req.id}]`);
    });
    next();
  };
}

export function notFound(_req, _res, next) {
  next(new NotFoundError());
}

export function errorHandler(log = console.error) {
  // Express needs the 4 arguments to treat this as an error handler.
  return (err, req, res, _next) => {
    if (err instanceof PublicError) {
      log(`${err.status} ${err.message} [${req.id}]`);
      return res.status(err.status).json({ error: err.message, details: err.details });
    }
    if (err.type === 'entity.parse.failed') {
      log(`400 Invalid JSON body [${req.id}]`);
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
    log(`500 Unhandled error [${req.id}]`, err);
    return res.status(500).json({ error: 'Internal server error' });
  };
}
