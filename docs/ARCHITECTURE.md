# Architecture

## Decisions

- **Monorepo, source packages.** `packages/*` are consumed as source, with no build step. Less config, faster feedback.
- **One shared client** (`packages/lib`). Web, desktop and landing call the API through it. It throws if the API URL is missing; there is no localhost fallback.
- **One shared demo** (`packages/demo`). It keeps the three clients in sync. The panels are independent: they share only the API client. To remove a feature from the demo, delete its panel in `DemoApp.jsx`.
- **Prisma + SQLite, with raw SQL.** Prisma owns the schema, the migrations and the one database connection. Queries are written by hand with `prisma.$queryRaw` and `$executeRaw` in each module's repository, not with the Prisma query API.
- **Socket.IO** for real time. Reconnection and fallbacks come built in.
- **Express 5.** Async handlers can throw; errors reach the error handler without extra code.

## API

```
src/main.js        load config, create the Prisma client, listen, attach Socket.IO
src/app.js         createApp({ config, prisma }) - no listen, no env reads
src/core/          config (zod), errors, middlewares, security placeholder
src/db/client.js   the Prisma client (SQLite adapter), one per process
src/db/seed.js     idempotent demo rows (raw SQL)
src/modules/       one folder per feature (health, items)
src/routes/        index.js (mounts /health and /api/v1) and v1.js
src/realtime/      Socket.IO channel
prisma/            schema.prisma and generated migrations/ (SQL)
```

Middleware order: CORS, request id, request logging, JSON body, routes, 404, error handler.
CORS goes first so errors keep their CORS headers.

## Endpoints

| Method and path                      | Notes                                  |
| ------------------------------------ | -------------------------------------- |
| `GET /health`                        | Liveness. Never touches the database.  |
| `GET/POST /api/v1/items`             | List and create. 422 on invalid input. |
| `GET/PATCH/DELETE /api/v1/items/:id` | 404 if missing.                        |
| Socket.IO event `counter`            | Number, every second.                  |
| Socket.IO event `echo`               | Text in, same text out.                |

Expected errors throw `PublicError` (or a subclass): one log line, no stack trace, a safe message.

## Add a module

1. Create `src/modules/<name>/` with routes, repository and schema.
2. Mount it in `src/routes/v1.js`.
3. Add its client methods in `packages/lib/src/api.js`.
4. Add a panel in `packages/demo/src` if it should appear in the clients.

A breaking change goes in a new `src/routes/v2.js`, mounted next to v1.

## Desktop

- `HashRouter`, because the packaged app loads `file://`.
- Sandboxed renderer (`contextIsolation`, no Node). The preload exposes only `window.desktop`.
- A packaged app has no dev server, so set `VITE_API_URL` in `.env.production` before `pnpm dist:desktop`.
- `electron-builder` builds for the current OS only.
- A packaged app loads from `file://` and sends `Origin: null` (checked). Without `null` in the API's `CORS_ORIGINS`, the browser blocks its requests, including Socket.IO. `.env.production.example` already has it. The dev renderer (port 5174) sends a normal origin.

## Landing

Static export (`output: "export"`). No route handlers, server actions or middleware.
The demo runs only in the browser, so `next build` works without `NEXT_PUBLIC_API_URL`.
