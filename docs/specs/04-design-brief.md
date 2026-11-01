# 04 — Design brief

Version 1.0 · 31 October 2026

Companions: [PRD](01-product-requirements.md), [Technical requirements](02-technical-requirements.md), [App flow](03-app-flow.md), [Backend schema](05-backend-schema.md), [Implementation plan](06-implementation-plan.md).

## 1. Experience direction

Create a calm, knowledgeable consultation space. The reference user values minimal clothing, sophistication, discretion, and personal character. Translate this into restrained typography, generous space, clear choices, and useful explanations. The interface must work for other identities and tastes; do not turn a male reference persona into a gender-gated product.

Working visual direction: **warm paper, dark ink, muted forest green**. Avoid luxury clichés that imply expensive perfumes are superior. No gold-on-black overload, decorative bottle carousels, lifestyle photos of stereotyped bodies, or AI-generated product bottles that could misrepresent a real fragrance. Typography and layout should carry the design even without licensed imagery.

The application is a guided consultation with durable records. A chat transcript is not the primary navigation. Use progressive forms, editable summaries, product comparisons, and wardrobe views. Optional AI wording is subordinate to evidence and user control.

## 2. Visual system and Bootstrap 5.3

Use Bootstrap SCSS variables mapped to semantic tokens. Keep one light theme in MVP; a high-quality dark theme is a later feature. Do not duplicate Bootstrap utility behavior in a second CSS framework.

| Token | Value | Use |
|---|---|---|
| `--surface-page` | `#F7F5F0` | Page canvas |
| `--surface-card` | `#FFFFFF` | Forms and result cards |
| `--text-primary` | `#202923` | Main copy |
| `--text-secondary` | `#536158` | Supporting copy; verify in context |
| `--action-primary` | `#254D3B` | Main buttons with white text |
| `--action-hover` | `#173B2B` | Hover/pressed emphasis |
| `--border-subtle` | `#D4D8D2` | Decorative separators only |
| `--border-control` | `#6B786E` | Essential input/control boundary |
| `--focus-ring` | `#1459B5` | Visible 3 px focus outline, 2 px offset |
| `--danger` | `#9B2727` | Error text and destructive actions |
| `--warning-text` | `#704500` | Uncertainty and caution text |
| `--warning-surface` | `#FFF4D6` | Warning background |

Treat values as starting tokens, then verify all rendered combinations. Do not use a subtle border as the only way to identify an input. Bootstrap explicitly notes that some default color combinations can be insufficient, so a framework does not constitute an accessibility guarantee. [Bootstrap accessibility guidance](https://getbootstrap.com/docs/5.3/getting-started/accessibility/)

Typography: system sans-serif for body and controls; Georgia or a locally bundled licensed serif for limited profile headings. Body 16 px minimum, line-height 1.5–1.65. Page title 28–36 px responsive; section heading 22–26 px; metadata 14 px minimum. Never encode product concentration only in tiny metadata. Text measure 60–75 characters for prose and 48–64 for questionnaire prompts.

Spacing scale: 4, 8, 12, 16, 24, 32, 48 px. Card padding 20–24 px desktop, 16 px mobile. Radius 8 px controls, 12 px cards. Subtle shadow only for overlays. A single primary action per section; destructive actions separated from Save.

Bootstrap breakpoints: xs below 576, sm 576, md 768, lg 992, xl 1200, xxl 1400 px. App max width 1200 px; consultation content max 760 px. Main layout: at lg, persistent navigation plus content; below lg, compact header and accessible nav drawer. No bottom fixed bar that obscures browser keyboard or validation messages.

## 3. Core screen compositions

### Home

```text
[Brand] [Collection] [Profile] [Wardrobe] [Discover] [Account]
Good morning                               [Choose for today]
[Continue round 3 of 4 — saved at ...]      (only if relevant)
Your collection: 8 available · 4 historical · 2 unresolved
[Wardrobe coverage] [Sample awaiting your observations]
Recent choices and changes
```

Use user-local time if configured; a neutral greeting is sufficient. Never infer mood or character from activity. Keep the next meaningful action visible without scroll on common mobile screens.

### Consultation

```text
Round 2 of 4                         Saved
Understanding what you enjoy
[Brief purpose and time expectation]
Why do you enjoy [confirmed fragrance identity]?
[Choice chips implemented as labelled checkbox/radio controls]
[Optional short explanation]
[Back]                         [Review round]
```

Show only relevant conditional questions. The round indicator is a labelled ordered list with current step text, not four unlabeled dots. Summaries appear in a separate review panel; user statements and hypotheses have visibly distinct headings and badges.

### Profile

Lead with a plain-language summary. Below: taste directions, preferred presence by context, longevity target, style/occasion rules, and “Still learning.” Each trait has status, supporting answer/rating links, and a correction action. A family chart is optional and must have an equivalent text/table view. No radar chart that suggests false precision.

### Recommendation detail

Left/top: exact brand, name, concentration, ownership badge. Main body: why it fits, what is uncertain, role filled, overlap comparison. Secondary section: evidence and source dates. Sticky action only if it does not cover content: Save to wishlist / Record sample. Avoid a giant score or purchase CTA dominating the explanation.

Example copy pattern: “You rated [owned fragrance] highly and confirmed a preference for fresh woods. This option may suit your office role. Its projection evidence is limited, so sample it before relying on it for commuting.” Render the second sentence only if supported by approved facts and reason codes.

### Wardrobe

Desktop grid and mobile stacked cards expose the same information. Label gaps as “No confirmed match yet” or “More information needed.” Offer “Explore this role,” not “You need another bottle.” A pinned state includes icon and text. Moving or replacing an assignment uses a select/dialog flow; drag-and-drop is unnecessary in MVP.

### Scent decision

Compact form with occasion first, then weather/season, outfit, presence, shared-space constraints. Display active constraints above results. NO_FRAGRANCE has a complete result card (“This setting is fragrance-free”) and no empty recommendation placeholders. NO_MATCH identifies the limiting constraints and provides explicit edit buttons.

### Sampling

Timeline with Opening, Around 2 hours, Around 6 hours. Show actual observation time. Simple enjoyment and presence controls plus optional prose; skip is always available. Final rating confirmation is visually distinct from observation saving to prevent accidental preference changes.

## 4. Component inventory and behavior

| Component | Required states and accessibility |
|---|---|
| Fragrance search | Idle, typing, loading, results, empty, error; labelled combobox/listbox; arrow navigation, Enter select, Escape close |
| Identity choice | Brand/name/concentration/edition in text; unresolved option; no image-only identities |
| Rating control | Five labelled choices including Unknown; native radios or equivalent keyboard semantics |
| Anchor ranking | Ordered list with Move up/down buttons; announce updated position |
| Question field | Label, hint, optional marker, error linked with `aria-describedby`; validation on blur/submit, not every key |
| Save status | Quiet text; polite live announcement only on meaningful state change/failure |
| Trait/evidence badge | Text label and icon; STATED/INFERRED/CONFIRMED is never color-only |
| Source drawer | Focus managed; source type, URL, accessed date, field supported; return focus on close |
| Recommendation card | Heading, ownership, reasons, tradeoff, actions; whole card is not an ambiguous nested link |
| Compare view | Two or three items maximum; semantic table on desktop, labelled sections on mobile |
| Empty state | Explain why and provide one useful next action |
| Confirmation dialog | Initial focus on heading or safe control, focus trap, Escape for cancellation, accessible name |
| Toast | Supplemental acknowledgment only; failures also persist near the relevant action |
| Skeleton/loading | Fixed layout height; `aria-busy`; avoid announcing each skeleton |

Use plain text fallbacks for missing imagery. Product images require approved usage rights and accurate identity association; store rights/source metadata. Decorative imagery gets empty alt; meaningful product images use concise alt without duplicating adjacent text unnecessarily.

## 5. Accessibility acceptance

Target WCAG 2.2 AA as a design and testing target, not a compliance claim. Acceptance checks:

- All tasks work with keyboard alone; clear visible focus, no focus traps except intentionally managed modal dialogs.
- Screen reader can identify question/answer groups, round progress, validation errors, save failures, result state, and source labels.
- Text contrast at least 4.5:1 for normal text and 3:1 for large text; essential controls and focus indicators have adequate contrast. Verify actual rendered tokens, including disabled/error states.
- Comfortable 44×44 px touch targets where practical; at minimum meet applicable target-size rules with adequate spacing. Labels activate their controls.
- Reflow at 320 CSS px and 400% zoom without page-level horizontal scrolling; use stacked wardrobe view. Data tables may have explicitly labelled scroll regions only when necessary.
- Error summary receives focus on failed submit, links to invalid fields, and preserves all answers.
- Reduced-motion preference disables transitions. Otherwise limit opacity/transform feedback to 120–180 ms; no decorative motion or parallax.
- No auto-advancing interview, timed answer submission, inaccessible star-only ratings, hover-only explanations, or color-only certainty signals.
- Test with VoiceOver/Safari and NVDA/Firefox or Chrome, plus mobile screen-reader spot checks.

Forms should use visible labels, consistent with [Bootstrap form guidance](https://getbootstrap.com/docs/5.3/forms/overview/). Angular route changes update page title and move focus to the main heading after user navigation, without stealing focus during autosave.

## 6. Language and trust

Tone: attentive, specific, and candid. “You told us…” for direct evidence; “This may suggest…” for hypotheses; “We don’t have reliable performance data” for missing claims. Avoid “your perfect fragrance,” “guaranteed compliments,” “scientifically 98% compatible,” and statements that imply natural ingredients are safer or synthetic materials are inferior.

Default result headings: “From your collection,” “Worth sampling,” “Why this fits,” “What to test,” “Possible overlap,” and “Sources.” Context overrides are explained as preferences for a setting, not contradictions to fix. “Masculine” is a user-selected descriptor, never a restriction on who may wear a product.

Consent copy identifies the purpose and data shared. Deletion copy names what will be erased and when backups expire. No prechecked AI/analytics consent, pressure to buy, fake scarcity, or gated access to explanations.

## 7. Design handoff and validation

Deliver annotated wireframes for collection setup, four round types, review, profile, recommendation, wardrobe, decision, wishlist, sample trial, settings, and curator publication. Include loading, empty, conflict, provider-off, stale, and withdrawal variants. Provide token SCSS, component state inventory, keyboard interaction notes, content patterns, and responsive examples at 320/768/1280 px.

Before implementation polish, test five representative users on: resolve an ambiguous product, skip an unknown rating, resume a round, explain a context override, choose an owned scent, distinguish a hypothesis from a fact, record a sample, and disable AI. Target four of five completing each core task without intervention; treat small-sample results as usability signals. Record misunderstandings, not just completion time. Design revisions must preserve the shared terms and API states.
