# API

NestJS modular monolith with Prisma 7 and `@prisma/adapter-pg`. Domain modules are placeholders; Supabase integration and domain schema/migrations are pending.

Use the [root setup](../../README.md) and [API agent guidance](AGENTS.md). Run commands from the repository root:

```sh
pnpm --filter api exec prisma generate
pnpm dev:api
pnpm --filter api test
pnpm --filter api build
```

The API loads `apps/api/.env`, requires `DATABASE_URL`, connects during startup, and listens on `PORT` (default 3000). Keep secrets in the ignored environment file. Local Compose supplies PostgreSQL only.

`pnpm --filter api test:e2e` boots the real application and requires a reachable disposable database and the API environment. Unit tests use Vitest and supply their own fixtures. Lint is included in root `pnpm lint`.

Production deployment follows the [CI/VPS addendum](../../docs/specs/02-technical-requirements-ci-vps.md): publish images from CI and deploy with Coolify Docker Image resources. The image pipeline is pending. The scaffold's `deploy` script is not the selected production workflow. NestJS Observe is not configured.
