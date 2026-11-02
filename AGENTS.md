# Olfactory Wardrobe

Olfactory Wardrobe is a private fragrance collection and consultation app. It turns four interview rounds into an editable olfactory profile, explained recommendations, wardrobe plans, daily scent decisions, and wishlist/sampling feedback.

## Source of truth and conventions

- Read `docs/README.md` and the relevant `docs/specs/*` before changing a domain workflow. The six base specs, their updates, and the CI/VPS addendum define the product; updates supplement the bases unless explicitly overriding them.
- Use the selected Tailwind/Supabase stack and CI-first deployment guidance where older Bootstrap or bespoke-auth instructions conflict. Helper endpoint tables and transaction sketches are illustrative; preserve the detailed API and ownership/versioning contracts in the base specs.
- Use Angular standalone components and Tailwind utility classes. Tailwind v4 uses CSS-first configuration in `apps/web/src/styles.css`; shared semantic colors live in `packages/ui-tokens/src/tokens.css`. Use Angular CDK for accessibility/behavior when needed; it is not installed yet.
- Keep NestJS organized as one module per feature under `apps/api/src/`. Use typed services between modules and preserve the existing ESM `.js` import convention.
- Supabase supplies PostgreSQL and Auth. NestJS owns domain authorization and owner-scoped access; Supabase integration is not implemented yet.
- Core ranking must work deterministically with AI disabled. Preserve unknown versus neutral, ownership versus preference, evidence-backed catalog facts, immutable profile/run history, and fragrance-free hard constraints.
- Change specs or the Prisma schema only when explicitly requested. Keep onboarding work separate from product implementation.

## Stack and folder map

- `apps/web`: Angular 22 SPA, Tailwind CSS v4, Angular CLI/Vitest tests; currently the starter screen with empty routes.
- `apps/api`: NestJS 12 modular monolith, Prisma 7 with `@prisma/adapter-pg`, Vitest, and Oxlint; domain modules are placeholders.
- `apps/api/prisma/schema.prisma`: schema, currently only generator/datasource definitions; migrations are not present.
- `apps/api/prisma7.config.ts`: Prisma configuration and `DATABASE_URL` lookup.
- `apps/api/src/generated/prisma`: custom generated client output, ignored by Git; regenerate rather than edit.
- `packages/ui-tokens`: shared CSS tokens; the only current shared package. Contracts, scoring, and evaluation packages in the specs are planned.
- `docs/specs`: product, technical, flow, design, schema, and delivery specifications.
- `.github/workflows/ci.yml`: install, lint, tests, Prisma generation, and app builds.
- `docker-compose.yml`: local PostgreSQL 18 only; not the production Supabase stack.
- `.env.example`: local database and placeholder Supabase settings.

## Local development

Use Node.js 24.21.0 (`.node-version`) and pnpm 12.6.0 (`package.json`), matching CI. Run from the repository root:

```sh
pnpm install
cp .env.example apps/api/.env
docker compose up -d db
pnpm --filter api exec prisma generate
pnpm dev
```

Keep secrets in the ignored `apps/api/.env`. Configure real Supabase settings when implementing auth; local Compose supplies only PostgreSQL. PrismaService requires `DATABASE_URL` and connects during API startup. The API reads `PORT` (default 3000), matching `.env.example`. Angular serves on port 4200. `pnpm dev:web` and `pnpm dev:api` start each app separately.

## Verification

```sh
pnpm lint
CI=true pnpm test
pnpm --filter web test --watch=false
pnpm --filter api test
pnpm --filter api test:e2e
pnpm build
```

`pnpm test` may watch in an interactive terminal because the web script is `ng test`; use CI mode or the explicit non-watch command for automation. Root lint runs type-aware Oxlint for API and web TypeScript. Angular HTML templates, CSS, and shared-package lint are not covered. API E2E requires database/environment setup and is separate from the root unit-test command. No root typecheck, migration, seed, or contract-generation scripts exist yet.

Generate Prisma before tests/builds on a clean checkout; CI generates it before tests. The PrismaService unit test supplies its own ConfigService fixture and does not require a running database.

## Deployment

GitHub Actions must build and publish web/API Docker images, then Coolify deploys those images using Docker Image resources. The Hostinger VPS has 1 CPU core, 4 GB RAM, and 50 GB disk: do not compile applications or build images on it; keep build-server fallback disabled.

Supabase is the production database/auth provider via the Coolify template. Uptime Kuma and consent-gated Umami are planned operational services. Current CI only verifies source builds; Dockerfiles, registry publication, and a Coolify deployment trigger are not implemented. Run production migrations once as a controlled deployment step when migrations exist.
