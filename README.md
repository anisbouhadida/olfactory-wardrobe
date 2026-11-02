# Olfactory Wardrobe

Olfactory Wardrobe is a private app for recording a fragrance collection and completing a four-round consultation. It will provide an editable olfactory profile, explained recommendations, wardrobe and daily scent decisions, plus wishlist and sampling feedback. This repository currently contains the initial scaffold.

## Tech stack

- Angular 22 SPA with Tailwind CSS v4 and shared CSS design tokens; Angular CDK is planned for accessible behavior.
- NestJS modular monolith with Prisma 7 and the PostgreSQL adapter.
- Supabase for PostgreSQL and Auth (integration pending).
- pnpm workspace; GitHub Actions builds images for Coolify Docker Image deployments on a Hostinger VPS (image pipeline pending).

## Getting started

Use Node.js 24.21.0 (`.node-version`) and pnpm 12.6.0.

```sh
pnpm install
cp .env.example apps/api/.env
docker compose up -d db
pnpm --filter api exec prisma generate
pnpm dev
```

Web: `http://localhost:4200`. API: `http://localhost:3000` by default; set `PORT` in `apps/api/.env` to override it. Compose provides local PostgreSQL only; keep credentials in the ignored `apps/api/.env`.

```sh
pnpm test
pnpm build
```

For noninteractive tests use `CI=true pnpm test`. Run `pnpm lint` for type-aware TypeScript checks in both apps; Angular HTML templates and CSS are not linted.

See [AGENTS.md](AGENTS.md) for conventions, setup details, verification, and deployment constraints, and [docs/README.md](docs/README.md) for the specifications and documentation index.
