# Database

Prisma with SQLite. Prisma owns the schema, the migrations and the one database connection.
Queries are raw SQL, written by hand. The file lives in `apps/api/data/` (git-ignored) and is set by
`DATABASE_PATH`. Relative paths are relative to `apps/api`.

## Raw SQL with Prisma

Each module has a `*.repository.js` that receives the Prisma client and uses tagged templates:

```js
const rows = await prisma.$queryRaw`SELECT id, name FROM items WHERE id = ${id}`; // reads, INSERT ... RETURNING
const changed = await prisma.$executeRaw`DELETE FROM items WHERE id = ${id}`; // returns affected rows
```

Values in `${}` are sent as parameters, so they are injection safe. Never build SQL by concatenating
strings. Do not use the Prisma query API (`prisma.item.findMany()`): the project rule is raw SQL.

There is one connection per process (`src/db/client.js`). The Prisma CLI (`migrate`, `studio`) is a
separate short-lived process with its own connection to the same file.

## Commands

```bash
pnpm db:migrate    # prisma migrate dev: create a migration from schema changes and apply it
pnpm db:seed       # idempotent demo rows; refuses APP_ENV=production unless --force
pnpm db:studio     # visual editor
pnpm --filter @repo/api db:deploy   # apply existing migrations (used by "pnpm dev" and "start")
pnpm --filter @repo/api db:reset    # drop everything, migrate again and seed
```

## Add a table or change one

1. Edit `apps/api/prisma/schema.prisma` (columns, relations, indexes). Use `@@map` and `@map` to keep
   snake_case table and column names.
2. Run `pnpm db:migrate` and name the migration. Prisma writes `prisma/migrations/<date>_<name>/migration.sql`.
3. Write or update the repository in `src/modules/<name>/` with raw SQL.

Commit the `prisma/migrations` folder. Need custom SQL (a CHECK, a trigger, a view)? Run
`pnpm --filter @repo/api exec prisma migrate dev --create-only`, edit the generated `.sql`, then apply it.

## Keep SQL and schema in sync

Nothing checks that your queries match the schema, except tests. Tests apply the real migrations to
a temporary database, so a wrong table or column name fails there.

## Seeds

`src/db/seed.js` uses raw SQL, only inserts what is missing (matched by `name`) and fails with a clear
message if the tables are missing. Prisma runs it after `prisma migrate reset`. Prisma does not generate
seed data: you write it.

## Dates and types

Raw queries return `id` as a number and `created_at` as a `Date`, which JSON turns into an ISO string.
Aggregates such as `COUNT(*)` come back as `BigInt`: wrap them with `Number()` before sending them as JSON.

## Tests

Tests create a throwaway SQLite file in the OS temp folder and apply the real migrations to it
(`tests/global-setup.js`). They need no extra services and never touch the development database.
