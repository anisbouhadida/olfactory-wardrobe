# Web agent guidance

Inherit the root `AGENTS.md` and its coding workflow. Use `../../docs/development/engineering-workflow.md` for feature/test/review skill routing and cross-app acceptance. This file adds web-specific guidance.

- For Angular implementation, load the official `.agents/skills/angular-developer/SKILL.md` and only its task-relevant references. Follow the [official Angular AI workflow](../../docs/development/angular-ai.md) before editing framework code; it links Angular's AI instructions, skills, and MCP setup.
- When Angular CLI MCP is available, first call `list_projects`, then `get_best_practices` for the discovered web workspace before editing Angular code. Use `search_documentation` for API questions and prefer equivalent MCP actions for configured targets. If unavailable, read the official documentation and use the installed CLI through `pnpm --filter web exec ng ...`; report that fallback.
- Match guidance to the installed Angular version. Prefer signals/computed state, signal inputs/outputs, native template control flow, lazy feature routes and `inject()`; prefer Signal Forms for new Angular 22 forms. Preserve existing form strategies when maintaining them. Check version-specific defaults before adding decorator options or adopting an API.
- Before changing a user flow, read the applicable sections of `../../docs/specs/03-app-flow.md` and its update; for visual/accessibility behavior use `../../docs/specs/04-design-brief.md` and its update. The selected Tailwind stack overrides their older Bootstrap/SCSS implementation examples.
- Use Angular standalone components and the existing router. Use Tailwind v4 CSS-first configuration in `src/styles.css` and semantic tokens from `../../packages/ui-tokens/src/tokens.css`; preserve the design brief's palette and interaction requirements when using design skills.
- Prefer native semantic controls; add Angular CDK for focus/overlay behavior when needed. React, Next.js, Sonner, and Framer Motion examples in generic skills are conceptual references, not dependencies for this Angular application.
- Keep ownership and preference states separate in UI and request payloads. Provide loading, empty, validation, conflict, stale-result, insufficient-evidence, and fragrance-free states as applicable to the flow. Label provisional and inferred information explicitly.
- Supabase session handling and the generated API client are planned, not installed. Follow the API contract when implementing them; SPA route guards supplement server authorization. Use synthetic fixtures for development displays rather than the source person's private answers.
- For UI/UX and motion, follow `../../docs/development/ui-ux-motion-workflow.md` for exact skill triggers, user-only invocations, stop points and Angular/Tailwind adaptations. Load only the relevant branches; `review-animations`, the `emil-prototype` visual picker and `pick-ui-library` require explicit user invocation.
- The design spec is provisional. Use the latest explicit user direction; preserve the current baseline for maintenance and resolve material open direction choices before a redesign. `../../docs/proposals/motion-policy.md` is a requested proposal, not adopted policy. Verify desktop/mobile, keyboard/focus and reduced-motion behavior; report actual tool/device limitations.
- Unit tests use Angular CLI/Vitest: `pnpm --filter web test --watch=false` from the root. Lint checks TypeScript only; template/CSS lint and browser E2E are not configured. Production builds compile templates but do not establish accessibility or interaction correctness.

## Code Review Rules

- Flag UI that represents UNKNOWN as a neutral/negative rating, sampled/wishlisted fragrances as owned, stale advice as current, or fit scores as probabilities of enjoyment.
- Check keyboard access, visible focus, accessible names, responsive reflow, and meaningful recovery from save/conflict errors on changed interactions.
