# Web

Angular standalone SPA with Tailwind CSS v4 and shared semantic tokens. The current UI is the Angular starter; application routes, Supabase sessions and generated API client are pending.

Use the [root setup](../../README.md) and [web agent guidance](AGENTS.md). Run commands from the repository root:

```sh
pnpm dev:web
pnpm --filter web test --watch=false
pnpm --filter web build
```

The development server uses port 4200. Production output is under `apps/web/dist/web/`. Tailwind configuration lives in `src/styles.css`; shared colors live in `packages/ui-tokens/src/tokens.css` from the repository root.

Tests use Angular CLI/Vitest. Root `pnpm lint` covers web TypeScript, not HTML templates or CSS. Browser E2E and automated accessibility checks are not configured; `ng e2e` is not an available project target.

Follow the [design and flow specifications](../../docs/README.md) when replacing the starter. Use Tailwind rather than older Bootstrap/SCSS examples in the design supplements.

For AI-assisted Angular development, follow the [official Angular skill and CLI MCP setup](../../docs/development/angular-ai.md). The project-scoped MCP configuration uses the installed CLI; reconnect the client after setup.
