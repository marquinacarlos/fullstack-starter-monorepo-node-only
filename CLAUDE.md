# Project rules

Monorepo (pnpm + Turborepo), plain JavaScript (ESM). No TypeScript, no authentication, no CI.

## Commands

- `pnpm dev`, `pnpm check` (format check, lint, tests, build), `pnpm format`.
- `pnpm bootstrap` (first run), `pnpm db:migrate`, `pnpm db:seed`.
- API only: `pnpm --filter @repo/api <script>`.

## Fixed

- Ports: api 8000, web 5173, desktop renderer 5174, landing 3000. CORS depends on them.
- Versions live in the `catalog:` of `pnpm-workspace.yaml`. Internal packages use `workspace:*`.
- Packages are consumed as source (no build). Next needs `transpilePackages`.
- Env files live in each app: `.env.development` (committed, no secrets), `.env.production.example`. `.env.local` and `.env.production` are git-ignored. No root `.env`.
- Tailwind v4 is CSS only: never create `tailwind.config.*`. Each app needs the `@source` lines in its CSS.
- `CORS_ORIGINS` has no default: the API stops at startup without it.

## API conventions

- One folder per feature in `apps/api/src/modules/<name>/` (`*.routes.js`, `*.repository.js`, `*.schema.js`).
- Versioned routes in `src/routes/v1.js`. A breaking change goes in a new `v2.js`.
- Database: Prisma + SQLite. One Prisma client (`src/db/client.js`) is the only connection.
- Queries are raw SQL (`prisma.$queryRaw` / `$executeRaw` tagged templates) in each module's `*.repository.js`. Do not use `prisma.item.findMany()` and friends.
- Schema changes: edit `apps/api/prisma/schema.prisma`, then `pnpm db:migrate`.
- Real time: Socket.IO in `src/realtime/`.
- Expected errors: throw `PublicError` (or a subclass).

## Gotchas

- pnpm blocks install scripts: native packages must be in `allowBuilds`.
- Turborepo hides undeclared env vars: declare them in `turbo.json`.
- Electron 45 has no download script of its own: `apps/desktop` runs `install-electron` in `postinstall`. Keep it.
- A packaged desktop app sends `Origin: null`: production `CORS_ORIGINS` must include `null`.
- Raw SQL must match the table and column names in `schema.prisma` (`@@map`, `@map`). Tests run the real migrations, so a mismatch fails there.
- Prisma 7 needs the SQLite adapter and `apps/api/prisma.config.js` (database path, seed command). The adapter uses `better-sqlite3` internally, which is why it is in `allowBuilds`.

## Docs

`docs/TEMPLATE.md` (monorepo), `docs/ARCHITECTURE.md`, `docs/DATABASE.md`. `README.md` is for the product being built.
