# 05 — Backend schema (updated for AI-assisted development)

[Note: Base content remains as in 05-backend-schema.md. This version adds a schema index and transaction pattern sketches.]

## 11. Schema index

| Model               | Scope | Key relations |
|---------------------|-------|--------------|
| `User`              | U     | `collection: CollectionItem[]`, `profiles: ProfileVersion[]`, `runs: RecommendationRun[]`, `wardrobePlans: WardrobePlan[]`, `wishlist: WishlistItem[]`, `sampleTrials: SampleTrial[]` |
| `AuthSession`       | U     | `user: User` |
| `LoginToken`        | O     | *(no FK to User)* |
| `Fragrance`         | G     | `brand: Brand`, `collectionItems: CollectionItem[]`, `catalogRevisions: CatalogRevision[]` |
| `CatalogRevision`   | G     | `fragrance: Fragrance`, `claims: CatalogClaim[]` |
| `CatalogRelease`    | G     | `entries: CatalogReleaseEntry[]` |
| `CollectionItem`    | U     | `user: User`, `fragrance: Fragrance?`, `ratings: PreferenceRating[]` |
| `PreferenceRating`  | U     | `collectionItem: CollectionItem` |
| `Consultation`      | U     | `user: User`, `answers: InterviewAnswer[]`, `summaries: RoundSummary[]` |
| `InterviewAnswer`   | U     | `consultation: Consultation` |
| `RoundSummary`      | U     | `consultation: Consultation` |
| `ProfileVersion`    | U     | `user: User`, `evidence: ProfileEvidence[]`, `runs: RecommendationRun[]` |
| `RecommendationRun` | U     | `user: User`, `profile: ProfileVersion`, `items: RecommendationItem[]` |
| `RecommendationItem`| U     | `run: RecommendationRun`, `evidence: RecommendationEvidence[]` |
| `WardrobePlan`      | U     | `user: User`, `slots: WardrobeSlot[]` |
| `WardrobeSlot`      | U     | `plan: WardrobePlan`, `assignments: WardrobeAssignment[]` |
| `WardrobeAssignment`| U     | `slot: WardrobeSlot`, `collectionItem: CollectionItem`, `fragrance: Fragrance` |
| `WishlistItem`      | U     | `user: User`, `fragrance: Fragrance` |
| `SampleTrial`       | U     | `user: User`, `fragrance: Fragrance`, `wishlistItem: WishlistItem?`, `observations: SampleObservation[]` |
| `SampleObservation` | U     | `trial: SampleTrial` |
| `Job`               | U/O   | `user: User?` |
| `ProviderRun`       | U     | `job: Job` |

## 12. Transaction patterns (sketches)

### 12.1 Confirm consultation and create ProfileVersion

- Input: `consultationId`, expected `answerRevision`.
- Steps (single transaction):
  1. Load `Consultation` row with FOR UPDATE; verify status IN_PROGRESS/REVIEW and `answerRevision`.
  2. Insert `RoundSummary` rows if needed; append `ConsultationEvent` acknowledging review.
  3. Insert new `ProfileVersion` snapshot referencing this consultation and current `User.dataVersion`.
  4. Update `Consultation.status` to COMPLETED; set `User.currentProfileVersionId`.

### 12.2 Generate RecommendationRun and items

- Input: canonical snapshot (ProfileVersion ID, CatalogRelease ID, DecisionContext, collection availability, scoringVersion).
- Steps (transaction):
  1. Insert `RecommendationRun` core row with `inputSnapshot`, `context`, `exclusionSummary`.
  2. Insert `RecommendationItem` rows with `rank`, `rawScore`, `rerankedScore`, `components`, `reasonCodes`, `uncertainties`.
  3. Insert `RecommendationEvidence` rows linking items to `EvidenceRef`.

### 12.3 Complete SampleTrial and append rating

- Input: `trialId`, overall rating payload.
- Steps (transaction):
  1. Load `SampleTrial` with FOR UPDATE; verify status IN_PROGRESS.
  2. Insert `PreferenceRating` revision with `origin=TRIAL`, link to `SampleTrial`.
  3. Mark `SampleTrial.status=COMPLETED`, set `overallRatingId`.
  4. Insert new `ProfileVersion` snapshot reflecting updated ratings.

These sketches are intended for Codex to generate concrete Prisma transactions that respect ownership and version invariants.
