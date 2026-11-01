# 03 — Application flow (updated for AI-assisted development)

[Note: Base content remains as in 03-app-flow.md. This version adds route→component→API mappings and flow step tables.]

## 11. Route → component → API map

| Route                            | Component                      | Web path                                      | Primary API calls |
|----------------------------------|--------------------------------|-----------------------------------------------|-------------------|
| `/home`                          | `HomeComponent`                | `apps/web/src/app/home`                       | `/api/v1/me`, `/api/v1/decisions` |
| `/collection`                    | `CollectionListComponent`      | `apps/web/src/app/collection/list`            | `/api/v1/collection` |
| `/collection/:itemId`            | `CollectionItemComponent`      | `apps/web/src/app/collection/item`            | `/api/v1/collection/:itemId`, `/api/v1/collection/:itemId/ratings` |
| `/consultations/:id/round/:round` | `ConsultationRoundComponent`  | `apps/web/src/app/consultations/round`        | `/api/v1/consultations/:id`, `/api/v1/consultations/:id/answers` |
| `/consultations/:id/review`      | `ConsultationReviewComponent`  | `apps/web/src/app/consultations/review`       | `/api/v1/consultations/:id`, `/api/v1/consultations/:id/confirm` |
| `/profile`                       | `ProfileComponent`             | `apps/web/src/app/profile`                    | `/api/v1/profile`, `/api/v1/profile/corrections` |
| `/discover`                      | `DiscoverComponent`            | `apps/web/src/app/discover`                   | `/api/v1/recommendations` |
| `/recommendations/:runId`        | `RecommendationDetailComponent`| `apps/web/src/app/recommendations/detail`     | `/api/v1/recommendations/:runId` |
| `/fragrances/:id`                | `FragranceDetailComponent`     | `apps/web/src/app/fragrances/detail`          | `/api/v1/fragrances/:id` |
| `/wardrobe/:planId`              | `WardrobeComponent`            | `apps/web/src/app/wardrobe`                   | `/api/v1/wardrobe/:planId` |
| `/decide`                        | `DecisionComponent`            | `apps/web/src/app/decide`                     | `/api/v1/context-presets`, `/api/v1/decisions` |
| `/wishlist`                      | `WishlistComponent`            | `apps/web/src/app/wishlist`                   | `/api/v1/wishlist` |
| `/samples/:trialId`              | `SampleTrialComponent`         | `apps/web/src/app/samples/trial`              | `/api/v1/samples/:trialId`, `/api/v1/samples/:trialId/observations` |
| `/settings`                      | `SettingsComponent`            | `apps/web/src/app/settings`                   | `/api/v1/me`, `/api/v1/privacy/*` |
| `/admin/catalog`                 | `CatalogAdminComponent`        | `apps/web/src/app/admin/catalog`              | `/api/v1/catalog/*` |

## 12. Key flow step tables

### 12.1 Consultation flow

| Step | Route                            | Main state                         | User action                     | Result |
|------|----------------------------------|-------------------------------------|----------------------------------|--------|
| 1    | `/collection` or skip            | Initial collection items            | Add/skip collection              | Collection snapshot ready |
| 2    | `/consultations/:id/round/1`     | Round 1 answers, autosave status    | Answer anchors/motivation        | Answers saved, summary prepared |
| 3    | `/consultations/:id/round/2`     | Round 2 answers                     | Answer reasons/sweetness/presence| Answers saved, summary prepared |
| 4    | `/consultations/:id/round/3`     | Round 3 context                     | Provide wardrobe contexts/budget | Context rules captured |
| 5    | `/consultations/:id/round/4`     | Round 4 calibration                 | Rate known items, discovery appetite | Calibration stored |
| 6    | `/consultations/:id/review`      | All answers + interpretations       | Accept/adjust traits, confirm profile | ProfileVersion created, consultation COMPLETED |

### 12.2 Daily decision flow

| Step | Route       | Main state                  | User action                   | Result |
|------|-------------|-----------------------------|-------------------------------|--------|
| 1    | `/decide`   | Context presets + form      | Select preset or fill context | DecisionContext built |
| 2    | `/decide`   | Constraints + submit        | Submit decision               | RecommendationRun (OWNED) created |
| 3    | `/decide`   | Results                     | Choose candidate, optionally mark "Wore" and feedback | DecisionFeedback stored |

### 12.3 Wishlist → trial → rating flow

| Step | Route              | Main state                  | User action                        | Result |
|------|--------------------|-----------------------------|-------------------------------------|--------|
| 1    | `/discover`        | Recommendation cards        | Save candidate to wishlist          | WishlistItem created |
| 2    | `/wishlist`        | Wishlist items               | Move to WANT_TO_SAMPLE / SAMPLING   | WishlistStatus updated |
| 3    | `/samples/:trialId`| Trial context + checkpoints | Record observations at checkpoints  | SampleObservation rows appended |
| 4    | `/samples/:trialId`| Completed trial              | Confirm overall rating              | PreferenceRating revision + new ProfileVersion |
