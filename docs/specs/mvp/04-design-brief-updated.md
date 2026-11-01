# 04 — Design brief (updated for AI-assisted development)

[Note: Base content remains as in 04-design-brief.md. This version adds token→SCSS mapping hints and canonical Angular component skeleton notes.]

## 8. Token to SCSS mapping

Implement semantic tokens in `packages/ui-tokens` and the main web app SCSS:

- Define base variables in `packages/ui-tokens/src/_tokens.scss`:

```scss
:root {
  --surface-page: #F7F5F0;
  --surface-card: #FFFFFF;
  --text-primary: #202923;
  --text-secondary: #536158;
  --action-primary: #254D3B;
  --action-hover: #173B2B;
  --border-subtle: #D4D8D2;
  --border-control: #6B786E;
  --focus-ring: #1459B5;
  --danger: #9B2727;
  --warning-text: #704500;
  --warning-surface: #FFF4D6;
}
```

- Map tokens into Bootstrap variables in `apps/web/src/styles.scss` using SCSS:

```scss
$body-bg: var(--surface-page);
$body-color: var(--text-primary);
$btn-primary-bg: var(--action-primary);
$btn-primary-hover-bg: var(--action-hover);
$border-color: var(--border-control);
```

Adjust mappings as needed after accessibility checks.

## 9. Canonical Angular components

The following component patterns are recommended for AI-generated UI:

### 9.1 Recommendation card

- Selector: `app-recommendation-card`
- Inputs:
  - `@Input() item: RecommendationItemDto;`
  - `@Input() owned: boolean;`
- Content: brand/name/concentration, ownership badge, 2–3 positive reasons, 1 uncertainty, role label, overlap summary, actions (save to wishlist, record sample).

### 9.2 Wardrobe slot card

- Selector: `app-wardrobe-slot`
- Inputs:
  - `@Input() slot: WardrobeSlotDto;`
  - `@Input() assignments: WardrobeAssignmentDto[];`
- Content: season/occasion labels, up to three choices, pin state, gap/explanation, link to Discover with slot context.

### 9.3 Sampling timeline

- Selector: `app-sampling-timeline`
- Inputs:
  - `@Input() trial: SampleTrialDto;`
  - `@Input() observations: SampleObservationDto[];`
- Content: checkpoints (Opening, Around 2 hours, Around 6 hours) with forms for enjoyment, presence, detection, comments; clear separation between observation save and final rating confirmation.

These names and props are suggestions so Codex can generate consistent components; adapt them as needed during implementation.

