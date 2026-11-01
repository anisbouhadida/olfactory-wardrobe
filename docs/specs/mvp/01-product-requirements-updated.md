# 01 — Product requirements (updated for AI-assisted development)

[Note: Base content remains as in 01-product-requirements.md. This version adds code-oriented helper sections for Codex-style tools.]

## 9. Code-level glossary

This glossary maps PRD terms to canonical code names used in models, modules, and endpoints. It is a guide for code generation, not a runtime contract.

| PRD term          | Model name       | Nest module / service      | Primary endpoint(s) |
|-------------------|------------------|----------------------------|---------------------|
| Fragrance         | `Fragrance`      | `CatalogModule` / `CatalogService` | `/api/v1/fragrances` |
| CatalogRevision   | `CatalogRevision`| `CatalogModule` / `CatalogService` | `/api/v1/catalog/releases` |
| CollectionItem    | `CollectionItem` | `CollectionModule` / `CollectionService` | `/api/v1/collection` |
| PreferenceRating  | `PreferenceRating` | `CollectionModule` / `RatingsService` | `/api/v1/collection/:itemId/ratings` |
| Consultation      | `Consultation`   | `ConsultationsModule` / `ConsultationsService` | `/api/v1/consultations` |
| ProfileVersion    | `ProfileVersion` | `ProfilesModule` / `ProfilesService` | `/api/v1/profile` |
| ContextPreset     | `ContextPreset`  | `DecisionsModule` / `ContextsService` | `/api/v1/context-presets` |
| DecisionContext   | *(DTO only)*     | `DecisionsModule` / `DecisionsController` | `/api/v1/decisions` |
| RecommendationRun | `RecommendationRun` | `RecommendationsModule` / `RecommendationsService` | `/api/v1/recommendations` |
| WardrobePlan      | `WardrobePlan`   | `WardrobeModule` / `WardrobeService` | `/api/v1/wardrobe` |
| WishlistItem      | `WishlistItem`   | `WishlistModule` / `WishlistService` | `/api/v1/wishlist` |
| SampleTrial       | `SampleTrial`    | `SamplingModule` / `SamplingService` | `/api/v1/samples` |
| EvidenceRef       | `EvidenceRef`    | `ProfilesModule` / `EvidenceService` | *(internal only)* |

## 10. Requirements → modules and endpoints

This table links each FR requirement to the primary module and representative endpoints for implementation. It is intended for AI-assisted scaffolding.

| ID   | Requirement                 | Module(s)                        | Representative endpoint(s) |
|------|-----------------------------|----------------------------------|----------------------------|
| FR-01| Accounts and privacy        | `AuthModule`, `UsersModule`, `PrivacyModule` | `/api/v1/auth/*`, `/api/v1/privacy/*` |
| FR-02| Collection and identity     | `CatalogModule`, `CollectionModule` | `/api/v1/catalog/*`, `/api/v1/collection/*` |
| FR-03| Four-round consultation     | `ConsultationsModule`            | `/api/v1/consultations/*` |
| FR-04| Editable olfactory profile  | `ProfilesModule`                 | `/api/v1/profile/*` |
| FR-05| Recommendations             | `RecommendationsModule`          | `/api/v1/recommendations/*` |
| FR-06| Wardrobe                    | `WardrobeModule`                 | `/api/v1/wardrobe/*` |
| FR-07| Scent decision system       | `DecisionsModule`                | `/api/v1/decisions` |
| FR-08| Wishlist and sampling       | `WishlistModule`, `SamplingModule` | `/api/v1/wishlist/*`, `/api/v1/samples/*` |
| FR-09| Provenance and catalog      | `CatalogModule`                  | `/api/v1/catalog/*` |
| FR-10| Operational readiness       | `JobsModule`, `PrivacyModule`    | `/api/v1/jobs/*`, `/api/v1/privacy/*` |

