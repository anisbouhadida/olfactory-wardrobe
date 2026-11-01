# 05 — Backend schema

Version 1.0 · 31 October 2026 · PostgreSQL logical schema and Prisma implementation contract

Companions: [PRD](01-product-requirements.md), [Technical requirements](02-technical-requirements.md), [App flow](03-app-flow.md), [Design brief](04-design-brief.md), [Implementation plan](06-implementation-plan.md).

This is a build specification, not a migration advertised as already executed. The table dictionary is authoritative for the full model; Prisma snippets illustrate central relationships. Generate the complete schema from the dictionary, then add SQL migrations for checks, partial indexes and immutability that Prisma cannot express directly.

## 1. Conventions and ownership

All primary keys are UUIDs generated server-side. `createdAt`, `updatedAt`, and recorded event times use `timestamptz`; historical snapshots have `createdAt` but no mutable `updatedAt`. Editable aggregates carry `version integer default 1`, incremented atomically on update. Money uses integer minor units plus ISO currency and bottle size; hours use numeric, not floating currency-like strings. Scores use numeric(9,6), display rounding happens in the client.

`U` below means private, owned by `userId → User.id`. Every U table has `userId`, even when parent ownership could be derived, to support composite foreign keys and safe queries. `G` means global catalog/configuration. `O` means operational. Standard fields are omitted from repeated table rows: all tables have `id` and `createdAt`; editable tables additionally have `updatedAt` and `version`.

Private parent tables expose `UNIQUE(userId,id)`. A private child references its parent using `(userId,parentId)`, preventing a child owned by A from referencing B’s record. User deletion cascades through private data. Public catalog identities are restricted from hard deletion once referenced; withdraw instead. Immutable user history is deletable for account erasure, even though normal application updates are forbidden.

## 2. Enumerations and typed vocabulary

| Enum | Values |
|---|---|
| Ownership | OWNED, PREVIOUSLY_OWNED, SAMPLED, UNKNOWN |
| PreferenceRatingValue | LOVE, LIKE, NEUTRAL, DISLIKE, UNKNOWN |
| ConsultationStatus | DRAFT, IN_PROGRESS, REVIEW, COMPLETED, ABANDONED |
| AnswerStatus | ANSWERED, SKIPPED, UNANSWERED |
| TraitStatus | STATED, INFERRED, CONFIRMED |
| Confidence | LOW, MEDIUM, HIGH |
| CatalogStatus | DRAFT, PUBLISHED, WITHDRAWN |
| RunMode | DISCOVER, OWNED, WARDROBE |
| RunOutcome | MATCHES, NO_MATCH, NO_FRAGRANCE, INSUFFICIENT_EVIDENCE |
| ExplanationStatus | TEMPLATE, PENDING, ENRICHED, FALLBACK |
| WishlistStatus | CONSIDERING, WANT_TO_SAMPLE, SAMPLING, DECIDING, PURCHASED, DISMISSED |
| TrialStatus | PLANNED, IN_PROGRESS, COMPLETED, ABANDONED |
| Checkpoint | OPENING, TWO_HOURS, SIX_HOURS |
| Presence | INTIMATE, MODERATE, STRONG |
| Season | SPRING, SUMMER, AUTUMN, WINTER |
| Occasion | OFFICE, IMPORTANT_MEETING, WEEKEND, DAY_DATE, EVENING_DATE, FORMAL, SPECIAL, GYM |
| JobStatus | QUEUED, RUNNING, SUCCEEDED, FAILED, CANCELLED |

UNKNOWN is a stored rating, never SQL null meaning “neutral.” No rating row means never recorded. Presence uncertainty is null rather than a new band. Vocabularies for notes, families, outfits, and reason tags are versioned rows; enum values are reserved for stable workflow states.

## 3. Identity, authentication, and privacy tables

| Table / class | Fields beyond common fields | Constraints / behavior |
|---|---|---|
| User — U root | `emailNormalized text`, `locale text`, `timezone text?`, `role USER/CURATOR`, `status ACTIVE/DELETION_PENDING`, `aiEnabled bool=false`, `analyticsEnabled bool=false`, `dataVersion int`, `currentProfileVersionId uuid?`, `activeWardrobePlanId uuid?` | Unique normalized email. Pointer FKs must belong to this user. dataVersion increments on scoring-relevant private changes |
| AuthSession — U | `tokenHash text`, `expiresAt`, `authenticatedAt`, `lastSeenAt`, `revokedAt?` | Unique tokenHash; expiration index; never store bearer token |
| LoginToken — O | `emailHash text`, `emailEncrypted text`, `tokenHash text`, `expiresAt`, `consumedAt?` | Single-use consume via conditional update; delete expired rows within 24h; email ciphertext only until consumed/expired |
| ConsentEvent — U immutable | `purpose AI/ANALYTICS`, `enabled bool`, `policyVersion text` | Append-only audit of preference changes; no raw prompts |
| PrivacyRequest — U | `kind EXPORT/DELETE`, `status`, `requestedAt`, `completedAt?`, `jobId?`, `expiresAt?`, `errorCode?` | One active DELETE/user; request is deleted with account after safe completion ledger write |
| DeletionTombstone — O | `accountId uuid`, `deletedAt`, `backupExpiryAt` | No FK to User; encrypted access-restricted ledger, no email or profile; purge after backup horizon + restore-verification grace, max 37 days |

Recent authentication is checked on AuthSession.authenticatedAt, not an account-wide timestamp that another session could refresh. User settings booleans are current state; ConsentEvent is history. Do not store private data in security audit messages. Login-link rate limits use short-lived hashed email/IP counters; salt and retention are operator configuration.

## 4. Catalog and provenance

| Table / class | Fields beyond common fields | Constraints / behavior |
|---|---|---|
| Brand — G | `name`, `normalizedName`, `marketSegment DESIGNER/NICHE/OTHER/UNKNOWN` | Unique normalizedName; segment is descriptive, not rank input |
| Fragrance — G | `brandId`, `canonicalName`, `normalizedIdentityKey`, `concentration`, `editionLabel?`, `identityStatus`, `activeRevisionId?`, `withdrawnAt?`, `withdrawalReason?` | Unique identity key; concentration UNKNOWN allowed in draft only; published identity must be exact enough to distinguish variants |
| FragranceAlias — G | `fragranceId`, `alias`, `normalizedAlias`, `locale?`, `verifiedBy?` | Index normalizedAlias; aliases need not be globally unique; ambiguous search returns multiple matches |
| SourceRecord — G immutable | `url`, `publisher`, `sourceType OFFICIAL/RETAILER/EDITORIAL/USER_AGGREGATE`, `accessedAt`, `publishedAt?`, `contentHash?`, `licenseNote?`, `rightsStatus`, `excerpt?` | Minimal evidence excerpt only if permitted; source URL is not automatically fetched from the user-facing app |
| CatalogRevision — G immutable once published | `fragranceId`, `revisionNumber int`, `status`, `identitySnapshot jsonb`, `featureSnapshot jsonb`, `featureSchemaVersion`, `publishedAt?`, `curatorId?` | Unique fragranceId/revisionNumber; draft editable, publication freezes row; exact claim IDs stored in snapshot |
| CatalogClaim — G immutable | `revisionId`, `fieldPath`, `value jsonb`, `sourceRecordId`, `claimType FACT/EDITORIAL_ESTIMATE/REPORTED_PERFORMANCE`, `confidence`, `reviewedAt`, `reviewerId?` | Schema validates fieldPath/value. Several conflicting claims may exist; selected claim IDs in revision identify scoring inputs |
| CatalogRelease — G immutable | `releaseNumber`, `featureSchemaVersion`, `publishedAt`, `manifestHash` | Unique releaseNumber and manifestHash |
| CatalogReleaseEntry — G immutable | `releaseId`, `fragranceId`, `revisionId` | Unique releaseId/fragranceId; composite FK ensures revision belongs to fragrance |
| VocabularyTerm — G | `namespace`, `key`, `label`, `vocabularyVersion`, `active bool` | Unique namespace/key/version; includes note/accord/family/descriptor values |
| PriceObservation — G immutable, optional | `fragranceId`, `sourceRecordId`, `amountMinor bigint`, `currency char(3)`, `bottleMl numeric`, `observedAt`, `validUntil` | Nonnegative amount; positive ml; only used within validity window and requested size/currency; no live-price requirement |

Catalog identity facts and subjective sensory descriptions must remain distinguishable. Official notes do not prove ingredient composition. A curator may record sensory suitability as an editorial estimate with attribution; never relabel it as brand fact. Conflicting projection reports are retained; a resolved estimate records range, selection method and uncertainty. Unknown values remain null.

`featureSnapshot` schema version `features.v1`:

```json
{
  "families": [{"key": "woody", "strength": 0.8, "claimIds": ["<UUID>"]}],
  "notes": [{"key": "cedar", "strength": 1, "claimIds": ["<UUID>"]}],
  "descriptors": [],
  "projection": {"band": "MODERATE", "claimIds": ["<UUID>"]},
  "longevityHours": {"min": 4, "max": 7, "claimIds": ["<UUID>"]},
  "occasionSuitability": {"OFFICE": {"value": 0.7, "claimIds": ["<UUID>"]}},
  "seasonSuitability": {},
  "weatherSuitability": {},
  "formalitySuitability": {},
  "coverage": {"noteListingComplete": false}
}
```

This is a shape example, not facts about a real perfume. Null projection/longgevity objects are valid. CatalogClaim references must belong to the revision; validate in publication transaction. A catalog draft cannot become eligible because an LLM produced a name.

## 5. Collection, interview, profile, and evidence

| Table / class | Fields beyond common fields | Constraints / behavior |
|---|---|---|
| CollectionItem — U editable | `fragranceId?`, `unresolvedName?`, `ownership`, `available bool=false`, `personalNote?`, `currentRatingId?`, `deletedAt?` | Exactly one of fragranceId/unresolvedName; resolved identity unique/user among active items; available only if OWNED |
| PreferenceRating — U immutable revisions | `collectionItemId`, `revisionNumber`, `value`, `reasonTags jsonb`, `comment?`, `origin MANUAL/TRIAL`, `sampleTrialId?` | Unique collectionItemId/revisionNumber; current pointer on CollectionItem; unknown has no numerical contribution |
| QuestionnaireDefinition — G immutable | `key`, `versionNumber`, `schema jsonb`, `publishedAt` | Unique key/versionNumber; stable question IDs and validation/conditional rules |
| Consultation — U editable | `questionnaireDefinitionId`, `status`, `currentRound int`, `answerRevision int`, `completedAt?` | currentRound 1–4; version check on every answer update |
| InterviewAnswer — U immutable revisions | `consultationId`, `questionId`, `round int`, `answerRevision int`, `status`, `value jsonb?` | Unique consultationId/questionId/answerRevision; latest ≤ requested revision is the effective answer; snapshot replay is deterministic |
| RoundSummary — U immutable | `consultationId`, `round`, `answerRevision`, `summary jsonb`, `templateVersion`, `providerRunId?` | Summary content frozen; acknowledgment is an append-only ConsultationEvent rather than editing historical content |
| ConsultationEvent — U immutable | `consultationId`, `type ROUND_ACKNOWLEDGED/REOPENED/ABANDONED`, `round?`, `answerRevision`, `summaryId?` | Records workflow transitions without mutating summaries; acknowledgedAt is derived in API |
| ProfileVersion — U immutable | `consultationId?`, `supersedesId?`, `sequence int`, `answerRevision?`, `dataVersion int`, `profileSchemaVersion`, `inferenceVersion`, `snapshot jsonb`, `evidenceCoverage numeric` | Unique userId/sequence; no direct PATCH. snapshot includes preferences, trait evidence, explicit exclusions, ratings and context rules |
| ProfileCorrection — U immutable | `baseProfileVersionId`, `resultProfileVersionId`, `path`, `value jsonb`, `reason?` | Whitelisted profile paths only; correction cannot create catalog facts |
| EvidenceRef — U immutable | `kind ANSWER/RATING/CLAIM/CORRECTION`, `answerId?`, `ratingId?`, `claimId?`, `correctionId?` | Exactly one target matching kind; private targets same owner; catalog claim target global |
| ProfileEvidence — U immutable | `profileVersionId`, `traitPath`, `evidenceRefId`, `direction SUPPORTS/CONTRADICTS` | Unique profileVersionId/traitPath/evidenceRefId; both private references same owner |
| ContextPreset — U editable | `name`, `contextSchemaVersion`, `context jsonb`, `isDefault bool` | At most one default/user; no exact location required |

`acknowledgedAt` is an API-derived property from ConsultationEvent, not a physical RoundSummary field. Collection DELETE is a soft delete for an individual entry, preserving historical evidence; account deletion physically erases all private history. Restore an item with an explicit action rather than creating a conflicting active duplicate. Current rating and profile pointers must reference same-user records; CollectionItem.currentRatingId additionally must belong to that item. Use deferred SQL foreign keys or set pointers after child creation in one transaction.

Profile snapshot contract `profile.v1` includes:

```json
{
  "traits": [{
    "path": "taste.cleanDirection",
    "value": "FRESH_WOODS",
    "status": "STATED",
    "confidence": "HIGH",
    "evidenceRefIds": ["<UUID>"]
  }],
  "affinities": [],
  "generalPresence": "MODERATE",
  "contextRules": [{
    "when": {"sharedSpace": true, "occasion": "OFFICE"},
    "set": {"desiredPresence": "INTIMATE", "strictPresence": true},
    "evidenceRefIds": ["<UUID>"]
  }],
  "longevityHours": {"min": 6, "max": 8},
  "seasonFlexible": true,
  "budget": {"mode": "OPEN", "currency": "EUR"},
  "discovery": "BOTH",
  "ratingSnapshot": [],
  "hardExclusions": {"fragranceIds": [], "noteKeys": []},
  "unresolvedQuestions": []
}
```

The explicit context fields in a DecisionContext override preset defaults; hard fragrance-free/explicit exclusion constraints always remain in force. Applying a context-specific profile rule overrides general preference. Store applied rule IDs in the run so the precedence is explainable. Never add a strict cap based solely on an unconfirmed prose interpretation.

## 6. Recommendations, wardrobe, and feedback

| Table / class | Fields beyond common fields | Constraints / behavior |
|---|---|---|
| RecommendationRun — U immutable core | `profileVersionId`, `catalogReleaseId`, `mode`, `outcome`, `scoringVersion`, `inputHash`, `inputSnapshot jsonb`, `dataVersion`, `context jsonb`, `asOf`, `exclusionSummary jsonb`, `computeMs` | Input snapshot contains collection availability, selected catalog revision IDs, pricing observations if used, score configuration hash. Never update core output |
| RecommendationItem — U immutable | `runId`, `fragranceId`, `catalogRevisionId`, `rank int`, `rawScore`, `rerankedScore`, `coverage`, `components jsonb`, `reasonCodes jsonb`, `uncertainties jsonb` | Unique runId/rank and runId/fragranceId; exact revision belongs to selected release |
| RecommendationEvidence — U immutable | `recommendationItemId`, `evidenceRefId`, `reasonCode` | Same-owner references; explanation reason must have adequate evidence |
| RunExplanation — U append-only | `runId`, `status`, `templateVersion`, `textSections jsonb`, `providerRunId?` | Latest valid row is current presentation; LLM enrichment never edits ranking |
| WardrobePlan — U editable header | `profileVersionId`, `supersedesId?`, `catalogReleaseId`, `dataVersion`, `name`, `seasons jsonb`, `occasions jsonb` | Generation creates new plan; active pointer on User; stored input provenance immutable |
| WardrobeSlot — U editable | `planId`, `season`, `occasion`, `runId`, `pinned bool`, `gapType NONE/COVERAGE/EVIDENCE`, `rationale jsonb` | Unique planId/season/occasion; run mode WARDROBE with matching slot context |
| WardrobeAssignment — U editable | `slotId`, `collectionItemId`, `fragranceId`, `position int` | Unique slotId/position and slotId/fragranceId; max 3 enforced transactionally; availability rechecked on read/use |
| DecisionFeedback — U immutable | `runId`, `selectedFragranceId?`, `usefulness HELPFUL/NEUTRAL/UNHELPFUL?`, `wore bool`, `comment?` | Run mode OWNED; selected ID must be in run; no rating side effect |
| WishlistItem — U editable | `fragranceId`, `status`, `priority int`, `note?`, `originRunId?` | Unique userId/fragranceId; withdrawn identity retained as historical reference |
| SampleTrial — U editable | `fragranceId`, `wishlistItemId?`, `originRunId?`, `status`, `context jsonb`, `startedAt?`, `completedAt?`, `overallRatingId?` | Same-owner wishlist/run/rating; timestamp ordering checks |
| SampleObservation — U editable | `trialId`, `checkpoint`, `observedAt`, `elapsedMinutes int`, `enjoyment?`, `presence?`, `detectable bool?`, `outfitFit?`, `complimentCount int?`, `comment?` | Unique trialId/checkpoint; elapsedMinutes ≥0; actual times, not fabricated schedule |

A trial for a fragrance without a CollectionItem can create a SAMPLED item only after user confirmation of the final rating operation. Trial completion without that confirmation changes neither ownership nor profile. User may confirm purchase afterward using a distinct operation.

Staleness is computed: run/plan dataVersion differs from current User.dataVersion; current profile differs; or catalog active release differs. Expose separate reasons so a new unrelated catalog entry does not imply personal data changed. Current catalog withdrawal is a live safety/validity overlay on historical output, not a rewrite. Historical scores remain reproducible from snapshots even if no longer actionable.

## 7. Jobs and audit tables

| Table | Fields | Guarantees |
|---|---|---|
| Job — U/O | `userId?`, `kind`, `status`, `dedupeKey`, `payload jsonb`, `attempts`, `availableAt`, `lockedAt?`, `leaseUntil?`, `workerId?`, `resultRef?`, `errorCode?` | Unique dedupeKey; payload IDs only where possible; owner required for personal work; deletion jobs use tombstone after account removal |
| ProviderRun — U | `jobId`, `provider`, `model`, `promptVersion`, `schemaVersion`, `status`, `inputHash`, `latencyMs`, `inputTokens?`, `outputTokens?`, `costMinor?`, `currency?`, `validationCode?` | No default raw prompt/output persistence; delete with user |
| IdempotencyRecord — U | `scope`, `key`, `requestHash`, `responseStatus`, `responseBody jsonb?`, `resourceId?`, `expiresAt` | Unique userId/scope/key; no secrets in response snapshot |
| AuditEvent — O | `actorId?`, `action`, `targetType`, `targetId?`, `requestId`, `metadata jsonb` | Allowlisted metadata only; no user answers or token values; scrub actor on deletion where no retention reason exists |

Worker claims jobs with a short transaction using `FOR UPDATE SKIP LOCKED`, sets a lease, commits, then calls external services outside the transaction. Heartbeat or bounded processing extends lease; expired RUNNING jobs become eligible for retry. Each handler is idempotent. User deletion cancels jobs, worker rechecks user status/consent immediately before provider call and before persisting output. Retries use exponential backoff, max three job attempts; provider adapter’s two-call limit remains a separate per-attempt cap and global spend ceiling. Permanent validation errors skip provider retry and save template fallback.

Minimum scalar validation for bounded JSON: `enjoyment` and `outfitFit` use 1–5 or null; `complimentCount` is a nonnegative integer or null; profile evidenceCoverage is [0,1]; budget mode OPEN/CAPPED requires amountMinor only when CAPPED. Weather, outfit, clean-direction and discovery keys use the versioned contract vocabulary. SourceRecord URL must be HTTPS with no credentials; the curator’s retrieval tool uses host/IP safeguards and does not follow redirects into private networks.

## 8. Representative Prisma models

This intentionally bounded excerpt demonstrates owner-scoped composite relations; it is not the complete paste-ready schema. Translate every dictionary table into the actual schema in M0–M6. Runtime checks supplement DB constraints, not replace them.

```prisma
enum Ownership {
  OWNED
  PREVIOUSLY_OWNED
  SAMPLED
  UNKNOWN
}

model User {
  id              String           @id @default(uuid()) @db.Uuid
  emailNormalized String           @unique
  dataVersion     Int              @default(1)
  collection      CollectionItem[]
  profiles        ProfileVersion[]
  runs            RecommendationRun[]
  createdAt       DateTime         @default(now()) @db.Timestamptz(6)
}

model Fragrance {
  id                   String           @id @default(uuid()) @db.Uuid
  normalizedIdentityKey String          @unique
  canonicalName        String
  concentration        String
  collection           CollectionItem[]
  createdAt            DateTime         @default(now()) @db.Timestamptz(6)
}

model CollectionItem {
  id             String     @id @default(uuid()) @db.Uuid
  userId         String     @db.Uuid
  user           User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  fragranceId    String?    @db.Uuid
  fragrance      Fragrance? @relation(fields: [fragranceId], references: [id], onDelete: Restrict)
  unresolvedName String?
  ownership      Ownership  @default(UNKNOWN)
  available      Boolean    @default(false)
  version        Int        @default(1)
  deletedAt      DateTime?   @db.Timestamptz(6)
  createdAt      DateTime    @default(now()) @db.Timestamptz(6)
  updatedAt      DateTime    @updatedAt @db.Timestamptz(6)
  @@unique([userId, id])
  @@index([userId, ownership, available])
}

model ProfileVersion {
  id          String   @id @default(uuid()) @db.Uuid
  userId      String   @db.Uuid
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  sequence    Int
  dataVersion Int
  snapshot    Json     @db.JsonB
  createdAt   DateTime @default(now()) @db.Timestamptz(6)
  runs        RecommendationRun[]
  @@unique([userId, id])
  @@unique([userId, sequence])
}

model RecommendationRun {
  id               String         @id @default(uuid()) @db.Uuid
  userId           String         @db.Uuid
  user             User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  profileVersionId String         @db.Uuid
  profile          ProfileVersion @relation(fields: [userId, profileVersionId], references: [userId, id], onDelete: Cascade)
  scoringVersion   String
  inputHash        String
  inputSnapshot    Json           @db.JsonB
  dataVersion      Int
  createdAt        DateTime       @default(now()) @db.Timestamptz(6)
  @@unique([userId, id])
  @@index([userId, createdAt])
}
```

## 9. SQL constraints and indexes

Use migration SQL for constraints with stable names; examples assume Prisma’s default quoted table/column names:

```sql
ALTER TABLE "CollectionItem" ADD CONSTRAINT collection_identity_xor
CHECK (("fragranceId" IS NOT NULL) <> ("unresolvedName" IS NOT NULL));

ALTER TABLE "CollectionItem" ADD CONSTRAINT available_requires_owned
CHECK (NOT "available" OR "ownership" = 'OWNED');

CREATE UNIQUE INDEX collection_active_identity_unique
ON "CollectionItem" ("userId", "fragranceId")
WHERE "deletedAt" IS NULL AND "fragranceId" IS NOT NULL;

CREATE INDEX job_claimable
ON "Job" ("availableAt", "createdAt") WHERE status = 'QUEUED';

CREATE INDEX trial_user_recent
ON "SampleTrial" ("userId", "createdAt" DESC);
```

Additional mandatory constraints: round 1–4; positive ranks and revision numbers; score 0–100; coverage/feature strength 0–1; nonempty unresolvedName after trim; minHours ≤ maxHours; exactly one EvidenceRef target with matching kind; unique default ContextPreset/user; one active deletion/user. Use composite FK `(fragranceId,catalogRevisionId)` and release-entry membership validation in the same publication/run transaction. Field-level JSON validation happens in NestJS and shared JSON schemas; SQL checks guard key scalar invariants.

Index catalog normalized name/alias for prefix search initially; add PostgreSQL trigram indexes only after measurement and extension availability review. Index all private tables by `(userId,createdAt)` where listed or paginated, and foreign-key columns for parent deletes. Avoid broad JSONB GIN indexes until real query patterns require them. PostgreSQL queries are parameterized, including curator search.

## 10. Transaction boundaries and history

- **Save round:** lock/compare Consultation.version, append changed InterviewAnswer rows at next answerRevision, increment consultation version, invalidate summaries by revision mismatch. Commit before optional provider interpretation.
- **Confirm profile:** compare answerRevision and User.dataVersion, snapshot effective answers and ratings, create EvidenceRefs/ProfileVersion, update current pointer, increment dataVersion, mark consultation completed atomically. Store the post-increment dataVersion in ProfileVersion.
- **Rate/sample completion:** append rating, set currentRatingId, create confirmed profile revision if a current profile exists, increment User.dataVersion, update trial link, commit together. No current profile means only collection/rating changes; later confirmation includes them.
- **Generate run:** read a consistent snapshot under repeatable-read or capture versions and compare before commit; compute outside long transaction; transactionally recheck versions and insert run/items/evidence plus idempotency record. Conflict retries must recompute using explicit inputs or return 409. Provider calls never hold DB locks.
- **Generate wardrobe:** persist plan, slot runs and assignments atomically; publish active pointer only after complete validation. Generation failure leaves old active plan intact.
- **Publish catalog:** validate identity evidence/claims, freeze revision, write release manifest and entries, atomically set active pointers. Concurrent publishes serialize on catalog release sequence.
- **Delete account:** set DELETION_PENDING and revoke sessions first. Worker records tombstone, removes private rows/artifacts, cancels jobs, scrubs user audit identifiers, deletes user, marks tombstone complete. Never log deleted payloads in error traces.

Use an application DB role without normal update permission on immutable snapshot tables; controlled migration/erasure roles handle exceptional lifecycle operations. Keep production DB admin access outside ordinary API credentials. Run integration tests against the actual selected PostgreSQL and Prisma versions; this document’s examples have not been executed as migrations.
