# Motion policy proposal — draft for the design-spec revision

Status: **proposal only, not active policy**. Requested by the user on 2 November 2026. The design spec will be revised; this file supplies concrete choices for that revision and does not modify `docs/specs/04-design-brief.md` or implementation tokens.

## Proposed direction

Use motion to make actions, state changes and spatial relationships easier to understand. Let the future visual direction choose its character; this proposal does not fix a palette, typeface, material style or brand metaphor. Build a small repeatable motion vocabulary before choosing any animation library.

The current provisional spec limits opacity/transform feedback to 120–180 ms and disables transitions under reduced motion. The proposal below broadens timing selectively for overlays, while keeping core navigation, reading and answer entry immediate. It does not authorize decorating every component or adding choreographed page loads.

## Proposed motion matrix

Values are design recommendations for evaluation, not measured optimal values or approved requirements. Easing comes from the reviewed `animate` skill; exact token names would be agreed during implementation.

| Interaction | Proposed behavior | Exact starting values for a prototype |
|---|---|---|
| Keyboard shortcuts, focus movement, radio/list navigation, typing, frequent result filtering | No spatial animation or waiting. Provide immediate state/focus feedback. | 0 ms. |
| Pointer press feedback | Subtle optional scale, with instant semantic action behavior; no motion-dependent action. | Scale 1 → 0.98; 120 ms; `cubic-bezier(0.23, 1, 0.32, 1)`. |
| Acknowledgment or small state replacement | Prefer stable text/geometry; fade only if it makes the change clearer. | Opacity only; 140 ms; same ease-out. |
| Popover/source drawer/modal entry | Small movement from a meaningful origin, if orientation benefits; focus behavior remains immediate. | 180 ms for popovers; up to 240 ms for larger overlays; same ease-out. Trigger-relative origin for anchored surfaces, centered for modal dialogs. |
| Overlay exit | Follow the entry path; restore focus and disable dismissed interaction without waiting for the visual finish. | 140–180 ms; same ease-out. |
| Consultation round or route navigation | Prefer immediate navigation/title/focus over decorative page motion. A small contained continuity transition requires a demonstrated benefit. | Default 0 ms; optional scoped 140–180 ms transition only after evaluation. |
| Loading and save status | Static skeleton/stable status first. Announce meaningful status, not every frame or keystroke. | No mandatory shimmer/spinner animation; no artificial save delays. |
| Reordered/updated results | Preserve readable identity and ordering. Do not animate a score into apparent certainty. | Default 0 ms; only a specifically selected continuity transition may be added. |

Default allowed animated properties: transform and opacity. The future spec may allow bounded color feedback after contrast review. Layout-driven animation, blur, shadows, clip paths, springs and gestures need a specific interaction justification and target-device evidence; none is required for the current flows. No blanket `transition-all`, global `will-change`, bounce, scroll reveal, parallax, auto-advancing interview or animated data counts.

## Reduced motion: recommended choice and open option

**Recommended:** retain the current strict behavior: transitions/animations are absent for `prefers-reduced-motion: reduce`, including programmatic WAAPI paths. Show the final state immediately and retain labels, visible focus and status announcements. Motion is never the only feedback. This intentionally differs from global skills that prefer a short fade under reduced motion.

**Alternative for the user to decide during the spec revision:** allow a short opacity-only transition for a named state replacement, capped at 120 ms, while keeping spatial movement, loops and gesture settlement absent. Do not implement this alternative without that explicit decision. No decorative effects are needed to distinguish the normal and reduced-motion experiences.

## Angular 22 / Tailwind 4 implementation constraints

Use CSS for state feedback and Angular `animate.enter`/`animate.leave` for DOM lifecycle where useful. Use WAAPI only for a justified need for programmatic control; clean it up on teardown and implement the immediate reduced-motion path. Preserve semantic state and focus regardless of visual completion.

Keep one motion-token vocabulary with the shared tokens and existing CSS-first Tailwind theme integration. Scope motion-safe/reduce and hover capabilities; support touch and keyboard without a mouse-only affordance. An animation is interruptible and repeated activation does not queue obsolete work. The current app does not need `@angular/animations`, React Motion, GSAP, or a spring library to implement this proposed vocabulary.

## How to evaluate and adopt

1. Confirm whether these behaviors suit the updated visual direction, and select strict or named-fade reduced-motion handling.
2. Prototype only a few representative interactions: a press, source drawer, consultation state change and save result. If the user requests the visual-picker prototype, wait for their choice; otherwise show one scoped implementation with static/reduced-motion comparison.
3. Test interruption, repeated activation, keyboard focus, normal/reduced preferences, touch/keyboard behavior and slow-loading conditions. Obtain real-device observations for platform-sensitive claims; inspect frame behavior rather than assuming transform guarantees compositing.
4. The user explicitly requests the corresponding design-spec update after choosing the policy. Then update specs, tokens, implementations and acceptance cases together in the authorized task.

Until adoption, this remains input to a design decision. No source, token, timing or accessibility preference has been changed by creating this document.
