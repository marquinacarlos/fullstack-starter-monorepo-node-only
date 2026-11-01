# Getting started

Read this first. It takes you from an empty folder to your own project running.

## 1. Requirements

- Node 22 or newer.
- pnpm. If you do not have it: `corepack enable` (the exact version is pinned in `package.json`).

## 2. Create your project from the template

Copy or clone this repository into a new folder, remove the old history and start your own:

```bash
rm -rf .git
git init
```

## 3. First run

```bash
pnpm bootstrap   # install, create the SQLite database, add demo rows
pnpm dev         # api + web + desktop + landing
```

| What           | Where                 |
| -------------- | --------------------- |
| API            | http://localhost:8000 |
| Web (React)    | http://localhost:5173 |
| Landing (Next) | http://localhost:3000 |
| Desktop        | an Electron window    |

Every client shows the same demo: API status, a Socket.IO counter and a CRUD of items.
If you see them, everything is connected.

Work on one app only: `pnpm --filter @repo/web dev` (or `@repo/api`, `@repo/desktop`, `@repo/landing`).

## 4. Make it yours

- [ ] Replace `README.md` with the description of your project.
- [ ] Rename the root package in `package.json` (`name`, `description`).
- [ ] Desktop: set `appId`, `productName` in `apps/desktop/electron-builder.yml` and `author` in `apps/desktop/package.json`.
- [ ] Titles: `apps/web/index.html`, `apps/desktop/src/renderer/index.html`, `apps/landing/app/layout.js`.
- [ ] Keep the `@repo/*` package names, or rename them everywhere (they appear in every `package.json` and import).
- [ ] Update `CLAUDE.md` with the rules of your project.

## 5. Replace the demo with your feature

The demo is there to prove the connections. When you no longer need it:

1. Add your own module and table: see "Add a module" in [ARCHITECTURE.md](ARCHITECTURE.md) and "Add a table" in [DATABASE.md](DATABASE.md).
2. Add its methods to `packages/lib/src/api.js` and its screen to the clients.
3. Delete what you do not need: `packages/demo`, `apps/api/src/modules/items`, the `Item` model in
   `apps/api/prisma/schema.prisma` (then run `pnpm db:migrate`) and the demo rows in `apps/api/src/db/seed.js`.

Do not need one of the apps? Delete its folder in `apps/` and its CORS origin in `apps/api/.env.development`.

## 6. Daily workflow

```bash
pnpm dev            # develop
pnpm db:migrate     # after editing apps/api/prisma/schema.prisma
pnpm check          # before every commit: format, lint, tests, build
```

## 7. Production

- Copy each `.env.production.example` to `.env.production` in the same folder and fill it in. These files are git-ignored.
- API: `pnpm --filter @repo/api start` applies pending migrations and starts the server.
  `prisma` is a normal dependency of the API for this reason, so `--prod` installs work.
- Web: `pnpm --filter @repo/web build` creates `apps/web/dist`. Landing: `pnpm --filter @repo/landing build` creates `apps/landing/out`. Both are static files.
- Desktop: `pnpm dist:desktop` builds for the OS you are on. See the Desktop section of [ARCHITECTURE.md](ARCHITECTURE.md).
- Add your production web and landing domains to `CORS_ORIGINS` in the API. Keep `null` if you ship the desktop app (a packaged Electron app sends `Origin: null`).

## 8. Troubleshooting

| Problem                                       | Fix                                                                                   |
| --------------------------------------------- | ------------------------------------------------------------------------------------- |
| `ERR_PNPM_IGNORED_BUILDS` on install          | Add the package to `allowBuilds` in `pnpm-workspace.yaml`.                            |
| Electron does not open (`Electron uninstall`) | Run `pnpm install` again: `apps/desktop` downloads the binary in `postinstall`.       |
| `API URL is missing` in a client              | The app has no `.env.development` / `.env.production` with its API URL.               |
| Browser blocks a request (CORS)               | Add the client origin to `CORS_ORIGINS` in `apps/api`. Packaged desktop needs `null`. |
| API stops: `CORS_ORIGINS is required`         | Set it in `apps/api/.env.development` or `.env.local`. It has no default.             |
| `no such table: items`                        | Run `pnpm db:migrate`.                                                                |
| Port already in use                           | Ports are fixed (CORS depends on them). Stop the other process.                       |
| Prisma prints an "update available" box       | Harmless. The template pins Prisma on purpose.                                        |

## Where to go next

- [TEMPLATE.md](TEMPLATE.md): structure, ports, commands and environment variables.
- [ARCHITECTURE.md](ARCHITECTURE.md): decisions, endpoints, how to add a module.
- [DATABASE.md](DATABASE.md): Prisma, raw SQL, migrations and seeds.
