# Skills for the coding workflow

This guide lists skills relevant to this repository after reviewing the session's available catalog and the installed API skills. Load only those whose task branch applies. The current session catalog is authoritative for host/plugin availability; a name here does not install a skill or its dependencies. Read the actual `SKILL.md` before use.

## Repository-local skills

For Angular implementation, use the official [angular-developer](../../apps/web/.agents/skills/angular-developer/SKILL.md) skill installed under `apps/web/.agents/skills/`. Follow [Angular AI development](angular-ai.md) for source guidance, version checks, MCP setup and verification. For NestJS implementation/review, use the community [nestjs-best-practices](../../apps/api/.agents/skills/nestjs-best-practices/SKILL.md) skill with [the reviewed project adaptations](nestjs-skill.md). Load relevant rules only; preserve Prisma/Vitest/Supabase and the specified API contracts. Both framework skills complement the three Prisma skills below.

These three skills are committed under `apps/api/.agents/skills/`; [their source lock](../../apps/api/skills-lock.json) records upstream installation provenance. The ORM setup skill has two local link adjustments so optional upstream references remain reachable after pruning unused skills. Review updates against the project constraints before applying them.

| Skill | Use in this project | Project-specific constraint |
|---|---|---|
| [prisma-cli](../../apps/api/.agents/skills/prisma-cli/SKILL.md) | Generate/validate the client, inspect migration status, and run explicitly scoped schema operations. | Use `pnpm --filter api exec prisma ...`, Prisma 7, and the existing config. Read its safety reference before destructive commands. |
| [prisma-client-api](../../apps/api/.agents/skills/prisma-client-api/SKILL.md) | Queries, filters, nested relations, transactions, and client lifecycle. | Reuse `PrismaService`; owner-scope private records and verify transaction semantics with PostgreSQL. Generic examples do not implement authorization. |
| [prisma-orm-setup](../../apps/api/.agents/skills/prisma-orm-setup/SKILL.md) | Diagnose connection/environment/adapter configuration. | Select its **existing Prisma 7 + PostgreSQL** branch and `references/v7-postgresql.md` / `references/v7-client-setup.md`. Keep the existing generator output, Compose database, and production Supabase choice. |

The nested API skills were not advertised in the root-started session catalog during the audit. The root and API instructions therefore point to their files explicitly; agents can read them directly. Avoid copying the skills into another directory just to make them visible.

For UI/UX/motion, the [dedicated workflow and complete global inventory](ui-ux-motion-workflow.md) is authoritative for invocation restrictions, exact branches, prototype choices, and framework adaptations. The design brief is provisional; the [motion-policy proposal](../proposals/motion-policy.md) is not adopted.

For software engineering and feature delivery, use the [full engineering workflow](engineering-workflow.md): it distinguishes 19 advertised global candidates from 20 additional globally installed explicit-only skills, records the user's GitHub Issues preference, and defines test-boundary, tracker and delivery stop points. The tracker setup itself has not been performed.

## Host skills by task

These are supplied by the developer's environment, not committed project dependencies. On another machine or in CI, inspect the available catalog first. If a skill is absent, use the repository instructions and primary framework documentation; if the user explicitly required that skill, report its absence instead of claiming to have used it.

| Task | Relevant skill(s) | How to apply |
|---|---|---|
| Angular framework implementation | Repository-local `angular-developer` | Primary Angular guidance for components, state, forms, routing, HTTP, accessibility, styling and testing. Use the version-aligned CLI MCP workflow in [angular-ai.md](angular-ai.md); visual design skills supplement it. |
| NestJS implementation and review | Repository-local `nestjs-best-practices` | Supplementary module/DI, validation, error handling and testing guidance, with [project-specific adaptations](nestjs-skill.md). Verify version-sensitive APIs against official NestJS docs. |
| Diagnose failures or regressions | `diagnosing-bugs` | Establish a reproducible signal, narrow the cause, fix and verify. Redact logs/artifacts. |
| Requested test-first features or integration tests | `tdd` | Confirm the public test boundaries with the user (unless already agreed), then implement observable acceptance cases through red/green cycles. Use Vitest/Angular's existing runners and a disposable PostgreSQL database when required. |
| TypeScript contract documentation | `document-jsdoc` | Document invariants, units, side effects and failure semantics where non-obvious; avoid comments on trivial wrappers. |
| Module interfaces or testability | `codebase-design` | Design typed service boundaries and pure scoring seams; keep NestJS feature organization. |
| Domain terminology or ADRs | `domain-modeling` | Reuse the normative glossary in PRD section 3; record a resolved decision only when needed. Avoid a competing glossary or changing requirements without an explicit request. |
| UI/UX design and refinement | `frontend-design`, `ui-ux-pro-max`, `emil-design-eng`; `impeccable` for its structured paths | Use the [UI workflow](ui-ux-motion-workflow.md), current user direction and official Angular implementation guidance. |
| Motion and interaction specialists | `animate`, `mobile-native`, `apple-design`, motion discovery/audit/performance skills | Select by the [exact task/output](ui-ux-motion-workflow.md); discovery/audits do not silently implement. |
| Explicit-only design tools | `review-animations`, visual-picker `prototype` in `emil-prototype/`, `pick-ui-library` | User must explicitly invoke the skill; do not auto-chain these into every build. Duplicate prototype names require a path. |
| Browser and UI quality verification | `playwright`, `web-design-guidelines`, `web-perf`, `break-ui` | See [verification and stop rules](ui-ux-motion-workflow.md); stress fixtures, audits and real-device claims need their actual scope/evidence. |
| Review a branch or PR | `code-review` | Requires a resolvable baseline, spec source and its tracker setup. It delegates Standards/Spec reviews to subagents. Use it for a matching review request, not as an automatic edit gate. If setup is absent, follow its clarification process; do not silently install tracker infrastructure. |
| Write a PR body | `pr` | Describe final behavior, evidence and meaningful risk, using its template in proportion to the change. |
| Investigate a technical decision | `research`, `agent-reach` | `research` delegates primary-source research and writes findings; use only for a matching investigation. `agent-reach` routes web/platform access and defers to dedicated product skills. Avoid unnecessary social research for framework facts. |
| Codex/OpenAI setup or optional provider work | `openai-docs` | Verify current official guidance. App-level AI still follows the optional adapter contract and cannot replace deterministic ranking. |
| Maintain agent instructions or reusable skills | `writing-for-agents`, `skill-creator`, `skill-installer` | Keep instructions scoped and linked. Create a skill only for a recurring workflow that needs it; install/update skills only within the requested setup scope. |
| Improve prose | `humanizer:humanizer` | Edit wording without altering product facts, requirements, or uncertainty. |
| Explain architecture or behavior visually | `visualize:visualize` | Useful for exploring scoring/state flows; use synthetic data and preserve domain uncertainty. Simple static diagrams can remain Mermaid in docs. |
| Create an illustration | `imagegen` | Use for an explicitly needed bitmap asset. Generated imagery is not evidence of perfume identity, packaging, provenance or catalog facts. |
| Add local commit checks | `setup-pre-commit` | Use when requested; align hooks with pnpm/Oxlint/Vitest instead of assuming ESLint. CI remains authoritative. |
| Test-fixture assertion cleanup | `migrate-to-shoehorn` | Use when requested or justified by a real fixture migration; it is not a prerequisite for ordinary tests. |
| Operator-only setup | `wizard` | Reserve for steps the agent cannot perform, such as human credential/dashboard actions. Never embed secrets in a generated wizard. |

## Selection and portability

The catalog was reviewed for fit across coding, design/motion, research, content, platform, media, and application-integration skills. This guide retains only relevant routes; project-local skill pruning is reflected in the installation lock. Global/plugin installations are left intact because they belong to the user's wider environment.

Skill names do not establish tool availability, framework support, or permission for external writes. Prefer the current repository's dependencies, config, and spec decisions. Load supporting references when needed, not every design or motion skill for every component. User-invoked skills retain their invocation rules.

The official Angular developer skill now supplies framework-specific guidance. The community NestJS skill adds framework patterns, while Supabase integration and the application's scoring/evaluation harness still depend on version-matched primary documentation and the base specs. Consider a small repository-local verification skill later, after migration, contract and evaluation commands actually exist; documenting imaginary commands now would reduce reliability.

Example request: “Implement the next collection increment from M1. Give a concise plan, preserve UNKNOWN versus NEUTRAL, use the Prisma client skill for persistence, and verify cross-owner access and the affected UI states. If schema work is required, identify that dependency before changing the schema.”
