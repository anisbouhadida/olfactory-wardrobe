# API agent guidance

Inherit the root `AGENTS.md` and its coding workflow. Use `../../docs/development/engineering-workflow.md` for feature/test/review skill routing, auth/persistence verification and the optional GitHub Issues path. This file adds API-specific guidance.

- For NestJS implementation, review or refactoring, load `.agents/skills/nestjs-best-practices/SKILL.md` and only the applicable `rules/` files. This is community guidance; apply the project adaptations in `../../docs/development/nestjs-skill.md`, and verify version-sensitive APIs against the installed NestJS 12 packages and official documentation.
- Apply its module/DI, validation, exception handling and testing principles within the current stack: Prisma 7 rather than TypeORM, Vitest `vi` rather than Jest, and Supabase-issued identity rather than custom JWT issuance/refresh-token storage. Preserve the detailed API error/response contracts and owner-scoped authorization.
- Keep typed service calls and PostgreSQL-backed jobs in the modular monolith. Event buses, Redis/BullMQ, microservices and alternate deployment platforms in skill examples are outside the selected MVP architecture. Preserve user evidence as validated plain text; avoid blanket HTML stripping, coercion, logging or response wrapping copied from generic examples.
- Keep domain features under `src/<feature>/`, with controllers at the HTTP boundary and typed services between modules. Preserve ESM `.js` imports and constructor injection.
- Before implementing an endpoint, read the relevant contract in `../../docs/specs/02-technical-requirements.md`, its Supabase update, and the ownership/transaction rules in `../../docs/specs/05-backend-schema.md`. Helper tables are illustrative; paths, methods, DTOs, error shapes, concurrency, and idempotency come from the detailed contracts.
- Supabase Auth is the selected identity authority. Validate its JWTs and derive ownership on the server when implementing authentication. Resolve session transport/CSRF details against the base requirements and Supabase update before coding that boundary; the current `AuthModule` is empty.
- Reuse `PrismaService` and the existing `@prisma/adapter-pg` connection lifecycle. Keep generated output under `src/generated/prisma/` unedited. Schema changes require an explicit user request under the root instructions.
- Read `.agents/skills/prisma-client-api/SKILL.md` for queries/transactions, `.agents/skills/prisma-cli/SKILL.md` for Prisma commands, and `.agents/skills/prisma-orm-setup/SKILL.md` for connection repair. Select the existing Prisma 7/PostgreSQL path; retain Supabase in production and Compose PostgreSQL locally.
- Use `pnpm --filter api exec prisma ...` from the root so commands use the installed version and existing `prisma7.config.ts`. Check the intended database without exposing credentials before applying migrations; use a disposable database for integration tests.
- Unit tests use Vitest. `src/**/*.spec.ts` are unit tests; `test/*.e2e-spec.ts` boot the real `AppModule` and require a reachable database and API environment. Never point these checks at production. See the root instructions for generation and verification commands.
- For incident work, use available redacted logs/traces and a reproducer. NestJS Observe is not configured or a required service; adding telemetry or external data transmission is a separate scoped task.

## Code Review Rules

- Check owner scoping on reads and writes, strict DTO validation, and the specified 404 behavior for absent/not-owned resources.
- Check atomic snapshot creation, optimistic concurrency, idempotency, and stale dependency rejection wherever the endpoint contract requires them. Integration evidence must exercise real PostgreSQL semantics.
- Treat Supabase identity as authentication, with NestJS responsible for domain authorization. Persist and log only the data permitted by the privacy requirements.
