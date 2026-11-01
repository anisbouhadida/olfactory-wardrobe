# 06 — Implementation plan (updated for AI-assisted development)

[Note: Base content remains as in 06-implementation-plan.md. This version adds AI-oriented task lists per milestone without changing estimates or gates.]

## 9. AI-assisted tasks by milestone

### M0 — Foundation (AI task hints)

- Scaffold pnpm workspace with `apps/web`, `apps/api`, and shared `packages/*`.
- Implement basic NestJS modules structure (Auth, Users, Catalog, Collection, Consultations, Profiles, Recommendations, Wardrobe, Decisions, Wishlist, Sampling, Privacy, Jobs).
- Generate initial Prisma schema from 05 and run migrations on local PostgreSQL.
- Set up CI scripts (`lint`, `typecheck`, `test`, `test:integration`, `test:e2e`, `contracts:generate`).

### M1 — Identity and collection (AI task hints)

- Implement passwordless login endpoints and Angular sign-in flow.
- Implement `CollectionModule` endpoints and Angular collection components per 02 and 03.
- Implement curator CLI for catalog seed and basic admin UI for drafts/publish/withdraw.

### M2 — Progressive interview (AI task hints)

- Implement questionnaire schemas and `ConsultationsModule` endpoints (`start`, `load`, `save answers`, `confirm`).
- Implement Angular consultation round and review components wired to these endpoints.

### M3 — Profile and scoring (AI task hints)

- Implement `ProfileVersion` persistence and corrections endpoints in `ProfilesModule`.
- Implement deterministic scoring functions in `packages/scoring` per section 2 of 02.
- Implement unit tests for scoring, eligibility, diversity, and coverage.

### M4 — Results and discovery (AI task hints)

- Implement `RecommendationsModule` endpoints for DISCOVER/OWNED/WARDROBE.
- Implement Angular Discover and RecommendationDetail components per 03 and 04.

### M5 — Wardrobe and daily decision (AI task hints)

- Implement `WardrobeModule` endpoints and Angular wardrobe grid components.
- Implement `DecisionsModule` endpoint for daily scent decisions and Angular decision form.

### M6 — Wishlist, trials, privacy (AI task hints)

- Implement `WishlistModule` and `SamplingModule` endpoints and UI.
- Implement export/deletion routes in `PrivacyModule` and Angular settings screens.

### M7 — Optional AI adapter (AI task hints)

- Implement provider adapter, job handlers, and validation for `explainRun` and `interpretAnswers`.

### M8 — Release hardening (AI task hints)

- Implement automated test suites using fixtures from 06 and 02.
- Implement operational dashboards and health endpoints.

These lists are prompts for AI-assisted code generation, not additional functional requirements.

