# NestJS skill review and project adaptations

Reviewed on 2 November 2026: [nestjs-best-practices](https://www.skills.sh/kadajett/agent-nestjs-skills/nestjs-best-practices), community-maintained by Kadajett, version 1.2.0. Source: [the upstream skill](https://github.com/Kadajett/agent-nestjs-skills/tree/main/skills/nestjs-best-practices). Installed copy: [API-local SKILL.md](../../apps/api/.agents/skills/nestjs-best-practices/SKILL.md).

## Decision

Use it as supplementary NestJS implementation/review guidance. Its feature-module, dependency-injection, validation, exception-handling and testing rules fit this API. It is not an official NestJS skill or a version-specific NestJS 12 compatibility guarantee. Several examples assume a different stack or infrastructure; use the adaptations below rather than treating every rule as a required change.

The review inspected its entry point, all rule titles, and the relevant architecture, security, data, API, testing and operations examples. It did not compile every upstream snippet or certify the skill's security. The installed skill contains documentation, not an application dependency; no upstream build scripts were installed or executed.

## Apply by task

Read the entry point and only the relevant individual `rules/` files. Keep the upstream compiled repository-wide `AGENTS.md` out of this project's instruction chain.

| Rule area | Fit and adaptation |
|---|---|
| Feature modules, module sharing, focused services | Direct fit. Keep `src/<feature>/` and typed module exports; avoid duplicate providers and circular dependencies. |
| Constructor injection, tokens, provider scope | Direct fit for NestJS. Scope providers deliberately; introduce tokens/repository seams when they solve a concrete boundary rather than wrapping every Prisma call. |
| DTOs, pipes, guards | Useful. Preserve unknown-field rejection and explicit contract validation. Check field conversions; the example's global implicit conversion is not a project default. Guards do not replace owner scoping in persistence. |
| JWT authentication | Validate Supabase-issued identity according to the selected auth contract. The skill's local signing, password-change and refresh-token persistence examples do not define this application's authentication. |
| Transactions, migrations, query performance | Translate TypeORM examples into Prisma 7 and reuse `PrismaService`. Use the existing Prisma skills for concrete APIs. Schema edits still need an explicit request; persistence guarantees require real PostgreSQL tests. |
| Testing | Keep `@nestjs/testing` and Supertest where applicable, using Vitest `vi` and existing runners. Pure domain/scoring tests need no Nest container; DI tests should exercise the real provider wiring. Mock providers without replacing database isolation/transaction evidence. |
| Errors, interceptors, serialization, versioning | Preserve `/api/v1`, specified statuses, error envelopes, DTOs and generated-client contracts. Example `{data, timestamp}` wrappers and alternate versioning strategies must not change the API shape. |
| Output safety and logging | Validate and retain plain-text user evidence; encode/sanitize at the actual rendering boundary as appropriate. Blanket HTML stripping can change original answers. Keep credentials, raw personal prose and sensitive query values out of logs; generic redaction examples are incomplete for this domain. |
| Events, queues, caches, microservices | Keep direct typed service calls, PostgreSQL-backed jobs and the selected MVP services. Skill examples are not authorization to add an event bus, Redis, BullMQ or a distributed architecture. |
| Lifecycle, configuration, health | Useful principles. Reuse existing config and Prisma cleanup; verify signal/lifecycle ordering against current NestJS documentation rather than combining copied manual signal handlers with automatic shutdown hooks. Keep CI-built Coolify images as the deployment model. |

For version-sensitive implementation, prefer primary sources such as [NestJS validation](https://docs.nestjs.com/techniques/validation), [testing](https://docs.nestjs.com/fundamentals/testing), and [lifecycle events](https://docs.nestjs.com/fundamentals/lifecycle-events), checked against the installed package versions. The project specs remain authoritative for domain behavior and contracts.

## Installation and verification

The skill was vendored with `skill-installer` into `apps/api/.agents/skills/nestjs-best-practices/`. The committed files capture the reviewed content; `apps/api/skills-lock.json` continues to track the three Prisma skills installed through their original workflow. Read the NestJS skill directly if nested skills are absent from the session catalog; it is available for discovery on the next turn.

Verification for this documentation/setup change checks local links, referenced rules and `git diff --check`. Application behavior was unchanged, so no application tests or builds were repeated.
