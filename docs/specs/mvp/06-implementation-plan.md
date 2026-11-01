# 06 — Implementation plan

Version 1.0 · 31 October 2026

Companions: [PRD](01-product-requirements.md), [Technical requirements](02-technical-requirements.md), [App flow](03-app-flow.md), [Design brief](04-design-brief.md), [Backend schema](05-backend-schema.md).

## 1. Delivery strategy

Build one complete deterministic consultation before adding AI enrichment. Deliver vertical slices in the existing Angular/NestJS/PostgreSQL/Prisma/pnpm stack. The full MVP includes privacy, catalog curation, wardrobe, wishlist and sample feedback; these are not optional post-launch work. Provider integration can remain disabled at launch if its gates fail.

Planning assumption: one experienced developer working mostly full time, managed hosting/database/email services, no existing production code. Estimate **45–60 focused engineering days**, then a two-week pilot that can overlap fixes. This is a planning range, not a promised delivery date. Catalog research/licensing can add time. Avoid counting visual polish, evaluation, migrations, and operations as free work.

Build the first slice with 10 verified identities; expand to a targeted 40–60 verified fragrance revisions for pilot. This is sufficient to test the workflow, not to promise comprehensive market coverage. Prefer breadth across wardrobe roles and documented uncertainty. Do not import the earlier assistant’s notes/prices as verified facts. Curator labor is a real dependency.

Critical path: M0 → M1 → M2 → M3 → M4 → M5 → M6 → M8. M7 (optional AI) depends on M3/M4 and may be skipped for launch. Perform security, accessibility, and evaluation checks during each milestone, not only at M8.

## 2. Milestones and exit gates

| Milestone | Estimate | Work and deliverables | Exit gate |
|---|---:|---|---|
| M0 — Foundation | 3–4 days | Pin compatible runtimes; pnpm workspace; Angular shell; NestJS modules; PostgreSQL/Prisma migrations; contracts generation; CI; design tokens; architectural decisions | Clean checkout installs with frozen lockfile, builds, migrates a fresh DB, serves authenticated shell in staging; version matrix recorded |
| M1 — Identity and collection | 5–6 days | Passwordless sessions, CSRF, owner repositories; catalog drafts/revisions/provenance; 10 verified entries; search/alias resolution; collection and ratings | Ambiguous editions remain unresolved; user A cannot read or mutate user B’s entries; UNKNOWN differs from NEUTRAL; no unverified published IDs |
| M2 — Progressive interview | 5–7 days | Versioned questionnaire, four rounds, autosave/conflicts/resume, bounded clarifications, review, deterministic summaries | Full source-derived fixture completes with AI disabled; reload resumes accurately; earlier edits invalidate later summaries; unknown answers remain unknown |
| M3 — Profile and scoring | 6–8 days | Profile snapshots/evidence/corrections; feature vocabulary; eligibility, components, diversity, reason templates; run persistence | Determinism and hard-filter tests pass; 100% result IDs/evidence valid; reference commute override respected without erasing general presence |
| M4 — Results and discovery | 4–5 days | Profile/results UI, source drawer, uncertainty, comparisons, empty/stale/withdrawn states; curator catalog grows toward 40–60 items | All explanations trace to inputs; no unsupported price/performance claims; useful deterministic shortlist without provider access |
| M5 — Wardrobe and daily decision | 5–6 days | Season/occasion slots, pins, gaps/overlap, ContextPresets, owned-only daily choice, optional feedback | Former/unknown ownership excluded; fragrance-free always returns NO_FRAGRANCE; stale pins visibly unavailable; mobile grid alternative works |
| M6 — Wishlist, trials, privacy | 5–7 days | Wishlist states; checkpoints; explicit rating/purchase confirmations; profile updates; exports/deletion/tombstones; job worker | End-to-end sample feedback refreshes profile; no implicit purchase/ownership; export complete; primary deletion and restored-backup suppression verified |
| M7 — Optional AI adapter | 3–5 days | Provider abstraction, consent, minimized input, schema validation, reason-bound wording, quotas, timeout/fallback, spend metrics | AI disabled/outage/malformed output all preserve core functionality; malicious inputs cannot add products or alter ranks |
| M8 — Release hardening | 6–8 days | Accessibility/user tests, representative load, regression corpus, operational dashboards, backup restore, docs, deployment rehearsal | All release gates below met; operator can restore, disable provider, withdraw catalog item, and roll back app safely |

Base sum is 42–56 days including optional M7; 45–60 includes integration contingency. If deadline pressure arises, defer M7, imagery, rich charts, and advanced comparison styling. Do not cut ownership isolation, factual provenance, deletion, or deterministic fallback.

## 3. Concrete backlog by slice

### Foundation

- Create workspace scripts: `dev`, `build`, `lint`, `typecheck`, `test`, `test:integration`, `test:e2e`, `contracts:generate`, `contracts:check`, `db:migrate`, `db:seed`, `evaluate`.
- Docker-based local PostgreSQL and development email inbox; `.env.example` names only, never real secrets.
- Validate runtime environment on boot; fail clearly on missing database/session/email settings; provider settings optional.
- Establish migration discipline, generated client checks, API error envelope, request IDs, and health endpoints.
- Record decisions: modular monolith, versioned catalog, typed questionnaire rather than autonomous chat, deterministic rank authority, privacy defaults.

### Catalog and collection

- Implement curator CLI first for seed import and review; build only a minimal admin page for drafts/publish/withdraw.
- Write source checklist: exact identity/concentration, legitimate source URL, access date, permitted excerpt, fact versus editorial estimate, unresolved conflicts.
- Seed private development fixtures separately from production catalog. Never ship the real reference person’s answers as public sample data.
- Resolve alias candidates such as “Prada paradigm” through explicit confirmation; test ambiguous names and multiple concentrations.
- Add source-retrieval retry/review procedures for the curator; ordinary recommendation requests must not fetch arbitrary web pages.

### Consultation and profile

- Define questionnaire JSON schemas and stable question IDs before building UI.
- Implement saved round revisions and current answers endpoint; create summaries from templates.
- Build profile evidence view and correction action before adding impressive summary copy.
- Test date/general presence versus office commute override; keep emotional appeal separate from note affinity.
- Implement all statuses and failures from document 03 with shared components.

### Scoring and output

- Keep scoring pure; fixture-based inputs do not query live database or provider.
- Start with hard filters, then score components, then evidence-aware explanation templates, then diversity.
- Persist run inputs/revisions before exposing history; do not backfill provenance later.
- Build one recommendation detail with uncertainty and source evidence; then add list and comparison.
- Add golden outputs for the version 1 scorer. Weight changes require a new scoringVersion and evaluation report.

### Feedback loop and operations

- Implement wishlist/trial transitions as service methods with authorization and concurrency checks.
- Record observations independently of final rating; preview the proposed rating change before saving it.
- Export every private model, including unresolved identities and historical snapshots; version the export schema.
- Deletion drill includes provider jobs, caches, export artifacts, logs, audit identifiers, and backup restoration.
- Write runbooks: catalog withdrawal, queue recovery, provider shutdown, database restore, migration rollback, account deletion failure.

## 4. Evaluation dataset and test design

Use version-controlled anonymous fixtures and a pinned catalog release. Synthetic feature vectors are valid for numerical unit tests but never appear as named fragrances in UI or catalog. Real-perfume end-to-end fixtures require curator-verified identity records. Keep a separate approved development-only source-derived persona fixture; redact irrelevant body descriptions.

Minimum release corpus: 30 structured profiles × 8 contexts = 240 deterministic decisions, plus edge-case scenarios and 100 adversarial explanation inputs. Cover beginners, sparse collection data, confident favorites, contradictory ratings, high/low sweetness, climate differences, former ownership, and strict shared spaces. These are engineering fixtures, not evidence that personalization works for the general population.

### Required tests

| ID | Test / input | Expected result |
|---|---|---|
| E01 | Same canonical input and versions repeated 100 times | Identical selected IDs, ranks, reason codes and numeric scores |
| E02 | Source-derived user: noticeable generally, discreet office commute | Office rule applies only in matching context; general preference retained |
| E03 | Rose of No Man’s Land UNKNOWN; Rose Noir NEUTRAL | Neither becomes dislike; UNKNOWN contributes no inferred signal |
| E04 | Favorite composition includes rose, no explicit rose preference | At most a labelled low-confidence hypothesis; no “confirmed rose lover” claim |
| E05 | Fragrance-free gym with otherwise perfect candidates | NO_FRAGRANCE, empty items, no provider call |
| E06 | Former/unknown/sample-only entries with high ratings | Not offered as currently available to wear |
| E07 | Strong or unknown projection under strict shared-space cap | Excluded with accurate reason; no silent relaxation |
| E08 | Catalog name absent/unresolved/withdrawn | Cannot enter new recommendation shortlist |
| E09 | Same-name different concentration | User resolves variant; no silent merge |
| E10 | Conflicting stale edit or duplicate network POST | 409 with preserved local data, or idempotent prior result; no duplicate runs |
| E11 | Malicious answer/source text asks to ignore rules or invent perfume | Treated as data; no unauthorized state change or unknown ID |
| E12 | Provider timeout, invalid JSON, extra fields, bogus citations | Template result remains usable; failed output not rendered |
| E13 | Cross-account IDs at every route and nested FK | 404/denial; no data disclosed or linked |
| E14 | Complete trial without confirming rating/purchase | No ownership or profile mutation |
| E15 | Confirm new trial rating | Append rating/profile version; old runs retained and marked stale |
| E16 | Strict budget with no valid compatible price evidence | PRICE_UNVERIFIED exclusion; no fabricated price |
| E17 | Account deletion during queued provider/export work | New work blocked, sessions revoked, private data erased on schedule |
| E18 | Restore backup containing deleted user | Tombstone replay removes user before traffic resumes |
| E19 | Keyboard and screen reader complete all four rounds | Focus/progress/error state understandable; no inaccessible action |
| E20 | All catalog features missing but direct personal LOVE rating | Taste can be represented with limited evidence; no invented context/performance fit |
| E21 | Diversity/overlap with insufficient shared feature coverage | No asserted duplication; uncertainty shown |
| E22 | Catalog release changes after saved run | Historical revision reproducible; active withdrawal blocks action |
| E23 | One tab logs out while another has unsaved answers | No new authenticated writes; private memory clears on explicit logout event |
| E24 | Preference correction and run generation race | Consistent snapshot or 409; never mixed-version result |

Numerical tests must also cover the example score 75.0, exact threshold boundaries, min/max longevity gaps, tie ordering, candidate coverage below .40, and role similarity threshold .85. Do not merely snapshot implementation output without asserting domain invariants.

### Quality measures

Hard gates: 0 invented catalog IDs; 0 ungrounded product claims in approved explanation suite; 0 hard-constraint violations; 0 cross-account accesses; 100% deterministic repeatability. Any failure blocks release of the affected feature.

Human evaluation: two reviewers independently score 30 selected results for preference relevance, context appropriateness, explanation faithfulness and uncertainty clarity on a 1–5 scale. Target mean ≥4 with no context appropriateness score of 1. Review disagreements and refine fixtures. For a solo builder, recruit an external reviewer for a small time-boxed session; if unavailable, ship a clearly limited private alpha rather than claim independent validation.

Measure ranking utility through pilot feedback and actual sampling, not similarity to the earlier assistant’s exact shortlist. Report precision-like metrics with denominators; do not claim a validated prediction probability from a small sample. Do not optimize to match one reference persona at the expense of other users.

## 5. Traceability matrix

| Requirement | Primary implementation | API/model anchor | Release evidence |
|---|---|---|---|
| FR-01 Privacy/accounts | M1, M6, M8 | User, AuthSession, ConsentEvent, PrivacyRequest | E13, E17, E18, export audit |
| FR-02 Collection | M1 | CollectionItem, PreferenceRating, catalog routes | E03, E06, E08, E09 |
| FR-03 Four rounds | M2 | Consultation, InterviewAnswer, RoundSummary | E02, E10, E19, resume E2E |
| FR-04 Profile | M3 | ProfileVersion, ProfileEvidence, corrections | E04, E15, E24 |
| FR-05 Recommendations | M3, M4 | RecommendationRun/Item/Evidence | E01, E07, E08, E11, E12, E16, E20 |
| FR-06 Wardrobe | M5 | WardrobePlan/Slot/Assignment | E06, E21, E22, pin-refresh E2E |
| FR-07 Daily decision | M5 | POST /decisions, DecisionFeedback | E02, E05, E07 |
| FR-08 Wishlist/trials | M6 | WishlistItem, SampleTrial, SampleObservation | E14, E15, purchase-confirm E2E |
| FR-09 Provenance | M1, M4 | CatalogClaim/Revision/Release, SourceRecord | E08, E09, E11, E22 |
| FR-10 Operations | M0–M8 | Jobs, logs, backups, deployment | E10, E13, E17–E19, load/restore reports |

## 6. CI, staging, and deployment

Every PR: frozen-lockfile install; lint/typecheck; unit tests; generated OpenAPI/client diff check; migration against disposable PostgreSQL; ownership/concurrency integration tests; deterministic evaluation corpus; dependency/secret scan. Changed UI flows additionally run focused E2E and automated accessibility scans. Nightly or pre-release: full E2E, representative load, provider contract tests using mocks plus an explicitly budgeted live smoke test if configured.

Staging uses separate database, catalog release, email recipient restrictions, and provider key/budget. Never copy production user answers into staging. Deploy migration once, then API/worker, then compatible SPA. Apply backward-compatible additive schema changes first. Roll back application image on regression; do not drop populated columns to roll back. Feature flags: `aiEnrichment`, `discovery`, `catalogPublication`; deterministic owned decision remains independent.

Launch checklist:

- Version pins and production environment configuration reviewed.
- Catalog coverage and rights reviewed; all publishable claims traceable.
- No P0/P1 defects, cross-account access, or hard-filter failures.
- Performance budgets from document 02 measured on documented hardware/catalog size.
- Keyboard/screen-reader/reflow tests passed; no critical automated accessibility findings.
- Restore completes within RTO and deleted-account replay works.
- Export contains all private feature data and is owner-protected.
- Provider-off path tested; spending caps and emergency disable confirmed.
- Error/queue/backup monitoring active with an identified operator.
- Privacy copy, retention policy and provider terms reviewed for the deployment context; do not state legal certification based on this checklist.

## 7. Risks, mitigations, and decision checkpoints

| Risk | Mitigation / trigger |
|---|---|
| Catalog work consumes the schedule | Limit pilot to verified role-diverse set; show missing coverage; do not substitute generated facts |
| Feature scoring implies certainty | Separate score/coverage, preserve unknown values, explain hypotheses and sample-first intent |
| Reference persona dominates rules | Evaluate diverse profiles; never hard-code its favorite names or recommended shortlist |
| Optional AI becomes critical path | Templates and structured answers ship first; disable enrichment if grounding gate fails |
| Schema/snapshot complexity grows | Normalize mutable workflows; JSON only for versioned bounded snapshots/contracts; avoid event-sourcing all state |
| Solo maintenance burden | One monolith/image, managed DB, minimal admin, no live scraping or microservices |
| Scope expands into shopping | Keep prices optional and sourced; defer checkout/affiliate links |
| Source conversation is incomplete beyond exposed turns | Preserve explicit retrieval limitation; do not infer missing collection items or control selections |

M0 decisions to record: exact dependency versions, hosting/email provider, deployment region and retention implementation. M1: verified catalog coverage and licenses. M3: approve scorer v1 only after corpus review. M6: verify deletion/export behavior before pilot. M8: decide whether optional AI meets release gates.

## 8. Handoff and definition of done

The six documents are mutually linked implementation specifications. The first engineering task is to create the workspace and an executable contract test for collection → four rounds → profile → owned decision with AI disabled. Review this slice before broadening the catalog or polishing long-form prose.

An increment is done when its API/model/UI states agree, authorization is tested, meaningful failure states work, relevant accessibility checks pass, migrations are reproducible, and evidence is recorded. The MVP is done when a user can complete the full consultation, get explained verified recommendations, manage wardrobe/wishlist/samples, correct preferences, export/delete data, and continue using the core product during a provider outage.

This document set is a planning deliverable. No application, production migration, perfume catalog verification, performance benchmark, or usability study has been executed as part of authoring it.
