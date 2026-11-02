# UI, UX and motion skill workflow

Reviewed 2 November 2026 for Angular 22 and Tailwind CSS 4. The user confirmed that the design spec is provisional and requested a separate motion-policy proposal. This guide defines skill routing; it does not approve a visual direction or change the product specs. [The motion proposal](../proposals/motion-policy.md) is a draft input to that future design revision.

## Availability and invocation

The 21 skills below are globally supplied in the current session, not repository dependencies. All 21 `SKILL.md` entry points were read in full, including the frontmatter that controls invocation, with relevant branch references inspected. The official `angular-developer` skill is **project-local**, not global; it remains the implementation companion for every Angular coding path.

- **Agent-selectable** means the agent may load the skill when the user's actual task matches its trigger. The user can also name it explicitly. It does not mean running it on every UI edit or starting an unrelated audit.
- **User-only** means `disable-model-invocation: true`: the user must explicitly invoke/name that particular skill. A request for a similar outcome alone does not authorize automatic selection of that skill. Ordinary self-review and dependency research remain available without it.
- **Request-driven** skills are agent-selectable but have a specialized output, stop point or side effect. A request to build a screen is not automatically a request to create a prototype picker, stress-test harness or app-wide audit.
- Reading a skill for this assessment is not executing its design commands. No Impeccable context/bootstrap, prototypes, design artifacts, packages, hooks or motion changes were run as part of the audit.

Resolve global skill paths from the session catalog. On this machine, most are under `~/.codex/skills/<directory>/SKILL.md`; `web-perf` is under `~/.agents/skills/`. Presence on disk and active session availability are separate.

## Complete relevant global inventory

| Skill / directory | Invocation | Exact use and deliverable | Angular/Tailwind fit |
|---|---|---|---|
| `frontend-design` | Agent-selectable | New UI or a substantial visual reshape: compact visual plan → compare against the brief → implement → critique. | Default visual-direction lead when that work is in scope; inherit selected tokens instead of inventing a new brand per screen. |
| `impeccable` | Agent-selectable, command-dependent | Full design orchestration; `shape` plans, `critique` assesses design, `audit` reports technical issues, `polish` refines, and named fix commands implement. | Optional alternative lead for an expressly requested structured design pass. Use Operate mode for task screens, not marketing choreography. See its separate path below. |
| `ui-ux-pro-max` | Agent-selectable | Targeted UX/design/stack research through its local search script. It returns recommendations, not framework authority. | Use `--stack angular` for Angular and `--stack html-tailwind` for CSS patterns; verify advice against the installed versions and official skill. |
| `emil-design-eng` | Agent-selectable | Component interaction/craft decisions: responsiveness, affordances, interruption, origin and visual consistency. Review output requires a Before/After/Why table. | Specialist for an actual component-quality decision, not a second competing visual system. Translate React examples to Angular. |
| `apple-design` | Agent-selectable | Gesture/sheet/momentum or Apple-style material/typography work; continuous input, velocity handoff and interruption. | Conditional on that interaction being requested. Does not turn the whole app into an Apple-styled product or authorize gesture/depth effects. |
| `animate` | Agent-selectable | Implement a specific web animation: frequency gate → purpose → tool → properties → curve/time → interruption/exit → reduced motion/hover. Can correctly deliver no animation. | Default specialist for authorized new motion. Native Angular/CSS/WAAPI implementation; active project policy constrains its generic recipes. |
| `find-animation-opportunities` | Request-driven | Read-only search for missing useful motion, including rejected candidates; at most 5–7 proposals for an app. | Use for “where would motion help?”; no automatic implementation of suggestions. |
| `improve-animations` | Request-driven | Recon → audit existing motion → vet findings → user selects plans → self-contained plan files. `execute <plan>` is a distinct execution mode. | Default audit/plan mode edits only its plans; no source edits, builds, installs or formatters. Execution mode delegates implementation and checks the resulting diff. |
| `review-animations` | **User-only** | Review a specific motion change, with Before/After/Why findings, locations and Block/Approve verdict. Read `STANDARDS.md` for exact values. | Not an automatic final gate. Project decisions override generic preferences such as always adding transforms or stagger. |
| `animation-performance` | Request-driven | Inventory driver/properties → diagnose cause → report fixes and measurement limits. Apply fixes when asked. | For jank/frame-budget questions; adapt per-frame React-state cautions to Angular rendering/lifecycle. No guaranteed GPU claims without measurement. |
| `animation-vocabulary` | Agent-selectable | Name a described effect; exact glossary definition, best term first, few alternatives if needed. | Terminology only. It neither proposes the design nor implements motion. |
| `mobile-native` | Agent-selectable | Diagnose/fix viewport, input zoom, touch/hover, scrolling, safe-area and keyboard behavior. | Mobile-web specialist. Apply only justified fixes; keep zoom, normal content selection and actual supported themes. Hardware is required for its full verification claim. |
| `break-ui` | Request-driven | Map rendered fields/limits → plausible stress fixtures → dev-only toggle → inspect → report and stop. `+ fix` applies unambiguous fixes. | Use for explicit stress testing, not ordinary screenshots. Preserve fixtures; keep toggles out of production and real private data out of examples. |
| `web-design-guidelines` | Agent-selectable | On a UI/accessibility review, fetch fresh guidelines, inspect scoped files and report `file:line` findings. | Code review aid, not proof of accessibility compliance. Adapt framework examples and respect intentional product decisions. |
| `playwright` | Agent-selectable | Browser navigation, snapshots, interaction, screenshots/traces via its CLI workflow. | Default browser-verification skill when terminal automation is needed. Does not install a project regression suite; do not create `@playwright/test` specs unless requested. |
| `web-perf` | Request-driven | Discover tools → collect page trace/network evidence → analyze → report prioritized findings. | Use for loading/interaction performance, not animation taste. Missing trace tools must be disclosed; this skill does not require Cloudflare hosting. |
| `prototype` in **`emil-prototype/`** | **User-only** | One UI piece, normally three genuinely different working variants, exact picker harness, verify all, then **wait for user choice**; integrate only the chosen variant. | Isolated Angular development surface. Production integration and cleanup follow selection; no automatic favorite. |
| `prototype` in **`prototype/`** | Request-driven | Throwaway experiment answering one question: single-file logic/state demo or UI variants in realistic context. Capture the conclusion; retain prototype on a throwaway branch under its workflow. | Use when exploration is requested and the branch is clear. Angular UI variants use the router/dev-only boundary; logic demo can be standalone HTML. Its no-tests shortcut never carries into production. |
| `pick-ui-library` | **User-only** | Match a task against a curated dependency list, inspect existing packages, recommend one; install only if in scope. | React-heavy list. Check actual Angular support and explicitly say when the task falls outside the curated list; native controls/CDK may be the right Angular solution. |
| `ask-sonner` | Agent-selectable, **not applicable here** | Setup/troubleshoot the React Sonner library. | No Angular integration is established by this skill. Do not select it for generic Angular notifications or assume an Angular port shares its API. |
| `animate-expo` | Agent-selectable, **not applicable here** | Build React Native/Expo motion with Reanimated and native gesture/navigation APIs. | Mobile web is still Angular: use `mobile-native` + web motion skills, not Expo dependencies. |

Two skills share the name `prototype`; **the directory/path must be explicit** when choosing between them. A user can say “Use the prototype skill from emil-prototype for three recommendation-card variants.” Do not silently pick a different skill with the same name.

An additional `gpt-taste/SKILL.md` was found and read on disk, but it is **not advertised in this session's available catalog**. It mandates simulated random choices, AIDA pages, React/GSAP and scroll choreography. It is not part of this Angular product workflow. It was not removed from the user's global installation. Image/media generation and inline visualization tools are separate asset/communication capabilities, outside this coding-skill inventory; they are not substitutes for a working Angular prototype or browser validation.

## Recommended default implementation path

This path is a project recommendation, not a claim that every global skill mandates the same process. Load the smallest relevant set; do not chain all 21 skills.

### 1. Resolve the task and current design authority

**Agent:** read the applicable user direction, current flow/design specs, actual target code and tokens. Mark the design spec as provisional. For maintenance, preserve incumbent behavior/identity unless the request changes it. For a new visual system or materially open screen, ask about the task, audience, desired outcome and visual reference/direction before making a product-wide choice. Reuse facts already supplied; do not ask again whether this is Angular or Tailwind.

**User:** supplies new direction/references and resolves actual open choices. A future spec update is not permission to discard every current decision today. A proposed direction or this skill guide is not an approved spec revision.

**Output:** concise plan with target, acceptance states, design authority, open decisions and verification. A precise implementation request proceeds directly after this plan; no routine plan-approval gate.

### 2. Establish the visual and interaction approach

**Agent:** use `frontend-design` when creating or materially reshaping the visual composition. Produce its compact palette/type/layout/principles plan and compare it against the current direction. On a small defect inside a settled design, skip a new art-direction exercise.

Use `ui-ux-pro-max` as a research companion for the specific decision. Its query contract is:

- a genuinely new page/product-wide direction: `--design-system` exploration; reconcile the result with user commitments;
- a targeted UX problem: one `--domain ux` search, then stack guidance only for a separate implementation need;
- stack guidance: `--stack angular`; use `--stack html-tailwind` separately for Tailwind styling concerns;
- narrow queries, one retry on empty/off-target output, and honest fallback labeling.

Invoke `<ui-ux-pro-max-dir>/scripts/search.py` through its actual catalog-resolved absolute path, not its example `${CLAUDE_PLUGIN_ROOT}` path. Do not persist a competing `design-system/MASTER.md` over existing authority. `--persist --output-dir <project-root>` is only for a deliberate design-system capture; its `--force` requires explicit user authorization.

Use `emil-design-eng` only for a concrete component craft question. Use `apple-design` only when the task specifically needs its gesture/material/typographic reasoning. Neither silently chooses a new visual identity.

**User:** chooses alternatives only if an exploration was requested or a material unresolved direction remains. No requirement to approve every spacing value.

### 3. Implement Angular behavior and Tailwind styling

**Agent:** load the project-local `angular-developer` skill; when connected, Angular MCP `list_projects` → `get_best_practices` → targeted documentation lookup. Follow [the Angular workflow](angular-ai.md).

Use standalone components, signal-driven state, native control flow, the current form strategy/official Angular 22 guidance, and semantic controls. Angular/CDK owns component semantics and focus behavior where needed. Generic React primitives in the global skills do not establish Angular compatibility.

Use Tailwind 4 CSS-first setup in `apps/web/src/styles.css` and shared tokens in `packages/ui-tokens/src/tokens.css`. Keep class names statically discoverable; use Angular class/style bindings rather than dynamic class-string assembly. Do not add a Tailwind 3 config or Bootstrap to follow an old example. Match responsive behavior to the actual configured breakpoints, not the older spec's assumed Bootstrap meanings of `lg`.

**Evidence from this review:** a real `ui-ux-pro-max --stack angular` search recommended classic Reactive Forms and broad `CommonModule` examples. The official Angular 22 guidance is more specific for new forms/imports. Its Tailwind results also recommended dark-mode support; an unrequested theme is not a mandatory feature. Treat matches and their version labels as advice to verify, not commands.

### 4. Add only scoped, purposeful motion

**Agent:** if motion is part of the task, invoke `animate`, read its matching `RECIPES.md` section, and record purpose, expected frequency, affected element/property, exact timing/easing, reduced-motion path, interruption and exit. Frequency estimates are hypotheses unless actual evidence exists; do not claim measured daily counts.

For Angular 22, use CSS transitions for state changes, [Angular `animate.enter`/`animate.leave`](https://angular.dev/guide/animations) for DOM entry/removal, and WAAPI when programmatic cancellation/sequencing is justified. Bind classes/signals to semantic state, rather than updating Angular state every frame. Cancel owned animations/listeners during teardown; custom leave callbacks must complete Angular removal even on cancellation/failure. Exiting DOM must not retain focus or block input after dismissal.

For Tailwind use explicit transition properties and durations; apply `motion-safe`/`motion-reduce` variants or scoped media queries consistently. Tailwind 4's `hover:` checks hover capability; add a fine-pointer condition where that interaction requires precision. Do not use `transition-all` as a motion default. See [Tailwind state variants](https://tailwindcss.com/docs/hover-focus-and-other-states) and [transition properties](https://tailwindcss.com/docs/transition-property), checking installed-version support.

No React/Motion/GSAP package is a prerequisite for this path. Native controls/CDK solve component behavior. `animate` suggests invoking `pick-ui-library` for a component, but that skill is user-only: **do not auto-invoke it**. Use the existing Angular behavior guidance, or suggest that optional explicit skill if library selection is actually needed.

The current spec's motion limits remain a provisional implementation baseline until replaced by explicit user direction/spec changes. The separate proposal is not active policy. Avoid replacing an accordion's actual layout behavior with `scaleY` solely to satisfy a generic performance rule; choose a correct nonanimated state or an explicitly accepted measured exception.

### 5. Verify the actual interaction

**Agent:** use the Playwright skill for browser automation when needed; follow its prerequisite and fresh-snapshot rules. Use tool availability rather than claiming unavailable trace/device capabilities. Verify the scoped path at representative narrow/intermediate/wide sizes and with keyboard, focus restoration, supported pointer modes, loading/empty/error/conflict/stale states, and reduced motion. The current brief names 320/768/1280 px and 400% reflow checks; carry them as the provisional acceptance baseline until revised.

Select `mobile-native` for mobile-web platform behavior; apply declarations only where their rationale holds. Do not disable browser scrolling, text selection, zoom or pull-to-refresh globally just to mimic a native app. Preserve theme scope. Real-device claims require real-device evidence; emulation is useful but insufficient for all touch/keyboard/safe-area behavior.

Run relevant Angular tests, lint and the web production build after generated Angular code. A browser check is not a committed E2E suite. Report untested hardware, assistive technology, browser engines and measurements; ask for device feedback only where the agent cannot obtain it.

### 6. Review, fix within scope and finish

**Agent:** perform ordinary scoped self-review against the project acceptance criteria. Use `web-design-guidelines` on a requested standards/accessibility review, fetching its latest source as required. Use `animation-performance` for a motion-cost question or observed jank; it reports first and fixes when requested. Use `web-perf` for page-level load/interaction performance with actual measurements.

Do not invoke the user-only `review-animations` skill automatically; ordinary motion checks still include purpose, timing, interruption, reduced motion and focus. Do not start a new app-wide audit or `break-ui` fixture harness as a side effect of a narrow implementation.

For an Impeccable-led pass, honor its bounded verification: one batched inspection, one fix batch and at most one confirmation round at entry-point level, plus the selected branch's explicit review handoffs. Avoid endless cosmetic polish. Outside that path, finish once acceptance checks pass; rerun only when changes or new failures justify it.

**Output:** what changed, selected skills and why, user decisions applied, verification results and remaining limitations. No automatic new approval gate.

## Deliberate alternative paths and user decision points

| User intent / example | Agent-selected path | Actual stop or follow-up |
|---|---|---|
| “Design and build the collection screen using this direction.” | Default path above. | Proceed after concise plan if material decisions are settled. |
| “Use impeccable shape for the consultation flow.” | `impeccable` context + `reference/shape.md`. Discovery, then brief only. | Explicit brief confirmation; **no code** in shape. A precise prompt may need only compact confirmation. |
| “Use impeccable to create a new design direction.” | Its full context/init/new-work path, with confirmed product facts, Operate mode and its required direction/concept procedures. | Follow its actual choice/confirmation process, then build and branch-required review/documentation. Do not substitute the lightweight path while claiming Impeccable execution. |
| “Polish this card without changing its design.” | `impeccable polish` or focused `emil-design-eng`, selected for the requested depth. | Polish implements scoped refinements; it is not a redesign. |
| “Audit accessibility/technical quality.” | `impeccable audit` for a comprehensive report, or `web-design-guidelines` for scoped standards findings. | Audit reports; fixes are a separately requested follow-up. Do not invent unsupported themes as audit failures. |
| “What could benefit from motion?” | `find-animation-opportunities`. | Read-only proposal; choose a suggestion before implementation. |
| “Audit our existing motion and plan improvements.” | `improve-animations`; selected AUDIT/PLAN references. | Findings first; user selects plans. `execute <plan>` explicitly starts its executor mode. |
| “Use review-animations on this diff.” | User-only skill, with `STANDARDS.md` as needed. | Findings table and verdict; review is not permission for unrelated fixes. |
| “Use prototype from emil-prototype for three card variants.” | User-only visual-picker skill; load `PICKER.md`. | Verify each variant, then wait for selection before promotion. |
| “Prototype whether autosave conflicts make sense.” | `prototype` from `prototype/`, using `LOGIC.md`. | Explore state in memory; capture the conclusion before production implementation. |
| “Stress-test the fragrance card.” | `break-ui`, with `CATALOG.md`. | Report and stop. “+ fix” authorizes unambiguous fixes; unresolved product decisions still go to the user. |
| “Use pick-ui-library for an Angular combobox.” | User-only dependency skill plus actual Angular compatibility checks. | Recommend based on the existing stack; do not install a React library as an Angular shortcut. |
| “This drawer drops frames.” | `animation-performance`; `diagnosing-bugs` when investigating a concrete failure. | Establish cause/measurement; apply fixes if the user's request includes fixing. |

### Impeccable's setup is real work

For any actual Impeccable execution, run its own `scripts/impeccable context` once per session with the real skill base path and target. Read the chosen command reference; read `craft-floor.md` immediately before UI edits, not merely for planning. A bare `$impeccable` invocation yields recommendations/menu, not permission to execute one. A workflow question yields advice without commands.

Its new/replacement-world branch can require PRODUCT.md, DESIGN.md, surface briefs, concept-selection scripts, review and documenter handoffs. Read and follow the full branch when executing it. Those files must derive from actual product truth and the user's selected direction, and must not become competing product specs. User-pinned choices override random/concept assignment. Subagents are permitted only where the invoked skill's branch actually requires them and the host supports them; unavailable named agents must not be reported as having run. Respect its documented fallback and disclose substitutions.

`hooks`, `pin`, `doctor` and repair actions are not side effects of ordinary design work. Its entry point says not to repair stale design context without the user's request except explicitly auto-classified updates. The skill's full new-work branch has branch-specific review/rebuild rules; the short default path above does not pretend to replace them.

## Conflict resolution

1. Latest explicit user direction and authorized scope govern, including the provisional status of the design spec.
2. Product invariants and applicable current specs govern meaning, ownership, privacy and interaction contracts; a design skill cannot silently rewrite them.
3. Official version-matched Angular guidance and the actual Tailwind setup govern implementation.
4. Use the selected design/motion skill for its intended task and output, while retaining its invocation restrictions.

Record intentional departures instead of manufacturing findings. In particular, instant keyboard/focus changes, no decorative stagger, reduced motion with no transitions, a pure fade, a light-only theme, and the current system fonts are not defects merely because a global skill prefers something else. Do not delete these global skills or modify their instructions to resolve project-local conflicts.
