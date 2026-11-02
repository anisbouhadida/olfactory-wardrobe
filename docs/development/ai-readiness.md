# Readiness for Codex-driven development

Assessment date: 2 November 2026. This is a repository/developer-workflow assessment, not a production security certification.

## Verdict

Ready for bounded, spec-led coding increments with review and verification. Foundation milestone M0 is partial. The repository does not yet provide the domain tests, contract generation, persistence setup, or operational gates needed to trust broad autonomous feature delivery. Application AI is a separate concern: Codex can develop the app while its optional LLM adapter remains unimplemented.

| Area | Evidence | Readiness |
|---|---|---|
| Product intent | Six base specs, six companion updates and CI/VPS addendum; FR acceptance criteria, API contracts, domain invariants and release cases. | Strong basis once precedence is explicit. |
| Developer setup | Matching Node 24.21.0 / pnpm 12.6.0, workspace, lockfile, installed dependencies, Prisma 7 adapter and generation, local PostgreSQL Compose. | Usable locally; fresh-install/database reproducibility not established by this audit. |
| Code organization | Standalone Angular starter and empty routes; NestJS feature modules; shared CSS tokens. | Clear seams, very little implemented product behavior. |
| Feedback loop | Type-aware Oxlint, Angular/Vitest and API Vitest, CI source checks. Four starter assertions pass. | Fast scaffold feedback; no domain safety net. |
| Persistence/auth/contracts | Prisma schema has no models/migrations; Supabase auth, owner repositories and generated API contracts are absent. | Main blocker before private data features. |
| Evaluation | Detailed numerical/edge-case requirements in 02/06; no scoring or evaluation package yet. | Good test specification, no executable acceptance evidence. |
| UI verification | Angular builds/tests exist; template/CSS lint, browser E2E and automated accessibility checks are absent. | UI correctness needs focused browser/manual evidence until harnesses exist. |
| Delivery/operations | CI installs/lints/generates/tests/builds source; Docker publication, Coolify trigger, restore/deletion runbooks and operational services are absent. | Not release-ready. |
| Agent context | Root guidance was accurate, API guidance was telemetry-only, web guidance absent; ten local Prisma skills included unrelated workflows. | Improved in this change: scoped root/API/web instructions, task routing, three retained Prisma skills plus the official Angular developer skill and community NestJS best-practices skill. |

## Coherence findings and changes

The repository initially had two agent instruction files, root and API; no repository `CLAUDE.md` or override file was found. The discoverable user-global `~/.codex/AGENTS.md` was empty, and the checked ancestor directories supplied no additional instructions. This audit covers repository guidance and the session skill catalog, not private chat history or every possible global tool configuration.

1. Root instructions correctly distinguish the scaffold from the target architecture. Added a concise-plan-then-implement workflow, app-level pointers, skill selection, and domain review rules; retained the explicit spec/schema edit boundary.
2. API instructions focused exclusively on installing/using NestJS Observe, despite no configured module or dependency. Replaced them with actual NestJS/Prisma/auth/testing boundaries and optional, scoped incident telemetry guidance. No telemetry service was installed.
3. Added web instructions for Angular/Tailwind, semantic tokens, relevant flow states and verification gaps. Generic design skills must not introduce React libraries or replace the product brief.
4. Clarified existing spec precedence in the workflow: the Tailwind/Supabase update overrides older Bootstrap/bespoke-auth architecture; detailed base API contracts override illustrative helper tables. For example, the base uses `/profiles/current` and `/sample-trials`, while helper maps use `/profile` and `/samples`. The spec files themselves were preserved.
5. The auth update selects Supabase JWT identity, while the base includes bespoke session-cookie/CSRF details. Resolve the concrete transport and retained security controls at the auth slice before coding; this assessment does not invent a new auth contract.
6. Pruned seven irrelevant repository-local skills and their references, leaving three applicable Prisma skills; synchronized `apps/api/skills-lock.json`. Preserved the existing-application branch of ORM setup and changed two removed sibling links to their upstream URLs. Global skills were not removed. The [skill guide](skills.md) documents relevant coding routes rather than cataloging unrelated skills.
7. Replaced app starter READMEs that advertised unrelated framework hosting and an unconfigured `ng e2e` target with actual workspace commands and limitations. Setup examples now preserve an existing local `.env`.

8. Following the user's Angular guidance, installed the official `angular-developer` skill under the web app, registered the installed Angular CLI MCP server in project-scoped Codex configuration, and added [the Angular AI workflow](angular-ai.md). Framework implementation follows Angular's maintained guidance; design skills remain complementary.

9. Reviewed and installed the community `nestjs-best-practices` skill for scoped API implementation/review. Added [project adaptations](nestjs-skill.md) for Prisma, Vitest, Supabase identity, API contracts and the selected monolith; generic examples do not authorize infrastructure changes.

10. Read the 21 session-available global UI/UX/motion/browser/performance skill entry points, checked invocation metadata and relevant branch references, and added [the dedicated workflow](ui-ux-motion-workflow.md). Corrected three user-only invocation routes and documented duplicate prototype names, audit stop points and Angular/Tailwind conflicts. The user clarified that the design spec is provisional and requested [a separate motion proposal](../proposals/motion-policy.md); the proposal does not alter active specs.

11. Reviewed 39 engineering/workflow skill entry points and invocation metadata: 19 advertised candidates plus 20 installed explicit-only skills. Added [the engineering workflow](engineering-workflow.md), including TDD test-boundary confirmation, committed-versus-working-tree review scope and optional orchestration side effects. The user selected GitHub Issues for future tickets; tracker setup and remote writes remain outside this review.

## Available-skill assessment

Reviewed the complete session-advertised catalog for applicability, local skill metadata/headings, and relevant skill bodies/references. This was a routing/coherence review, not a security audit or execution test of every installed skill script. Some skills present on disk were not advertised in this session; presence alone is not a promise of automatic discovery.

The strongest coding fits are the official Angular developer skill, Prisma CLI/client/setup, diagnosis, TypeScript documentation, interface design, domain modeling, targeted UI/browser verification, requested TDD, and PR/review guidance. [The skill guide](skills.md) provides triggers, prerequisites, overlaps and Angular adaptations. Design overlap and the duplicate `prototype` name require deliberate selection. The `code-review` skill needs a baseline/tracker context and delegates to subagents; it is not a zero-setup mandatory gate. Skills complement executable checks and do not replace missing auth/isolation, migrations, contracts or evaluation infrastructure.

The organization follows official OpenAI guidance on [root-to-directory instruction precedence](https://learn.chatgpt.com/docs/agent-configuration/agents-md), [selective skill loading](https://learn.chatgpt.com/docs/build-skills), and [keeping agent instructions and triggers scoped](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra). Repository instructions hold durable constraints; the workflow and skill guide disclose task-specific detail on demand.

## Verification evidence

Checks used the existing dependency installation; no fresh install, version upgrade, schema change or production action was performed.

| Check | Result |
|---|---|
| Runtime/package manager | Node `v24.21.0`, pnpm `12.6.0`, matching the repository. |
| `pnpm --filter api exec prisma generate` | Passed, generated Prisma Client 7.10.1. |
| `pnpm lint` | Passed for both apps. |
| `CI=true pnpm test` | Passed: API 2 tests in 2 files; web 2 tests in 1 file. These are scaffold assertions. |
| API production build | Passed during root build attempts. |
| `pnpm --filter web build` | Passed when run directly, initial bundle about 222 kB raw. |
| `pnpm build` | User confirms the root build succeeds. The agent tool returned unsuccessful/incomplete recursive-build output, so this audit does not independently establish its successful result. Treat as a tool visibility limitation, not a repository build defect. |
| Database/API E2E | Not run: Docker socket access was denied in this execution environment, so a disposable local database was not verified. |
| Angular AI setup follow-up | Installed official `angular-developer`; configured project-scoped MCP; verified initialization, nine advertised tools, web workspace discovery, and workspace-specific best-practices retrieval. Codex connection requires client reconnection. |

The root build is successful according to the user; the agent could not reliably observe that outcome through its execution tool. No repository build fix is indicated by this assessment. Local Markdown links, retained skill/lock membership, and `git diff --check` were also checked. Docker access denial is an environment limitation, not evidence of a database/application defect. Remote CI, branch protection and production resources were not inspected.

## Prioritized next increments

1. **Finish the M0 feedback loop.** Verify a frozen-lockfile clean checkout and add an isolated database test setup. Acceptance: setup and the documented checks work unattended without private services or production credentials. Choose and record the auth transport at its implementation boundary.
2. **Implement the M0/M1 private-data foundation.** Request the schema work explicitly, then add the minimum migrations, Supabase identity/owner boundary, strict DTO/OpenAPI contracts and disposable PostgreSQL tests. Acceptance: a fresh database migrates, another owner cannot read/mutate private objects, and the client contract is generated rather than duplicated.
3. **Build one AI-disabled vertical slice.** Collection → four rounds → immutable profile → owned decision, initially with a small verified catalog. Acceptance: resume/conflicts, UNKNOWN versus NEUTRAL, owned availability, deterministic replay and fragrance-free behavior have executable cases. Expand through the milestone gates rather than declaring each placeholder module complete.
4. **Add UI and release gates as the affected flows arrive.** Focused browser/a11y coverage, deterministic evaluation corpus, privacy/export/deletion checks, then CI image publication and controlled Coolify deployment with recovery evidence. Treat optional provider integration as M7, after deterministic behavior works.

Additional planning approval is not required by default: the user's preference is a concise plan followed by implementation. Unresolved product/contract decisions and the existing explicit schema/spec request boundary remain the points that need clarification.
