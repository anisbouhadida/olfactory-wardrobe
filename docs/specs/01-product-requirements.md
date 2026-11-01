# 01 — Product requirements

Version 1.0 · 31 October 2026 · Status: implementation baseline, not a shipped product

Companion documents: [Technical requirements](02-technical-requirements.md), [App flow](03-app-flow.md), [Design brief](04-design-brief.md), [Backend schema](05-backend-schema.md), [Implementation plan](06-implementation-plan.md).

## 1. Product and outcome

Working name: **Personal Fragrance Consultant**. A private web application that learns what a person enjoys, helps them use their existing collection, and recommends what to sample next. It reproduces the source conversation’s progressive consultation: collection → four interview rounds → editable olfactory profile → explained recommendations → seasonal/occasion wardrobe → daily scent decision → sampling feedback.

The product must be useful without an LLM. Deterministic logic selects and ranks verified catalog entries; an optional OpenAI-compatible provider can propose structured interpretations and improve wording. The user remains the authority on their own preferences. Catalog evidence remains the authority on product identity. Scores express relative fit under a versioned rule, never a scientific probability of liking a fragrance.

Primary outcome: “I can choose a fragrance I own for my actual setting, understand the choice, and explore an unmet preference without buying a redundant bottle.” A successful answer may be “use what you have,” “sample first,” “insufficient evidence,” or “no fragrance for this setting.”

## 2. Product source and limits

Source: [Fragrance preference profiling](chatgpt-conversation://6ae5e822-d590-83ed-9d7f-b15ec82c00cc), retrieved through the chat tool on 31 October 2026. Retrieval returned five turns, all four submitted interview rounds, their assistant responses, and the final request for six documents. The tool reported no older page and no attachments. This is the entire conversation exposed by the tool; no earlier collection upload was available. Some embedded interactive controls lack their original values. Do not reconstruct missing selections as fact.

Source hierarchy:

1. Explicit user answers and corrections are personal evidence.
2. Assistant summaries are hypotheses or design inspiration, not verified user statements.
3. Perfume names in the conversation are identity candidates, not a production catalog.
4. Notes, prices, projection, links, imagery, and recommendations in the earlier assistant answer require fresh catalog verification before operational use. Its embedded citation IDs are not reusable source URLs.
5. The current request fixes the technology and adds explicit production requirements. Decisions such as account retention, score weights, and delivery milestones below are proposed implementation choices.

### Evidence ledger

| ID | Source evidence | Product consequence |
|---|---|---|
| S1 | Round 1: ranked favorites Oud Satin Mood, Xeryus Rouge, Prada Paradigme; two Zara dislikes; mixed current/former collection | Rank preferences separately from ownership; clarify disliked qualities before inferring notes |
| S2 | Round 2: elegance/sensuality, classic masculine identity, freshness/sensuality balance; balanced sweetness; noticeable projection; perceived artificiality disliked | Capture motivations; do not equate “synthetic-smelling” with ingredients or safety |
| S3 | Round 3: mixed work dress, casual/smart casual minimalism, elegant dates, public transport, four-season climate, open budget | Context-specific presence can override general projection; outfit and shared-space inputs matter |
| S4 | Round 4: detailed collection ratings, fresh woods, flexible season use, 6–8 hour target, mixed discovery appetite | Preserve unknown versus neutral; separate longevity and projection; support safe and exploratory samples |
| S5 | Final assistant synthesis: families/notes, recommendations, wardrobe, overlap/gaps, application suggestions, decision controls | Reproduce output types and explanations, while verifying product facts and qualifying hypotheses |
| S6 | Current request: wishlist, sampling, provenance, optional LLM, deterministic scoring, familiar stack | MVP persistence, traceability, provider independence, practical build scope |

The user's build/weight is not a useful fragrance predictor. Do not solicit, model, or infer body type, ethnicity, health, income, or social status. Desired descriptors such as “masculine” or “sexy” are self-selected aesthetic goals, not demographic requirements or guaranteed effects.

## 3. Shared terminology

These names are normative across all six documents.

| Term | Meaning |
|---|---|
| Fragrance | One catalog identity at a specified concentration/edition, not a brand or product family |
| CatalogRevision | Immutable published identity and evidence-backed feature snapshot |
| CollectionItem | A user’s relationship to a Fragrance: OWNED, PREVIOUSLY_OWNED, SAMPLED, or UNKNOWN |
| PreferenceRating | LOVE, LIKE, NEUTRAL, DISLIKE, or UNKNOWN; independent of ownership |
| Consultation | Versioned four-round interview, with saved answers and review summaries |
| ProfileVersion | Immutable snapshot of explicit preferences, hypotheses, context rules, and evidence |
| ContextPreset | Saved occasion/environment preferences, such as a discreet office commute |
| DecisionContext | Inputs for a particular choice, including occasion, season, outfit, presence, and shared-space constraints |
| RecommendationRun | Reproducible ranking snapshot using a ProfileVersion, catalog release, and scorer version |
| WardrobePlan / WardrobeSlot | Saved coverage across selected seasons and occasions, primarily using currently owned fragrances |
| WishlistItem | User intent to investigate or purchase; not proof of ownership |
| SampleTrial | A test of a fragrance with opening, two-hour, and six-hour observations |
| EvidenceRef | Typed reference to a user answer, rating, catalog claim, or confirmed correction |

## 4. Audience and scope

Primary persona: a fragrance enthusiast with a mixed history of owned and previously owned bottles, several favorites, uncertain reasons for liking them, and multiple daily contexts. Secondary persona: a beginner with no collection; allow all ratings to be skipped and use explicit preferences to start.

Single-user private accounts are the MVP. No public profiles or social feed. Launch in English with translation-ready labels and locale-aware dates; accept Unicode perfume names. Manual season and weather bands are sufficient; no location permission or weather API required.

### MVP requirements and acceptance

| ID | Requirement | Acceptance criterion |
|---|---|---|
| FR-01 | Accounts and privacy | User can sign in/out, export data, disable AI processing, and request deletion; another user cannot access any private object |
| FR-02 | Collection and identity resolution | Search verified identities, specify concentration, record ownership and rating separately; unresolved names remain private pending entries |
| FR-03 | Four-round consultation | Resume at the last saved step; skip nonessential questions; inspect summary after each round; no purchase recommendations before completion unless explicitly choosing a provisional result |
| FR-04 | Editable olfactory profile | Show stated versus inferred preferences with evidence; corrections generate a new ProfileVersion and mark dependent results stale |
| FR-05 | Recommendations | Every selected item resolves to a published catalog revision; show why, uncertainty, role, source, and possible overlap; separate owned options from samples to explore |
| FR-06 | Wardrobe | Generate editable season/occasion slots; only confirmed OWNED and available items satisfy owned coverage; gaps are advisory, not purchase commands |
| FR-07 | Scent decision system | User selects context and receives up to three owned choices with explanation; fragrance-free constraints return NO_FRAGRANCE |
| FR-08 | Wishlist and sampling | Save candidates, move through sample workflow, compare trials, record actual feedback; sampling alone never creates an ownership record |
| FR-09 | Provenance and catalog controls | Curator can publish or withdraw identity revisions; unsupported product claims cannot enter explanations; source citations are readable |
| FR-10 | Operational readiness | Meet isolation, recovery, accessibility, evaluation, observability, and performance gates in documents 02 and 06 |

### Deliberately outside MVP

Commerce, payments, affiliate ranking, live prices, stock aggregation, automated scraping, image recognition, image uploads, social recommendations, full autonomous chat, vector database, machine learning training, native apps, multi-language copy, weather integration, and bottle-volume tracking. Provide a manual correction form instead of open-ended conversational tool use. Local bulk seed import is for the curator only; no arbitrary user file ingestion in MVP.

## 5. Four-round interview contract

Collection setup precedes the interview and is editable throughout. Each round has structured fields, optional short prose, and a deterministic summary. Reuse known answers; do not repeatedly ask for them. Conditional clarifications stay inside the applicable round.

| Round | Questions and typed inputs | Summary and next step |
|---|---|---|
| 1 — Anchors | Up to three ranked favorites, up to three dislikes, enjoyment/motivation tags plus text, self/others/both motivation, collection status | Identify provisional anchors; ask why, not assume a note preference |
| 2 — Sensory reasons | Per-anchor appeal; sweetness DRY/BALANCED/SWEET/CONTEXTUAL/UNKNOWN; presence INTIMATE/MODERATE/STRONG/CONTEXTUAL/UNKNOWN; disliked qualities; seasonal tendency | Separate emotion from ingredient affinity; flag contradictory or unclear preferences |
| 3 — Context | Work and casual outfit styles, date character, important occasions, up to three identity descriptors, climate, open/capped budget plus currency, commute and shared-space preferences | Offer separate office/day and evening context rules; explicitly confirm scoped overrides |
| 4 — Calibration | Ratings for known collection, preferred clean direction, seasonal flexibility, compliment observations, longevity band, discovery SAFE/EXPLORATORY/BOTH | Resolve essential uncertainty; present complete profile for confirmation |

Essential to finish: each round acknowledged, at least one usable taste signal (anchor, non-unknown rating, or explicit direction), at least one occasion, and a presence preference or explicit “no preference.” Ratings and budget are optional. If signals are insufficient, show a limited profile and invite sampling; do not manufacture precision. Suggested completion time: 10–15 minutes, a hypothesis to measure in pilot.

## 6. Rules that preserve consultation quality

- Latest confirmed context-specific answer outranks earlier general preferences for that context. “Noticeable generally” plus “discreet on the train” is a context distinction, not a personality contradiction.
- Favor compositions and roles, not blanket note stereotypes. One neutral aquatic does not establish dislike of all aquatics. Neutral is not negative; unknown is no signal.
- Separate preference fit, occasion suitability, evidence coverage, and exploratory value. Never label a score as a percentage likelihood of enjoyment.
- “Open budget” removes the price constraint; it does not boost costly or niche products. Designer/niche labels are catalog metadata, not quality scores.
- Performance varies. Explain projection and longevity as reports/estimates, never guarantees. Application advice is qualitative and conservative; no claim that one spray makes a strong perfume commute-safe.
- Perfume is optional at gyms and shared venues. A declared fragrance-free setting is a hard stop.
- A role overlap is not chemical similarity. Overlap suggestions never automatically remove collection entries or discourage a fragrance the user loves.
- Wishlist and trial results update only through explicit user action. Compliments do not replace personal ratings.

## 7. Source-derived reference fixture

Use only as a test fixture; do not insert this person’s private data into production demos.

Top anchors in order: MFK Oud Satin Mood; Givenchy Xeryus Rouge; Prada Paradigme. Disliked name strings: Zara Bogoss Vibrant Leather Winter; Zara Absolutely Dark. Resolve all spellings and editions before attaching catalog identities. Preserve “Prada paradigm” as an original input alias candidate, not an automatic new product.

| Rating | Explicit round-4 entries |
|---|---|
| LOVE | BDK Gris Charnel; MFK Grand Soir; Byredo Mojave Ghost; Dior Fahrenheit |
| LIKE | MFK L’Homme à la Rose; MFK Gentle Fluidity Silver; Byredo Blanche; Bleu de Chanel; Chanel Allure Homme Sport |
| NEUTRAL | Byredo Rose Noir; Armani Acqua di Giò EDP; Dior Sauvage Elixir; Viktor & Rolf Spicebomb |
| UNKNOWN | Byredo Rose of No Man’s Land |

Ownership remains UNKNOWN until clarified because the user described a mixed current/former collection. Many concentrations are unspecified. Do not populate wear-now choices until ownership and identity are resolved. Light Blue, Ultra Male, and Sauvage EDP appear in the assistant’s final synthesis but are not confirmed collection entries in the retrieved user messages.

Reference profile: sophisticated/masculine/sexy; casual and smart casual minimalism; balanced sweetness; fresh woods; context-dependent presence; public-transport discretion; four seasons with flexibility; 6–8 hours desired longevity; open budget; both accessible and exploratory discovery. Family preferences inferred from products remain hypotheses until supported by catalog evidence and/or user confirmation.

The assistant proposed Reflection Man, Orphéon, masculin Pluriel, Terre d’Hermès Eau Givrée, Thé Noir 29, Platinum Égoïste, French Lover, and Bois Impérial. These are a source-history shortlist, not a mandated ranking or verified launch catalog. The application may return different results with better evidence.

## 8. Success measures and release conditions

Proposed pilot: 10–20 consenting users over two weeks. Targets are product hypotheses, not measured results.

- At least 70% of users who finish setup complete the consultation; report counts and drop-off by round.
- At least 80% of completed decisions receive “useful” or “very useful” in optional feedback.
- At least 70% of sampled recommendations receive LIKE or LOVE after a recorded trial; display denominator and selection bias.
- 100% recommended IDs are published/eligible; zero invented identities or unsupported product claims in the release evaluation set.
- 100% fragrance-free cases return no fragrance; zero former/unknown items in available-to-wear results.
- No critical accessibility or cross-account isolation defects; restore and deletion drills pass.

Do not optimize bottle purchases or time spent chatting. Instrument consented, pseudonymous completion and usefulness events without free text. Feature acceptance and milestone tests are mapped in [06](06-implementation-plan.md).
