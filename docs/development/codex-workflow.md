# Codex coding workflow

Use this workflow for implementation and fixes. For the full engineering skill inventory, explicit-only workflows, GitHub Issues path and precise stop points, use [engineering-workflow.md](engineering-workflow.md). The root `AGENTS.md` holds repository-wide constraints; app-level instructions add local rules. The [skill guide](skills.md) maps tasks to available guidance. Skills support this workflow and the selected stack.

## 1. Scope a verifiable increment

Inspect the working tree and applicable nested instructions. Read [the documentation index](../README.md) and the spec sections relevant to the task. Match the work to an FR acceptance criterion and milestone in the base implementation plan. For maintenance without an FR, name the observable outcome directly.

Give a concise plan: intended behavior, files/boundaries, acceptance cases, and checks. Proceed with implementation after that plan. Ask only when missing information changes the product behavior, an API contract, or authorized scope. A task requiring schema or spec edits still needs an explicit request for those changes under the root instructions; finish independent work while clarifying the dependency.

Keep onboarding/documentation work separate from product implementation. Implement one coherent vertical slice rather than populating every placeholder module. Preserve unrelated changes in the working tree.

## 2. Resolve the sources of truth

| Decision | Read | Resolution |
|---|---|---|
| Product behavior and terminology | 01 base + update | Base acceptance criteria and canonical terms govern; helper mappings guide navigation. |
| Architecture/auth | 02 base + Tailwind/Supabase update | Angular/Tailwind, NestJS, Prisma/PostgreSQL, Supabase Auth. Bespoke auth and Bootstrap are superseded. |
| Deployment | 02 CI/VPS addendum | CI builds/publishes images; Coolify pulls them. No builds on the VPS. |
| Routes, DTOs, errors, versions, idempotency | Detailed 02 base contracts + applicable explicit overrides | Short endpoint/component tables in 01/03 updates are illustrative, including where names or methods differ. |
| Flow and accessibility | 03/04 bases + updates | Preserve state behavior and accessibility; translate older SCSS/Bootstrap snippets to the existing Tailwind CSS setup. |
| Persistence and transactions | 05 base + update | Detailed ownership/version invariants govern; transaction sketches are incomplete examples. |
| Delivery order and release gates | 06 base + update | Milestone hints supplement the gates; missing scripts/packages remain planned until implemented. |

Existing source/configuration establishes what works today, not permission to weaken the product requirements. For a new unresolved conflict, identify the exact clauses and ask for a decision instead of silently choosing. Record a durable architectural decision in `docs/adr/` when it resolves a meaningful tradeoff; an ADR must not silently override a spec.

## 3. Implement with the relevant skills

For UI/UX and motion, use the [dedicated skill workflow](ui-ux-motion-workflow.md), including its user-only invocation and audit/prototype stop points. The design brief is provisional and its future revision is separate from implementing against the current direction.

Select skills by the task triggers in [skills.md](skills.md), read their actual instructions, and load references only for the branch being used. Use one primary design approach for a UI task; add specialized accessibility, browser, or motion guidance when it resolves a concrete need.

For Angular implementation, follow [the official Angular skill and CLI MCP workflow](angular-ai.md): load the vendored `angular-developer` skill, discover the web workspace, and retrieve version-aligned best practices before editing framework code. Framework guidance and visual design guidance have complementary roles.

For NestJS implementation/review, load the local `nestjs-best-practices` skill with [its project adaptations](nestjs-skill.md). Reuse its applicable module/DI and boundary patterns while keeping Prisma, Vitest, Supabase identity and the specified API shape.

For bugs, first reproduce the observed failure with a command or test; use `diagnosing-bugs` to narrow it before changing behavior. For requested test-first work use `tdd`, confirming the proposed public test boundaries with the user before writing tests unless already agreed. Ordinary implementation/testing does not automatically invoke this skill. Document non-obvious TypeScript contracts with `document-jsdoc` without restating types or obvious wrappers.

Keep ranking pure and deterministic. Test eligibility before ranking, UNKNOWN versus NEUTRAL, ownership versus rating, hard constraints, deterministic ties, evidence provenance, immutable history, and staleness when the change touches them. Supply clocks and reference timestamps explicitly. AI interpretation/explanation remains optional and cannot select unsupported catalog identities or override eligibility.

For private APIs, verify the authenticated owner throughout nested reads/writes and transactions, as well as the required validation, concurrency, and idempotency behavior. Authentication/session transport must be resolved when that slice is implemented; do not transplant the superseded bespoke auth tables into Supabase login.

## 4. Verify the changed boundary

Run checks from the repository root, using the installed runtime/package manager. Generate Prisma first on clean checkouts. Use a frozen-lockfile install when verifying reproducibility; preserve an existing API `.env` during setup.

| Change | Evidence |
|---|---|
| Documentation/instructions | Inspect the diff, local links, paths and commands; compare guidance against source/config/specs. No new application tests solely for prose. |
| API service/domain logic | Focused Vitest behavior tests, API lint, API build. Add real PostgreSQL integration checks for owner isolation, transactions, concurrency or persistence semantics. |
| Angular UI | Focused Angular tests, web lint/build, and browser/manual verification of affected interaction states, keyboard behavior and mobile reflow. |
| Scoring | Pure fixture/invariant tests, deterministic replay, AI-disabled behavior; use the evaluation cases in 02/06 as they are implemented. |
| Schema/migrations, when explicitly requested | Prisma validation/generation, fresh disposable PostgreSQL migration and relevant persistence tests. Production migration is a controlled deployment action. |
| Cross-app change | Root lint, noninteractive unit tests, both app builds, plus the affected API/UI integration checks. |

The root `AGENTS.md` lists the executable commands. Do not invent planned `typecheck`, `test:integration`, `contracts:generate`, `db:migrate`, or `evaluate` scripts. Browser automation can verify a flow without an existing E2E suite, but a one-off browser check is not committed regression coverage. Report any unavailable tool, database, credentials, or check.

## 5. Review and hand off

Review the diff against acceptance criteria and the `Code Review Rules` in the applicable agent files. For a requested branch/PR review, the `code-review` skill has additional prerequisites and its prescribed committed diff excludes uncommitted work; do not invoke it as a mandatory gate for every edit. Use `pr` when preparing a PR body.

Report what changed, why, checks and results, material limitations, and the next dependency if work remains. Distinguish a configured command from a successful run, and starter tests from domain acceptance. Keep approval for external actions within the user's actual authorization; a coding task alone does not authorize deployment or sending private data to a new service.
