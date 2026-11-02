# Angular development with AI

Use Angular's first-party guidance for framework implementation in this existing Angular SPA. Product behavior, privacy constraints and design tokens remain defined by the project specs. Visual design skills supplement Angular guidance.

Official entry points:

- [Develop with AI](https://angular.dev/ai/develop-with-ai): maintained instructions and documentation context.
- [Agent skills](https://angular.dev/ai/agent-skills): Angular's maintained developer skill.
- [Angular CLI MCP](https://angular.dev/ai/mcp): workspace-aware tools and configuration.

## Official skill

The `angular-developer` skill is installed at [apps/web/.agents/skills/angular-developer/SKILL.md](../../apps/web/.agents/skills/angular-developer/SKILL.md), from the [Angular team's repository](https://github.com/angular/skills/tree/main/angular-developer), reviewed on 2 November 2026. Its vendored files travel with this repository. Read it directly when the host's session catalog does not expose nested skills; installation does not itself activate its instructions.

Read only the references relevant to the task, such as components, signals, forms, routing, HTTP, Tailwind, testing or CLI/MCP. Determine the installed Angular version first, and keep the existing application/dependency versions. Its new-project defaults do not authorize recreating this app or upgrading it. Review upstream changes deliberately when refreshing the vendored skill.

For framework decisions, use the version-aligned Angular guidance before applying examples from generic UI/motion skills. Keep the current client-rendered SPA, semantic tokens, API ownership boundary and product flow contracts.

## Codex MCP connection

The repository's [.codex/config.toml](../../.codex/config.toml) registers the Angular CLI server using:

```sh
pnpm --filter web exec ng mcp
```

This selects the installed CLI and executes in the web package, where `angular.json` lives. It avoids fetching a floating CLI version. The existing Node/pnpm setup and installed workspace dependencies are prerequisites.

[Codex supports project-scoped MCP configuration in trusted projects](https://learn.chatgpt.com/docs/extend/mcp?surface=cli). Restart/reconnect the MCP client after configuration changes, then inspect its connected servers. A saved configuration and a standalone server handshake do not mean its tools have been attached to an already running chat.

## Implementation loop

1. Load the official skill; use MCP `list_projects` to discover the workspace/project and retain the returned paths.
2. Call `get_best_practices` for that workspace before editing Angular code. Use `search_documentation` for framework/API questions, checking compatibility with installed packages.
3. Follow the concise task plan and implement the applicable reference guidance within this project's contracts. Prefer the CLI for scaffolding. Generic design references must be adapted to Angular.
4. Prefer MCP tools for equivalent CLI actions when connected. Use only configured targets and the existing non-watch test options. Run the web production build after generating Angular code, as required by the official skill; add behavioral/browser/accessibility checks for changed flows.
5. When using MCP dev-server tools, wait for the relevant compilation outcome and stop servers started for the task when finished. Existing user servers should remain under their control.

Tool availability and input schemas depend on the installed CLI. Discover them rather than assuming every tool shown in current online docs exists locally. If MCP is unavailable, use the official docs and `pnpm --filter web exec ng ...`, plus the existing scripts, and state that fallback. For documentation navigation, start with [Angular's llms.txt index](https://angular.dev/llms.txt) and fetch targeted pages; avoid loading the full documentation bundle for each edit.

The server can run configured targets but does not supply this project's missing browser E2E suite or accessibility harness. Keep reporting actual verification evidence and limitations.

## Setup verification

On 2 November 2026, the configured launch command initialized `angular-cli-server` version 22.2.5 over stdio, exposed nine tools, discovered the `web` project in `apps/web/angular.json`, and successfully returned workspace-specific best practices. The Codex TOML parsed and local documentation/skill links resolved. This verifies the standalone server setup; reconnect the Codex client to attach its tools to a new session. Application code was unchanged, so application tests/builds were not repeated for this setup change.
