# Olfactory Wardrobe

Olfactory Wardrobe is a private fragrance collection and consultation app. It turns four interview rounds into an editable olfactory profile, explained recommendations, wardrobe plans, daily scent decisions, and wishlist/sampling feedback.

## Source of truth and conventions

- For coding tasks, follow `docs/development/codex-workflow.md` and the task-specific routes in `docs/development/engineering-workflow.md`. For skill selection, read the relevant row in `docs/development/skills.md`; load the selected `SKILL.md` before applying it. Read `apps/api/AGENTS.md` or `apps/web/AGENTS.md` when working in that app, including when starting from the repository root.
- For Angular work, use the official `angular-developer` skill at `apps/web/.agents/skills/angular-developer/SKILL.md` and the Angular CLI MCP workflow in `docs/development/angular-ai.md`. These govern Angular implementation details alongside the product's Tailwind/design constraints.
- For UI/UX/motion skill routing and explicit-invocation boundaries, use `docs/development/ui-ux-motion-workflow.md`. The design brief is provisional; the latest user direction governs, and `docs/proposals/motion-policy.md` is a draft for the upcoming spec revision.
- For NestJS implementation/review, use `apps/api/.agents/skills/nestjs-best-practices/SKILL.md` with the project adaptations in `docs/development/nestjs-skill.md`; keep Prisma, Vitest, Supabase identity and the modular-monolith contracts authoritative.
- Read `docs/README.md` and the relevant `docs/specs/*` before changing a domain workflow. The six base specs, their updates, and the CI/VPS addendum define the product; updates supplement the bases unless explicitly overriding them.
- Use the selected Tailwind/Supabase stack and CI-first deployment guidance where older Bootstrap or bespoke-auth instructions conflict. Helper endpoint tables and transaction sketches are illustrative; preserve the detailed API and ownership/versioning contracts in the base specs.
- Use Angular standalone components and Tailwind utility classes. Tailwind v4 uses CSS-first configuration in `apps/web/src/styles.css`; shared semantic colors live in `packages/ui-tokens/src/tokens.css`. Use Angular CDK for accessibility/behavior when needed; it is not installed yet.
- Keep NestJS organized as one module per feature under `apps/api/src/`. Use typed services between modules and preserve the existing ESM `.js` import convention.
- Supabase supplies PostgreSQL and Auth. NestJS owns domain authorization and owner-scoped access; Supabase integration is not implemented yet.
- Core ranking must work deterministically with AI disabled. Preserve unknown versus neutral, ownership versus preference, evidence-backed catalog facts, immutable profile/run history, and fragrance-free hard constraints.
- Change specs or the Prisma schema only when explicitly requested. Keep onboarding work separate from product implementation.

## Coding workflow

- Start with a concise plan naming the requirement, acceptance criteria, affected boundaries, and verification. Then implement within the authorized scope; plan approval is not a routine gate. Ask when an unresolved product decision or conflicting contract changes the outcome.
- Deliver a small end-to-end increment from the current milestone in `docs/specs/06-implementation-plan.md`. Distinguish implemented behavior from planned modules, packages, and scripts; empty modules are not completed features.
- Use task-relevant skills: `diagnosing-bugs` for failures; `document-jsdoc` for non-obvious TypeScript contracts; a primary UI skill for interface work; `tdd` when test-first work is requested, agreeing test boundaries before tests unless already confirmed; `pr` when writing a PR body. Prisma skills are under `apps/api/.agents/skills/` and can be read directly if absent from the session catalog.
- Keep the current Angular/NestJS/Prisma 7/Supabase/Coolify architecture when applying generic skills. Adapt framework-specific examples to Angular. Skill availability does not authorize a stack migration, new hosted service, telemetry integration, or production action.
- Verify the changed behavior and relevant failure cases, then run the appropriate checks below. Report commands, outcomes, and gaps. A passing starter suite is not evidence of domain correctness.

## Code Review Rules

- Flag private-object access that is not scoped to the authenticated owner, including related records inside transactions; route guards in the SPA do not establish authorization.
- Flag ranking changes that weaken fragrance-free constraints, admit unavailable/non-owned items into wear-now results, collapse UNKNOWN into NEUTRAL, or make ranking depend on an LLM, ambient time, randomness, or database access.
- Flag edits to immutable profile/catalog/run snapshots, missing staleness/version checks, and unsupported catalog claims in explanations. Use the detailed base API contracts rather than the helper endpoint tables.

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
# First setup only: preserve an existing local environment file.
test -f apps/api/.env || cp .env.example apps/api/.env
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
