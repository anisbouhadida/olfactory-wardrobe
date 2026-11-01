# 02 — Technical requirements

Version 1.0 · 31 October 2026 · Normative design baseline

See [PRD](01-product-requirements.md), [App flow](03-app-flow.md), [Design brief](04-design-brief.md), [Backend schema](05-backend-schema.md), and [Implementation plan](06-implementation-plan.md). Terms follow document 01; persistence follows document 05. Version 1 scores and thresholds below are proposed defaults to evaluate, not empirical truths.

## 1. Architecture and technology decisions

Use a **pnpm workspace with an Angular SPA, a NestJS modular monolith, PostgreSQL, and Prisma**. Use Bootstrap 5.3 SCSS for layout and visual primitives, Angular components for behavior, and Angular CDK only where accessibility/focus utilities justify it. Do not load Bootstrap’s imperative JavaScript alongside Angular-managed components. No microservices, Redis, vector database, or event bus in MVP.

```text
Browser — HTTPS, same origin
  /          Angular static assets
  /api/v1/*  NestJS API
                 ├─ PostgreSQL through Prisma
                 ├─ optional fixed, operator-configured LLM provider
                 └─ email delivery adapter for account authentication
NestJS worker process (same repository/image, distinct command)
                 └─ PostgreSQL Job table: explanation, export, deletion
```

Deploy the SPA and API behind one reverse proxy. Run API and worker as separate processes from the same codebase. Managed PostgreSQL with automated backups; private database access; TLS externally and to remote database. Scale only after measuring contention. An S3-compatible private bucket is optional for temporary exports; MVP may stream small exports directly through authenticated requests.

```text
apps/web/                    Angular routes and feature components
apps/api/src/modules/        NestJS domain modules and controllers
apps/api/src/worker/         Job handlers, no HTTP request dependency
packages/contracts/         Generated OpenAPI client/types and JSON schemas
packages/scoring/           Pure deterministic functions and fixtures
packages/db/                Prisma schema, migrations, seed/curation CLI
packages/ui-tokens/          Bootstrap variables and semantic design tokens
packages/evaluation/        Anonymous fixtures, adversarial cases, reports
```

Modules: Auth, Users, Catalog, Collection, Consultations, Profiles, Recommendations, Wardrobe, Decisions, Wishlist, Sampling, Privacy, Jobs. Modules communicate through typed services. Scoring cannot access the database, current clock, randomness, or provider network. Pass all data and reference timestamps explicitly.

Choose compatible supported Angular/Node/TypeScript versions at milestone M0 using the [Angular compatibility table](https://angular.dev/reference/versions). Pin exact package versions, Node runtime, pnpm version, and lockfile; Bootstrap remains on a reviewed 5.3 patch. Pin Prisma CLI/client to the same selected version and validate PostgreSQL-driver support in a smoke test. This specification does not assume “latest” packages are mutually compatible.

Use NestJS DTO validation with strict unknown-field rejection and generate OpenAPI from the controllers/DTOs using its [OpenAPI support](https://docs.nestjs.com/openapi/introduction). CI generates and checks the Angular client; handwritten duplicate DTOs are prohibited.

## 2. Deterministic recommendation pipeline

### 2.1 Inputs and canonicalization

Input: immutable ProfileVersion, confirmed rating snapshot, DecisionContext, collection availability snapshot, immutable CatalogRelease, scoringVersion, request mode, and explicit `asOf` timestamp. Modes: `DISCOVER`, `OWNED`, `WARDROBE`. Identical canonical inputs and versions must yield identical ranked items and explanations.

Normalize aliases only after user/curator identity confirmation. Concentration/edition differences remain separate. Unknown feature values are null, never zero. All canonical feature strengths are in [0,1]; taste directions use signed affinity [-1,1]. Shared versioned vocabularies cover family, note/accord, sensory descriptor, and context suitability. Notes describe perception or published accords, not chemical contents.

### 2.2 Profile inference

Explicit confirmed direction preferences have highest authority. A rating is mapped to LOVE=1, LIKE=0.5, NEUTRAL=0, DISLIKE=-1; UNKNOWN is excluded. Ranked anchors without a rating contribute 1.0, 0.8, 0.6 respectively; an explicit rating replaces that anchor weight to avoid double counting. A disliked anchor contributes -1 only for confirmed identity, and a prose reason remains independently represented.

For feature j, compute inferred affinity `a_j = sum(r_i * x_ij * q_ij) / (2 + sum(x_ij * q_ij))` using non-unknown ratings/anchors and known catalog features. `x_ij` is feature strength; `q_ij` is claim reliability, initially 1 for official note identity, 0.6 for reviewed editorial sensory annotations, 0.4 for limited performance reports. Neutral entries contribute to the denominator but never negative affinity. The prior weight 2 shrinks sparse observations toward neutral. User-confirmed affinity overrides the inferred affinity for that dimension. No inference from price, gender, body shape, or brand prestige.

Profile traits carry evidence references, confidence category, and status STATED, INFERRED, or CONFIRMED. Inferred note affinity from one composition is LOW confidence. Require at least three distinct supporting fragrances and no substantial opposing evidence before marking an inference HIGH; otherwise MEDIUM/LOW. User confirmation changes status, not the reliability of catalog facts. Return conflicting evidence rather than hiding it.

### 2.3 Hard eligibility filters

Apply before scoring:

1. `fragranceFree=true` → outcome NO_FRAGRANCE, no candidates, no LLM call.
2. Candidate must exist in the selected release, have published identity evidence, and not be currently withdrawn. Withdrawal is checked again when displaying saved runs.
3. OWNED/WARDROBE only: confirmed OWNED, `available=true`, resolved identity. DISCOVER excludes currently owned entries by default, but may include previously owned if requested.
4. Explicit excluded fragrance IDs and user-declared hard exclusions apply. A strict note exclusion rejects unknown note coverage too; explain that listed notes cannot guarantee ingredient/allergen absence. No medical safety engine.
5. Presence cap: reject candidates with verified expected projection above the cap. In strict shared-space mode reject unknown projection; otherwise retain as uncertain, with a visible caution. General presence preference is not a hard cap unless the user sets one.
6. Budget cap applies to DISCOVER only when a compatible, dated, verified offer exists for the requested bottle-size range and currency. If none exists, strict budget excludes with PRICE_UNVERIFIED; flexible budget retains with an unknown-price label. MVP does not require live prices. No currency conversion without a recorded rate/source.

Empty results remain empty. Explain exclusions and offer explicit changes to constraints; never silently relax them.

### 2.4 Component scores

Compute five [0,1] components, each with separate coverage. Missing inputs yield neutral 0.5 but zero evidence coverage; do not renormalize away missing evidence. A known direct personal rating can establish taste fit even if note data are sparse.

| Component | Weight | Definition |
|---|---:|---|
| Taste T | 0.40 | If direct known rating exists: 75% mapped rating `(r+1)/2` + 25% feature match; otherwise feature match. Feature match = `0.5 + 0.5 * sum(a_j*x_j*q_j)/sum(abs(a_j)*q_j)` over known candidate dimensions; clamp [0,1], 0.5 if denominator zero |
| Context C | 0.25 | Mean of known occasion, desired presence, outfit/formality, and desired identity matches; each dimension missing = 0.5. Curated compatibility values and categorical distance mappings live in scoringVersion |
| Season S | 0.10 | Weather band is authoritative when supplied, otherwise season preference; use curated suitability 0–1; seasonal flexibility softens to `0.5 + 0.5*(raw-0.5)` |
| Longevity L | 0.10 | If estimated range overlaps desired range: 1; otherwise `max(0,1-gapHours/6)`; null inputs yield 0.5. Estimates never guarantee wear time |
| Role value G | 0.15 | DISCOVER: `1 - max(roleSimilarity(candidate, each available owned item))`; OWNED: 0.5; WARDROBE: 1 if slot uncovered, else 0.5. Empty collection gives DISCOVER 1 |

`rawScore = 100 * (0.40*T + 0.25*C + 0.10*S + 0.10*L + 0.15*G)`.

`coverage = sum(weight * componentKnownFraction)`. Taste known fraction combines known direct rating and known feature contributions with the same branch weights; remaining fractions are known dimensions / total dimensions. If no active taste dimensions, taste coverage is zero. Below 0.40 coverage, mark LIMITED_EVIDENCE and exclude from default discovery shortlist; an explicit exploratory view may include them. This threshold must not block a user’s explicit wear choice.

Rank by rounded score to six decimals descending, then coverage descending, then Fragrance UUID lexicographically. Display whole-number fit scores only in detailed explanation; default UI uses relative fit labels. The score is not a probability.

Concrete categorical mappings in scorer v1: projection ordinals INTIMATE=0, MODERATE=1, STRONG=2, with presence match `1 - abs(candidate-desired)/2`; outfit/formality compatibility uses curated 0–1 values keyed by CASUAL, SMART_CASUAL, FORMAL, SPORT. Occasion and desired-identity matches use reviewed suitability values, averaging selected descriptors when multiple apply. Weather bands are COOL (<15°C), MILD (15–24°C), and WARM (>24°C) if manually entered temperature is supplied; alternatively users select the band without numeric temperature. These are product heuristics, not physical performance laws. A user may override an automatic band. All suitability values require claim provenance and null is neutral/unknown.

### 2.5 Diversity and gap analysis

For DISCOVER top 5, greedily rerank remaining candidates by `rawScore - 10 * max(roleSimilarity(candidate, selected))`. Similarity is cosine similarity of known nonnegative vectors of occasion suitability, season suitability, presence band, and formality. Require 60% shared dimension coverage; otherwise similarity is unknown, the diversity penalty is zero, and overlap cannot be asserted. Fix vector layout and band mappings in scoringVersion. Preserve both raw and reranked score in results. Designer/niche tags do not affect the score; optional user filter may constrain them.

Discovery appetite uses explainable tiers rather than popularity: SAFE candidates require rawScore ≥70, coverage ≥0.60, and roleSimilarity ≥0.60 to at least one LOVE/LIKE anchor at adequate shared coverage. EXPLORATORY candidates pass hard filters and ordinary coverage gates but need not meet SAFE thresholds; explain the new direction and uncertainty. BOTH targets up to three safe and two exploratory candidates, deduplicates, and fills any remaining places from eligible candidates while labelling their tier. If anchors are absent or similarity unknown, do not claim a candidate is a safe match; request sampling. Diversity reranking runs within each tier, then interleaves safe first. An explicit limited-evidence view is outside the default top five and clearly marked.

For wardrobe, evaluate selected season×occasion slots independently; recommend up to three owned candidates. One bottle can cover several slots. A gap exists when no eligible owned candidate has rawScore ≥65 and coverage ≥0.40; classify as “coverage gap” or “insufficient evidence,” never an automatic purchase need. Pairwise roleSimilarity ≥0.85 at sufficient coverage flags possible overlap, accompanied by shared roles and differences. User-pinned assignments survive regeneration, with an explicit unavailable/stale warning when applicable.

### 2.6 Explanations

The scorer outputs reason codes and exact inputs: `MATCHES_CONFIRMED_FRESH_WOODS`, `DIRECT_LOVE_RATING`, `MEETS_CONTEXT_PRESENCE`, `NEW_WARDROBE_ROLE`, `LONGEVITY_UNCERTAIN`, `POSSIBLE_ROLE_OVERLAP`, etc. Every personal reason references a user EvidenceRef; every product assertion references a CatalogClaim. Templates turn codes into readable text. Include up to three positive reasons, one tradeoff, evidence coverage, ownership status, and whether a sample is recommended. No unsupported attraction, compliment, or medical guarantees.

Illustrative numeric test: T=.8, C=.9, S=.7, L=.6, G=.5 gives 75.0 before diversity adjustment. This uses an abstract candidate, not an invented perfume catalog entry.

## 3. Optional LLM contract

LLM use requires explicit account-level opt-in. Core results return immediately from deterministic logic. The worker may enrich approved summaries afterward. Default provider is `disabled`. Configuration: provider identifier, fixed base URL, model ID, secret reference, timeout, token budget, daily cost cap, and schema capability flags. Never accept a provider URL or key from browser request data. Only HTTPS allowlisted provider hosts; no private-network access or redirects to arbitrary hosts.

Adapter operations:

- `interpretAnswers(input): InterpretationProposal`: bounded answer excerpts and allowed vocabulary → proposed traits plus answer references. Proposals are not authoritative until confirmed. Deterministic tagged fields work without it.
- `explainRun(input): ExplanationProposal`: selected IDs, reason codes, approved facts and source IDs → bounded plain text sections referring only to those IDs. Cannot change ranks, add fragrances, or write catalog facts.

Use a strict JSON schema: `schemaVersion`, `items[{fragranceId,reasonCodes[],evidenceRefs[],summary,maxUncertaintyText}]`; require exact selected-ID subset, no extra properties, length limits, and approved references. Raw output is never rendered. JSON validation alone cannot prove prose factuality: keep product claims in deterministic source-backed clauses; limit LLM prose to restating confirmed goals and approved reasons. Reject unknown IDs, unsupported claims, prompt injection effects, and output that disagrees with hard constraints. Use templates on any rejection.

Timeout 10 seconds per call, one transient retry with backoff, at most two attempts. Daily per-user cap 10 calls, global spend cap configured by operator; cap hit falls back transparently. Use idempotent job keys and discard stale results. Record provider/model/promptVersion, latency, token usage, validation result, and failure category; do not log raw personal prompts by default. Do not send email, account ID, whole chat history, body descriptions, or unnecessary free text. Provider capability differences are covered by contract tests; structured output is optional because local validation and fallback are mandatory.

## 4. HTTP API conventions

Prefix `/api/v1`. JSON, UTF-8; UUID IDs; ISO-8601 UTC timestamps; cursor lists `{items,nextCursor}` default 25/max 100. All private operations require a session. CURATOR role alone can change catalog data. Route guards and owner-scoped queries both enforce ownership. Never trust `userId` from input.

For rating PUT, If-Match refers to the CollectionItem version; for round PUT it refers to Consultation.version. All responses include the affected aggregate version and ETag.

Mutations of editable entities use an integer `version`; PATCH/PUT requires `If-Match: "<version>"`. Missing header →428; mismatch →409. Immutable snapshots have no update route. POST operations that create runs/plans/jobs, confirm profiles, append feedback, or confirm trial ratings/purchases require `Idempotency-Key`; persist key + canonical request hash for 24 hours. Same key/body returns original result; same key/different body →409. DELETE is idempotent; 204 for already absent owned resources, without leaking another user's object existence.

Errors: `{error:{code,message,fieldErrors?,requestId,retryable}}`. Use 400 malformed, 401 unauthenticated, 403 role/CSRF failure, 404 absent or not-owned object, 409 conflict/stale dependency, 422 valid shape but domain-invalid, 429 quota, 503 unavailable. Responses never include stack traces. `STALE_PROFILE` includes a safe link to review current changes.

### Endpoint inventory

| Method and path | Request / result |
|---|---|
| POST `/auth/login-link` | `{email}` →202 generic acknowledgment; rate limited |
| POST `/auth/consume-link` | `{token}` →204 + session cookie; explicit user submit prevents link-scanner consumption |
| POST `/auth/logout` | →204, revoke session |
| GET/PATCH `/me` | account/settings; PATCH `{version,locale,aiEnabled,analyticsEnabled}` |
| GET `/catalog/fragrances?q=&cursor=&concentration=` | published identity summaries only |
| GET `/catalog/fragrances/:id` | active revision, approved facts, provenance, withdrawal state |
| GET/POST `/collection` | list / `{fragranceId?,unresolvedName?,ownership,available}` →201 item |
| PATCH/DELETE `/collection/:id` | ownership, availability, resolved identity or user note / soft delete |
| POST `/collection/:id/restore` | `{version}` →restore own soft-deleted item after active-identity conflict check |
| PUT `/collection/:id/rating` | `{rating,reasonTags,comment?}` →rating snapshot plus new collection version |
| POST/GET `/consultations` | `{questionnaireVersion}` →201 / latest resumable list |
| GET `/consultations/:id` | state, answer revision, current round and summaries |
| PUT `/consultations/:id/rounds/:round` | `{answers:[{questionId,value,status}]}` →saved revision |
| POST `/consultations/:id/rounds/:round/complete` | `{answerRevision}` →summary and next round or REVIEW |
| POST `/consultations/:id/confirm` | `{answerRevision,acceptedProposalIds}` →201 ProfileVersion |
| GET `/profiles/current` | profile snapshot and evidence; 404 before first confirmation |
| POST `/profiles/:id/corrections` | `{path,value,reason?}` →new ProfileVersion; whitelisted paths only |
| GET/POST/PATCH/DELETE `/context-presets[/:id]` | saved DecisionContext defaults; PATCH requires version |
| POST `/recommendation-runs` | `{profileVersionId,mode:"DISCOVER",context,limit:5}` →201 run with deterministic results |
| GET `/recommendation-runs/:id` | snapshot, stale/withdrawn flags, optional explanation status |
| POST `/decisions/:id/feedback` | `{selectedFragranceId?,wore,usefulness?,comment?}` →201 append-only feedback |
| POST `/decisions` | `{profileVersionId,context}` →201 run mode OWNED, outcome and up to 3 choices |
| POST `/wardrobe-plans` | `{profileVersionId,seasons,occasions}` →201 plan plus slots |
| GET `/wardrobe-plans/:id` | saved grid/list and availability flags |
| PATCH `/wardrobe-plans/:id/slots/:slotId` | `{fragranceIds,pinned}` →versioned slot; validate ownership |
| GET/POST/PATCH/DELETE `/wishlist[/:id]` | `{fragranceId,status,priority,note?}`; no ownership side effect |
| GET/POST `/sample-trials` | filter by fragrance / `{fragranceId,context,startedAt}` |
| GET/PATCH `/sample-trials/:id` | trial context/status; completing alone does not confirm a rating |
| PUT `/sample-trials/:id/observations/:checkpoint` | `{observedAt,elapsedMinutes,enjoyment?,presence?,detectable?,outfitFit?,complimentCount?,comment?}` →observation; If-Match uses trial version and increments it |
| POST `/sample-trials/:id/confirm-rating` | `{trialVersion,rating,reasonTags,comment?}` →201 rating and optional new ProfileVersion; explicitly creates SAMPLED item if absent |
| POST `/wishlist/:id/confirm-purchase` | `{wishlistVersion,available}` →CollectionItem OWNED and wishlist PURCHASED atomically |
| POST `/exports` and GET `/exports/:id` | →202 job / status and authenticated download when ready |
| DELETE `/me` | recent authentication + `{confirmation:"DELETE"}` →202 deletion receipt |
| GET `/jobs/:id` | owner-only export/deletion/explanation progress where session still valid |
| POST `/admin/catalog/drafts` | curator creates draft identity/revision |
| PUT `/admin/catalog/drafts/:id` | curator edits facts/claims/evidence |
| POST `/admin/catalog/drafts/:id/publish` | validates provenance →new immutable revision/release |
| POST `/admin/catalog/fragrances/:id/withdraw` | reason →immediate eligibility block, audit event |

Bracketed routes denote collection and item routes, not literal URL syntax. GET is side-effect free. No public endpoint executes source URLs or accepts SQL/filter expressions.

### Payload limits and core answer contracts

All free-text fields max 2,000 characters; personal notes max 1,000; names max 200; comments are plain text. Collections max 500 active items/user for pilot; sample observations at most one per checkpoint/trial. Arrays: anchors ≤3, identity descriptors ≤3, occasions ≤8, reasons ≤10. Every JSON schema rejects extra properties. An ANSWERED value must match its question type; SKIPPED/UNANSWERED uses null. Empty strings are not answers.

Stable question IDs include `r1.favoriteAnchors` (ordered `{collectionItemId,rank}` array), `r1.dislikedAnchors`, `r1.motivation`, `r2.anchorReasons` (item ID plus selected tags/text), `r2.sweetness`, `r2.presence`, `r2.dislikedQualities`, `r3.occasions`, `r3.styles`, `r3.identityDescriptors`, `r3.climate`, `r3.budget`, `r3.sharedSpaceRules`, `r4.ratings`, `r4.cleanDirection`, `r4.seasonFlexible`, `r4.compliments`, `r4.longevityHours`, and `r4.discovery`. Round-4 rating answers reference rating revision IDs produced by the rating endpoint; save changes before completing the round. They do not introduce a second authoritative rating store.

Example saved answer: `{"questionId":"r2.sweetness","status":"ANSWERED","value":"BALANCED"}`. Example skip: `{"questionId":"r4.compliments","status":"SKIPPED","value":null}`. QuestionnaireDefinition contains remaining optional prompts, labels, conditions and enum vocabularies; changing meaning creates a new definition version.

### Concrete decision contract

```json
{
  "profileVersionId": "10000000-0000-4000-8000-000000000001",
  "context": {
    "season": "SUMMER",
    "weatherBand": "WARM",
    "occasion": "OFFICE",
    "outfit": "SMART_CASUAL",
    "desiredPresence": "INTIMATE",
    "presenceCap": "MODERATE",
    "sharedSpace": true,
    "strictPresence": true,
    "fragranceFree": false,
    "longevityHours": {"min": 6, "max": 8}
  }
}
```

Response shape (schematic UUID placeholders are not catalog entries):

```json
{
  "id": "<run UUID>",
  "mode": "OWNED",
  "outcome": "MATCHES",
  "profileVersionId": "<profile UUID>",
  "catalogReleaseId": "<release UUID>",
  "scoringVersion": "1.0.0",
  "stale": false,
  "explanationStatus": "TEMPLATE",
  "items": [{
    "fragranceId": "<verified fragrance UUID>",
    "catalogRevisionId": "<published revision UUID>",
    "rank": 1,
    "rawScore": 75,
    "coverage": 0.82,
    "reasonCodes": ["DIRECT_LOVE_RATING", "MEETS_CONTEXT_PRESENCE"],
    "evidenceRefs": ["rating:<UUID>", "claim:<UUID>"],
    "uncertainties": ["LONGEVITY_VARIABLE"]
  }],
  "excludedCounts": {"NOT_AVAILABLE": 2, "PROJECTION_UNKNOWN": 1}
}
```

Outcomes: MATCHES, NO_MATCH, NO_FRAGRANCE, INSUFFICIENT_EVIDENCE. NO_FRAGRANCE always has an empty items list and a setting-specific template. POST with outdated profile/collection base versions returns 409 rather than silently using new inputs. Saved historical runs remain inspectable but do not masquerade as current advice.

## 5. Authentication, security, privacy, and operations

Use passwordless email links: store only token hashes, 15-minute expiry, single use, 5 requests/email/hour and 20/IP/hour, generic responses. Session token is opaque and hashed in DB; `__Host-session`, Secure, HttpOnly, SameSite=Lax, path `/`; idle lifetime 7 days, absolute 30 days; rotate after login. Explicit origin checks plus CSRF token for mutations. Reauthentication within 15 minutes for export/deletion/account email changes. Local email capture only in development.

All account data use owner-scoped repositories. Test nested ownership (e.g., trial ↔ run, slot ↔ plan), not only top-level routes. CSP, strict CORS to the app origin, output escaping, no raw HTML from model/source/user text, request size 64 KB, per-field limits, rate limits, dependency scanning, and secret rotation. Curator access is separate from normal accounts with step-up authentication. Imported text is untrusted data, never instructions.

AI consent is distinct from service use and analytics. Off by default. Revocation prevents new jobs and cancels queued provider work; disclose that already transmitted data cannot be recalled. Operator selects and documents provider retention/region terms before enabling it. This is a product privacy baseline, not a declaration of legal compliance.

Keep account data until deletion; raw rejected LLM output not persisted; operational logs 14 days with no prose/email; audit metadata 90 days without answer contents; export artifacts expire in 24 hours; idempotency rows 24 hours; jobs 7 days after terminal state. Delete primary private data within 7 days, including derived snapshots and queued jobs. Backups expire within 30 days; encrypted tombstone ledger prevents restoring deleted accounts into service. Deletion immediately disables account/session access; confirmation receipt explains timelines. Catalog data are shared and remain. Restore workflow replays deletion tombstones before reopening traffic.

Targets for pilot infrastructure: 99.5% monthly availability excluding announced maintenance; CRUD p95 ≤300 ms, catalog search ≤500 ms, deterministic rank ≤1 second for 1,000 catalog entries; end-to-end core decision ≤2 seconds at 10 concurrent users. LLM enrichment ≤15 seconds target, never blocks core result. Browser LCP ≤2.5 seconds and CLS ≤0.1 on representative midrange mobile, tested on constrained network. Targets are budgets, not promises before measurement.

Structured logs use request/job IDs and error codes. Metrics: response latency, error rate, queue age, DB pool saturation, recommendation exclusion counts, provider spend, validation failures, consented funnel events. Alert on sustained 5xx >2%/5 minutes, queue age >5 minutes, backup failure, and spend cap approach. Daily encrypted backups; RPO 24 hours and RTO 4 hours for MVP, verified in restore drill. Health `/health/live` and `/health/ready` reveal no secrets. Migration deploy runs once; use additive changes and application rollback compatibility. A down migration is not the default recovery for data-bearing changes.

## 6. Verification requirements

Unit tests: score arithmetic, missing data, shrinkage, context precedence, deterministic ties, eligibility, role overlap. Integration against real PostgreSQL: ownership, transactions, optimistic concurrency, idempotency, delete cascades, immutable snapshots. E2E: four rounds, reload/resume, correction, decision, wishlist→trial→rating, export/deletion, AI off/outage. Model tests: hostile answer text, unknown IDs, invalid JSON, missing evidence, wrong constraints, and provider timeout. Never approve an LLM output solely because its JSON validates.

Evaluate before release using the fixtures and gates in [06](06-implementation-plan.md). Preserve scorer versions so changing weights is an explicit evaluated release. PostgreSQL transaction behavior must be checked against the selected Prisma version; the [Prisma transaction reference](https://docs.prisma.io/docs/orm/v7/prisma-client/queries/transactions) provides the relevant pattern, not a mandate to select that major.
