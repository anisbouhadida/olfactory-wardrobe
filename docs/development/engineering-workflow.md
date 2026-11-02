# Software engineering and feature implementation with skills

Reviewed 2 November 2026 for Angular 22 / Tailwind CSS 4, NestJS 12, Prisma 7 and Supabase PostgreSQL/Auth. This is the engineering companion to [the UI/UX workflow](ui-ux-motion-workflow.md) and the shorter [Codex workflow](codex-workflow.md).

The user's standing preference is **concise plan, then implementation**, with clarification only where an unresolved decision matters. For a future ticket-driven path the user selected **GitHub Issues**; this review does not configure a tracker, create labels/issues/PRs, or enable an orchestration skill.

## What was reviewed and what is available

The 39 engineering/workflow candidates below have global `SKILL.md` files on this machine. Their entry points were read, invocation metadata checked, and relevant supporting references inspected. Some entry points were already read earlier in this conversation and were rechecked where this workflow needed their exact behavior. This is a documentation/routing review, not an execution test of every skill script.

- **19 are advertised in this session**, including two that are unsuitable for this application's coding workflow.
- **20 more are installed globally and explicit-only.** They were not advertised in the initial session catalog. Their `disable-model-invocation: true` frontmatter and `allow_implicit_invocation: false` YAML policy agree. They are not missing installations; use an explicit skill invocation/path in a host that supports them, rather than expecting automatic selection. Slash commands in their authored examples are not a promise that this Codex client has the same slash-command interface.
- The Angular, NestJS and three Prisma skills are **repository-local**, not global. They are essential implementation guidance and are listed separately below.
- UI/browser/prototype specialists remain covered by [the UI inventory](ui-ux-motion-workflow.md); they were not counted again. Platform-specific Cloudflare, native-language and artifact/content skills are outside the 39-candidate workflow inventory, not secretly absent from the global catalog.

Resolve paths from the session catalog. The non-system candidates below live under `~/.codex/skills/<name>/SKILL.md`; `openai-docs`, `skill-creator` and `skill-installer` live under its `.system/` directory. Neither reading this guide nor reading a skill executes it or changes invocation policy.

## Globally advertised engineering skills

Agent-selectable means the agent may select the skill when the user's actual task matches. It does not authorize every side effect in the skill, or mean that all skills run on each feature.

| Skill | Trigger and exact role | Limits / relevant outcome |
|---|---|---|
| `codebase-design` | Designing a module interface, test seam or a focused restructuring. | Shared vocabulary and decision guidance; no mandatory architecture rewrite. Its optional Design It Twice branch uses parallel agents only for requested alternative-interface exploration. |
| `domain-modeling` | Resolving ambiguous domain terms or a meaningful architecture decision. | Reuse PRD section 3 as the normative glossary. Capture resolved terms/ADRs without inventing a competing model or silently changing specs. Merely reading domain terms does not require invoking this skill. |
| `diagnosing-bugs` | A broken, failing, slow or regressed behavior. | Establish a real failing signal → minimize → ranked falsifiable hypotheses → targeted probes → fix/regression evidence → cleanup. If no reproducer is possible, report what is missing instead of claiming a diagnosis. |
| `tdd` | Requested test-first work or an explicitly requested integration-test workflow. | **Agree test seams with the user before any test**, then one failing behavior → minimal passing implementation at a time. Its loop is red/green; refactoring belongs to its review stage. This skill is not the ordinary implementation default. |
| `document-jsdoc` | Non-obvious TypeScript/JavaScript contracts being created, edited or reviewed. | Document meaning, invariants, side effects and failure modes, not obvious types/wrappers. Does not authorize editing generated Prisma/client files. |
| `research` | A scoped primary-source investigation or delegated documentation legwork. | Requires a background research agent and a cited Markdown result. Routine one-page docs lookup does not need a research project; do not claim delegation if it did not occur. |
| `grilling` | The user wants an idea/decision stress-tested or interviewed. | Question rounds until the decision tree is settled, then wait for shared-understanding confirmation before acting. Not the default response to a clear implementation request. |
| `code-review` | Requested branch/PR review against a fixed point. | Needs baseline, standards/spec context and tracker guidance; two parallel reviews, Standards and Spec, reported separately. The prescribed `base...HEAD` diff does not cover uncommitted changes. |
| `pr` | Writing a PR body. | Summary/visual, concrete evidence and meaningful merge risk. Writing a body is not permission to publish, merge or deploy. |
| `migrate-to-shoehorn` | A requested test-fixture/assertion migration or a real partial-fixture problem. | Test-only helper, never production. Scope to the requested files; use pnpm/workspace dev dependency conventions. No automatic repo-wide assertion cleanup. |
| `setup-pre-commit` | A request to set up Husky/lint-staged/commit checks. | Installs/configures and includes a commit in its workflow. Use existing scripts, preserve formatting configs, make tests noninteractive; do not invent root typecheck or stage unrelated work. Not a side effect of feature work. |
| `wizard` | A necessary setup action only the human can perform. | Confirm ordered stages and secret destinations, generate from its template, syntax-check, then hand off. Never run the human-input wizard end-to-end as the agent or include secrets in chat. |
| `writing-for-agents` | Creating/editing AGENTS, skills or documents reached by agent pointers. | Concise instructions, explicit triggers, progressive disclosure and one source of truth. Does not require expanding agent docs after every feature. |
| `agent-reach` | Internet/platform retrieval under its routing rules. | Access/routing support, not an engineering architecture method. Prefer dedicated product guidance and primary technical sources; no posting/messaging implied. |
| `openai-docs` | Codex/OpenAI configuration, product or API questions. | Current official documentation route. Not an Angular/NestJS/Supabase reference and not required just because Codex writes code. Optional app LLM work must preserve the deterministic provider-off path. |
| `skill-creator` | A request for a reusable skill or an actual recurring workflow worth capturing. | Create only needed instructions/resources, preserve invocation policy unless asked to change it, validate the result. A workflow guide need not become another installed skill. |
| `skill-installer` | Requested skill installation/listing or an authorized setup scope requiring it. | Use its helper scripts; distinguish global/project destination and installed/active states. No automatic bulk-install of a skill author's recommended suite. |
| `git-guardrails-claude-code` | **Not a Codex implementation skill.** A request to configure Claude Code git hooks. | Its `.claude` settings do not establish Codex enforcement. Use only for an actual Claude Code setup task. |
| `scaffold-exercises` | **Not an application feature skill.** Educational exercise scaffolding. | Assumes an exercises layout, `ai-hero-cli` and a commit. Do not import those conventions into this product. |

## Additional globally installed explicit-only skills

These 20 were inspected rather than omitted because they were absent from the automatic catalog. The user must explicitly select the skill; the agent may recommend it, but must not silently enable, install, invoke or replace it with another skill.

| Skill | Use / exact output | User decisions, prerequisites and side effects |
|---|---|---|
| `ask-matt` | Router for the author's engineering suite. | Read the routed skills before advising; its full idea-to-ship sequence is an option, not this project's default. |
| `setup-matt-pocock-skills` | Configure issue-tracker, domain-doc and optional triage-label guidance. | Explore → confirm choices → show draft → confirm/edit → write; may create missing GitHub labels. GitHub Issues is selected here, but repository target, configuration and writes are still a separate setup task. |
| `grill-me` | Alias to `grilling`. | Interview only; final shared-understanding confirmation before action. |
| `grill-with-docs` | `grilling` plus `domain-modeling`. | Interview with durable terms/decision capture; preserve existing normative terminology and the spec-edit boundary. |
| `to-spec` | Synthesize an already discussed feature into a tracker spec. | Confirm test seams, then publish and label. No new interview beyond the required test-boundary check. Existing `docs/specs/*` are not automatically replaced. |
| `to-tickets` | Split a settled plan/spec into demoable vertical tickets with blocking edges. | **User approves breakdown before publishing**. GitHub-native dependencies where supported, body links otherwise; no parent closure/modification. Wide mechanical refactors use expand–migrate–contract. |
| `implement` | Implement one supplied spec/ticket. | Pre-agreed TDD seams where possible, checks, `code-review`, then **commit to current branch**. Pin review baseline before work. Explicit skill invocation is materially broader than ordinary “implement this feature.” |
| `implement-spec` | Implement a ticket graph on one integration branch. | Requires tracker/spec/tickets, TDD seam agreements and parallel-capable tooling. Uses implementer/merger agents and isolated worktrees; creates a draft PR where tracker workflow calls for it, reviews, then marks ready/resolves tickets and cleans up. Scope these external actions to the selected feature. |
| `triage` | Categorize/verify incoming issues or external PRs and prepare agent-ready briefs. | Read prior context, recommend and wait for direction; reproduce bugs or verify diffs. Its remote comments carry the AI-triage disclaimer. Role changes, closing and rejected-request records are real writes. Do not re-triage already approved implementation tickets by default. |
| `wayfinder` | Map a huge uncertain effort as decision tickets. | Planning, not feature delivery; chart first, then normally resolve one ticket per session, with research exceptions. Can assign/close issues and push research branches. Do not use for a clear small feature. |
| `improve-codebase-architecture` | Explore friction, produce temporary visual HTML candidate report, then discuss a chosen candidate. | Uses an exploration subagent, then **waits for candidate selection** before grilling/design. Not permission to implement every suggested refactor. |
| `setup-ts-deep-modules` | Install/configure dependency-cruiser entry-point boundaries and prove pass/fail/pass. | Changes packages/config/scripts and adds an example package. Confirm this monorepo's actual package root; do not force Angular/NestJS features into its illustrative `src/packages` structure. |
| `retro` | Review a coding session and suggest environment improvements. | Read the actual session/checks; present prioritized candidates. A retrospective is not blanket authority to add tools, hooks, rewrite global instructions or change product code. |
| `handoff` | Write a redacted continuation document in OS temporary storage. | Reference existing artifacts rather than duplicate them; include suggested skills. Does not launch a new agent/chat. |
| `claude-handoff` | Write a handoff, then launch `claude --bg` with it. | Requires that separate CLI and an explicit request for that handoff. Not a transparent Codex continuation or automatic context-compaction path. |
| `chief-of-staff` | Long-running goal coordination through subagents. | All execution goes through subagents; considers environment improvements and possible schedules. Use only when explicitly chosen; ordinary tasks do not authorize recurring automations or unrelated environment changes. |
| `loop-me` | Interview recurring personal/operational workflows into `workflows/*.md`. | Not a feature implementation loop. Stateful discovery and workflow specs, not application code or automatic scheduling. |
| `to-questionnaire` | Draft an asynchronous questionnaire for another knowledgeable person. | Ask who it is for and what must be learned, then write the document. Does not send it. |
| `wait-what` | Re-explain the last message in clear, simplified language and project terminology. | Communication correction only. |
| `teach` | Multi-session learning workspace with lessons/reference records. | Educational artifacts, not production changes. Use a deliberate teaching workspace rather than adding lesson machinery to this app incidentally. |

## The project-local implementation companions

| Work | Guidance to load | What remains authoritative |
|---|---|---|
| Angular implementation | `apps/web/.agents/skills/angular-developer/SKILL.md`, relevant references, [Angular MCP workflow](angular-ai.md). | Installed Angular 22 APIs, standalone/signal patterns, current form strategy and agreed UI behavior. |
| Tailwind/UI work | Existing CSS-first setup and [UI/UX workflow](ui-ux-motion-workflow.md). | Tailwind 4, semantic tokens, explicit user direction; the design spec is provisional. |
| NestJS implementation | `apps/api/.agents/skills/nestjs-best-practices/SKILL.md` plus [project adaptations](nestjs-skill.md). | NestJS 12 feature modules/DI, Prisma/Vitest/Supabase and detailed API contracts. TypeORM/Jest/custom-token examples are not the selected stack. |
| Prisma queries/transactions | `prisma-client-api/SKILL.md` under the API skills directory. | Prisma 7 client, `PrismaService`, owner-scoped access and transaction invariants. |
| Prisma commands | `prisma-cli/SKILL.md`. | Workspace-installed CLI/config; explicit schema-change authorization; controlled migrations. |
| Connection repair | `prisma-orm-setup/SKILL.md`, existing Prisma 7/PostgreSQL branch. | Supabase production database, local Compose PostgreSQL; no provisioning of a substitute database or major upgrade. |
| Supabase auth/database security | Current official documentation and project contracts; no dedicated Supabase skill was advertised or found in the inspected global roots. | Supabase-issued identity, NestJS domain authorization, deliberate database role/grant/RLS design and real isolation evidence. |

## Default feature path: no special user-only skill required

### 1. Establish scope and acceptance

**Agent:** inspect relevant source/config, applicable AGENTS and base/update specs; preserve unrelated changes. Identify the user-visible outcome and current milestone. Separate actual implementation from placeholders. Use `domain-modeling` only for a real terminology decision, `codebase-design` only for an interface/testability decision, and a direct primary-source lookup for a narrow API fact. Use `research` when a scoped investigation and delegated result are actually warranted.

**User:** resolves missing product/contract decisions, not discoverable repository facts. A planned design-spec revision does not settle new visual choices; use the UI workflow for that part.

**Output:** concise plan with behavior, affected frontend/backend/persistence contracts, acceptance/failure cases, proposed test boundaries, needed schema/spec edits and checks. Proceed without routine approval when those decisions and authorization are settled.

### 2. Resolve schema, auth and contract dependencies

The root instructions require an **explicit request** before changing product specs or the Prisma schema. A general feature request alone does not remove that boundary. If required, present the concrete proposed schema/contract scope for that request, complete independent work, and ask once for the missing authorization. Reuse earlier explicit authorization when it covers the same change.

For auth work, settle transport/session/CSRF behavior against the base and Supabase update. Validate the Supabase-issued identity; never trust a client-supplied owner ID or merely decoded claims. Map external identity to the application user, and owner-scope nested reads/writes as well as top-level routes.

Supabase's [JWT guidance](https://supabase.com/docs/guides/auth/jwts) explains signature verification and claims. Its [RLS guidance](https://supabase.com/docs/guides/database/postgres/row-level-security) documents roles and bypass behavior. Do not assume a direct Prisma connection has the same identity/RLS context as a user-token Data API request. Identify the actual database role, exposed schemas and grants for the selected environment; keep privileged credentials out of the browser. This guide does not silently choose an RLS architecture or rewrite Supabase-owned auth tables.

Keep the detailed `/api/v1` DTOs, error shapes, concurrency, idempotency and ownership contracts. Generated OpenAPI/client tooling is planned, not present; implementing it is a scoped task, not permission to invent scripts or hand-maintain duplicate contract models indefinitely.

### 3. Choose normal implementation or requested TDD

**Normal default:** implement a small coherent increment and write meaningful behavior tests at the actual public boundaries. Tests may be written before a fix when that establishes the failure. Ordinary testing does **not** inherit the `tdd` skill's extra confirmation ceremony merely because tests exist.

**When `tdd` is selected:** before any test, list the proposed seams, what each catches and misses, and obtain the user's agreement unless the user already specified/confirmed them. Example choices:

| Test boundary | Catches | Does not establish |
|---|---|---|
| Pure ranking function with fixed inputs/time | Arithmetic, ties, hard constraints, UNKNOWN/NEUTRAL semantics. | Database isolation, JWT validation or UI behavior. |
| NestJS HTTP endpoint with disposable PostgreSQL | Authentication/authorization path, contract responses, transactional/concurrency behavior. | Real email delivery or browser focus/interaction. |
| Angular component/router using contract-shaped fixtures | UI states, validation, navigation and request behavior. | Real database semantics or end-to-end authentication. |
| Real browser against test API/auth setup | Cross-app task completion and affected interaction behavior. | Broad security coverage or every assistive-technology/device combination. |

Then run one failing behavior → minimal passing implementation → next behavior. Follow `tdd/tests.md` and `mocking.md`; avoid tests of private methods, tautological expectations or assertions only on internal calls. Its own workflow places refactoring at the review stage. Keep necessary persistence invariants observable at the agreed persistence/API boundary rather than mocking away the guarantee.

### 4. Implement a coherent vertical slice

**Agent:** load only the relevant project-local framework/Prisma guidance and global specialist. A single feature can cross layers without implementing every module at once:

1. Approved schema/migration/data constraints where required; validate/generate with the installed Prisma 7 CLI.
2. NestJS service/HTTP boundary with typed DTOs, owner access, error/concurrency/idempotency behavior and explicit transaction scope.
3. Angular state/forms/routes and actual UI recovery states, styled through existing Tailwind 4 tokens. Use the generated-client path once implemented; keep temporary fixtures explicitly developmental.
4. Tests proving that narrow outcome and its relevant failure cases.

Keep ranking pure and provider-independent; pass clocks/data explicitly. Preserve evidence-backed catalog facts, immutable snapshots/run history, stale-result handling and fragrance-free outcomes. Query/transaction changes use Prisma guidance rather than translating TypeORM samples mechanically. Document non-obvious invariants with `document-jsdoc` while editing them.

Do not create a repository wrapper for every simple query, a new package for every utility, or a second glossary just to satisfy generic architecture prose. Keep Angular components and NestJS service/module names meaningful in their actual frameworks; the deep-module vocabulary does not rename domain concepts.

### 5. Verify the changed guarantee

Run focused checks while building, then the relevant app/root checks when the increment is ready. Root commands and known gaps are documented in [AGENTS.md](../../AGENTS.md). Useful current commands include:

```sh
pnpm --filter api exec prisma generate
pnpm lint
CI=true pnpm test
pnpm --filter api test:e2e
pnpm build
```

Select rather than blindly run every command: API E2E needs an API environment and reachable disposable PostgreSQL, and is separate from root tests. There is no root `typecheck`, migration/seed, contract-generation or evaluation command yet. Compilation/lint/tests establish different things; report actual evidence and missing checks. Root build success was confirmed by the user in the readiness audit; agent tool-visibility limitations are not a repository defect.

For a changed private-data feature, include relevant cross-owner read/write denial, nested foreign-owner IDs and the contract's absent/not-owned behavior. For transaction/versioned flows, include the applicable rollback, conflict, replay/idempotency and stale-dependency cases. Use real PostgreSQL semantics for those guarantees; a mock or alternative in-process database is not equivalent evidence. Exercise Supabase-specific auth behavior against an appropriate test setup when that behavior is in scope; local Compose alone supplies no Auth service.

Use the UI workflow/Playwright for changed browser interactions, and deterministic fixtures for scoring changes. No live provider calls are required merely to prove AI-disabled behavior. Use synthetic/private-development-safe data rather than production identities or the source person's answers.

### 6. Review and deliver

Ordinary scoped self-review is part of implementation. Check acceptance, source diff, public contracts and applicable Code Review Rules. A formal `code-review` skill run is a matching separate review path, not an automatic requirement for every edit.

**Default output:** changed behavior, checks/results, material limitations and remaining dependencies. No automatic commit, tracker write, PR, merge, deployment, global setup or live database action follows solely from “implement this feature.” If the user explicitly selected a broader skill, follow its authorized additional actions within the selected task.

## Optional GitHub Issues path

The user chose GitHub Issues for future ticketed work. The repository currently has no `docs/agents/issue-tracker.md`, label mapping, or configured suite domain guidance. Existing PRD terminology and `docs/adr/` remain valid; this absence is not a blocker for ordinary coding.

1. **User explicitly selects setup** if they want the installed suite. Use `setup-matt-pocock-skills` by its actual path/host invocation; confirm repository target and any unresolved label/doc choices. Show the draft before writing. A GitHub remote or plugin connection alone does not select triage behavior.
2. For an unclear idea, **user requests grilling**; `grilling` is agent-selectable for that intent, or the user explicitly chooses `grill-with-docs`. Use an actual prototype/research detour only if the uncertainty calls for it.
3. **User invokes `to-spec`** when publishing a synthesized feature spec is wanted. Confirm the test seams, then publish in the configured repository. Keep it consistent with existing normative specs; identify authorized overrides explicitly.
4. **User invokes `to-tickets`** for a large settled feature. Present vertical slices/blocking edges and wait for breakdown approval, then publish. A clear small feature does not need tickets for every layer.
5. **User chooses ordinary implementation, `implement`, or `implement-spec`.** Ordinary implementation can work from an approved GitHub issue without acquiring the other skills' commit/orchestration side effects. `implement` adds its TDD/review/commit path; `implement-spec` adds integration-branch/worktree/subagent/tracker/PR work. Agree test seams and the review baseline before their executors start.
6. **Agent uses `pr`** if writing a PR description is in scope. Publishing or advancing a PR follows the user's chosen delivery scope/skill, not merely the existence of a description.
7. **User invokes `retro`** if a retrospective is wanted. Present improvements before starting a separate environment-change task.

Never auto-invoke an explicit-only skill because another skill references it: for example `code-review` can report its missing tracker setup, but does not authorize automatically running `setup-matt-pocock-skills`. Configure/enable nothing during this documentation review.

## Formal review, diagnosis and delegation branches

**Formal review:** establish a resolvable baseline and spec/standards sources; obtain missing tracker context rather than install it. The current skill uses `git diff <baseline>...HEAD`: explicitly account for whether staged/unstaged/untracked work belongs in the requested review. Do not create a commit just to satisfy the skill. If working-tree review is wanted instead, perform/report that scope honestly rather than presenting an empty committed diff as a complete review. The Standards and Spec agents stay separate; missing spec coverage is stated.

**Bug fix:** use `diagnosing-bugs`, reproduce the user's actual symptom before choosing the cause, capture redacted evidence, change one hypothesis at a time, verify the original scenario and remove temporary probes. If a suitable regression test boundary exists, lock down the bug; if it does not, report the limitation. Do not invoke `improve-codebase-architecture` automatically just because a useful seam is missing—it is explicit-only.

**Delegation:** normal work stays in this chat unless the user or a selected skill branch explicitly requires/authorizes agents. `research`, formal `code-review`, requested Design It Twice, and explicit `implement-spec`/architecture/chief-of-staff flows have specific delegation instructions. Give agents bounded tasks and references; respect available concurrency. Independent work can overlap; shared schema, migrations, generated contracts and merge conflicts need coordination. A skill's illustrative `Skill` tool or named agent does not establish that the host exposes it: load available skill files and supported tools, disclose missing capabilities, and do not claim a prescribed multi-agent run occurred when it did not.

**Setup/manual tasks:** `wizard` is for genuine human-only steps, not work the agent could do through available tools. `setup-pre-commit` and `setup-ts-deep-modules` are environment changes, not default feature stages. Preserve existing configs/scripts and scope staging/commits to the authorized change.

## Requests that select the intended path

- “Implement FR-02 collection rating edits. Give a concise plan, preserve UNKNOWN versus NEUTRAL, and verify cross-owner access. Identify schema dependencies before changing the schema.” → ordinary feature workflow.
- “Implement this behavior test-first. Test through the HTTP endpoint with disposable PostgreSQL; I confirm that test boundary.” → `tdd` with an already agreed seam; do not ask the same question again.
- “Diagnose and fix this 409 after resuming the consultation.” → `diagnosing-bugs`, with the real version/conflict reproducer.
- “Review this committed branch since `<baseline>` against `<spec path>`.” → formal `code-review`, subject to its tracker/context prerequisites.
- “Use `to-tickets` from `~/.codex/skills/to-tickets/SKILL.md` for this agreed feature.” → explicit-only ticket breakdown, approval and publication after configuration.
- “Use `implement-spec` on these approved tickets; use these confirmed test boundaries and this review baseline.” → explicit orchestration workflow, not a synonym for a normal coding request.
- “Use `handoff` to prepare the next chat.” → redacted temporary document; it does not itself create or launch a chat.

No question about architecture or tooling is answered by the number of installed skills. Use the current task and executable evidence to choose the next step.
