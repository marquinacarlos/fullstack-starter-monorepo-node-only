# Template

Start with [GETTING_STARTED.md](GETTING_STARTED.md).

Monorepo (pnpm + Turborepo, plain JavaScript). One Express API with Prisma and SQLite (queries are raw SQL), real time
with Socket.IO, and three clients that show the same demo: React (Vite), Electron and Next.js
(static export).

## Quick start

Requirements: Node 22+ and pnpm.

```bash
pnpm bootstrap   # install, create the SQLite database, add demo rows
pnpm dev         # api + web + desktop + landing
```

| App            | Port | What it is                            |
| -------------- | ---- | ------------------------------------- |
| `apps/api`     | 8000 | Express API, `/api/v1/...`, Socket.IO |
| `apps/web`     | 5173 | React + Vite + React Router           |
| `apps/desktop` | 5174 | Electron + React (dev renderer)       |
| `apps/landing` | 3000 | Next.js App Router, static export     |

Ports are fixed because the API CORS list depends on them.

## Structure

```
apps/api        Express API (modules, versioned routes, SQLite, Socket.IO)
apps/web        React client
apps/desktop    Electron client
apps/landing    Next.js client
packages/lib    API client (REST + Socket.IO helper), used by every client
packages/ui     Button, Input, Card + Tailwind v4 tokens (theme.css)
packages/demo   The demo screen shared by the three clients
docs/           Project docs
```

## Commands

| Command                                | What it does                               |
| -------------------------------------- | ------------------------------------------ |
| `pnpm dev` / `build` / `lint` / `test` | Run the task in every app (Turborepo)      |
| `pnpm check`                           | Format check, lint, tests and build        |
| `pnpm format`                          | Prettier                                   |
| `pnpm db:migrate`                      | Create and apply a migration (Prisma)      |
| `pnpm db:seed`                         | Add demo rows (idempotent)                 |
| `pnpm db:studio`                       | Open Prisma Studio                         |
| `pnpm dist:desktop`                    | Package the desktop app for the current OS |

## Environment

Env files live in each app: `.env.development` (committed, no secrets) and
`.env.production.example`. `.env.local` and `.env.production` are git-ignored. There is no root `.env`.

| App          | Variable              | Notes                                                     |
| ------------ | --------------------- | --------------------------------------------------------- |
| api          | `CORS_ORIGINS`        | Required, no default. The API stops at startup without it |
| api          | `DATABASE_PATH`       | SQLite file, default `./data/dev.db`                      |
| api          | `PORT`, `APP_ENV`     | Defaults 8000 and `development`                           |
| web, desktop | `VITE_API_URL`        | Public                                                    |
| landing      | `NEXT_PUBLIC_API_URL` | Public                                                    |

In the API, real environment variables win over `.env.local`, which wins over `.env.<APP_ENV>`.

## Not included on purpose

TypeScript, authentication (placeholder in `apps/api/src/core/security.js`), i18n, dark mode, CI,
Docker, GraphQL, automatic updates in Electron, SSR in Next.
