# 02 — Technical requirements (Tailwind + NestJS + Supabase on Coolify)

[Note: This file updates the technology, deployment, and basic operations choices from 02-technical-requirements.md. All scoring, API, privacy, and verification rules remain as originally specified unless explicitly restated here.]

## 1. Architecture and technology decisions

Use a **pnpm workspace** with:

- **Frontend:** Angular SPA styled with **Tailwind CSS**, using Angular CDK for behavior and accessibility primitives. No Bootstrap or Angular Material in the MVP.
- **Backend:** **NestJS** modular monolith exposing `/api/v1` as the single domain API.
- **Database & auth:** **Supabase** (self-hosted) providing PostgreSQL and Supabase Auth (magic links/passwordless, JWT sessions) as the identity provider and primary database.
- **Orchestration:** **Coolify** as the self-hosted PaaS on a Hostinger VPS, managing containers, reverse proxy, TLS, one-click services (including Supabase), and basic resource monitoring.
- **Ops add-ons (via Coolify):**
  - **Uptime Kuma** for uptime and basic health monitoring of the SPA, API, and Supabase stack.
  - **Umami** for lightweight, privacy-focused web analytics.

```text
Client (browser)
  ├─ Angular SPA (Tailwind)
  │     ├─ Supabase JS client (session + auth)
  │     └─ Umami tracking script (privacy-focused analytics)
  └─ HTTPS
        Hostinger VPS (Coolify)
            ├─ apps/web      (Angular static assets)
            ├─ apps/api      (NestJS API /api/v1)
            └─ services
                 ├─ supabase  (Postgres + Auth)
                 ├─ uptime-kuma (monitoring/status)
                 └─ umami     (web analytics)
```

### 1.1 Frontend

- The Angular SPA is built as a static bundle and served via a simple HTTP server or from the NestJS app, fronted by Coolify's reverse proxy.
- Tailwind CSS is configured from the shared design tokens (`packages/ui-tokens`), ensuring that semantic colors, typography, and spacing from the design brief are the single source of truth.
- Angular CDK provides overlays, focus management, and accessibility utilities; all visual styling uses Tailwind utilities and token-based classes.
- Umami's tracking snippet is injected on the client side for authenticated and unauthenticated pages, subject to the analytics consent toggle defined in the product requirements.

### 1.2 Backend (NestJS)

- The NestJS app remains the **domain orchestration layer**:
  - Implements all `/api/v1` routes for collection, consultations, profiles, recommendations, wardrobe, decisions, wishlist, sampling, privacy, and jobs.
  - Hosts the deterministic scoring engine in `packages/scoring` and applies the recommendation pipeline exactly as specified.
  - Coordinates multi-step transactions against Postgres (via Prisma or another Postgres client) to enforce invariants such as versioning, staleness, and soft-delete behavior.
  - Integrates with the optional LLM provider using the existing strict JSON contract, timeouts, and cost caps.

- NestJS does **not** implement its own credential store. Instead, it:
  - Validates incoming Supabase JWTs on each private request.
  - Derives the application user identity from the Supabase user ID claim.
  - Enforces application-level authorization and ownership constraints based on that identity and the schema described in document 05.

### 1.3 Database and auth (Supabase)

- Supabase provides a managed Postgres instance and an `auth` schema for user identities and sessions.
- Application tables described in `05-backend-schema.md` are created in the same Postgres database, in their own schemas, alongside Supabase's internal schemas.
- Supabase Auth is the **source of truth for authentication**:
  - Email/passwordless and magic-link flows are handled by Supabase.
  - Supabase issues JWTs that include the user identifier.
  - Angular uses the Supabase client library to sign in and attach tokens to requests.
  - NestJS treats these tokens as the authentication mechanism and does not store passwords or long-lived raw session secrets.

- Where the original schema documents bespoke auth-related tables (e.g., `AuthSession`, `LoginToken`), those may be retained only where they provide additional behavior beyond Supabase (such as product-specific session metadata). When in doubt, Supabase Auth is authoritative for login state; application tables remain authoritative for product-domain state.

### 1.4 Orchestration and deployment (Coolify on Hostinger VPS)

- The production deployment target is a Hostinger VPS on which **Coolify** is installed as the orchestration layer.
- Coolify manages:
  - Docker and container lifecycle for the Angular build, NestJS API, Supabase stack, Uptime Kuma, and Umami.
  - Reverse proxy configuration, domains, and TLS certificates (Let's Encrypt) for the SPA and `/api/v1`.
  - One-click deployment and upgrades of Supabase, Uptime Kuma, and Umami via their official service templates.

- The recommended deployment layout on the VPS is:

```text
coolify/                 # Coolify control plane
  ├─ projects/
  │   ├─ app-web/        # Angular SPA deployment
  │   ├─ app-api/        # NestJS API deployment
  │   ├─ supabase/       # Supabase stack (Postgres + Auth)
  │   ├─ uptime-kuma/    # Uptime monitoring + status pages
  │   └─ umami/          # Privacy-focused web analytics
  └─ data/               # Volumes for Postgres, backups, etc.
```

- Backups, logs, and metrics remain as described in the original technical requirements and implementation plan, but are now configured via Coolify and Supabase's Postgres where appropriate.

## 2. Monitoring and analytics

### 2.1 Uptime and basic health (Uptime Kuma)

- Deploy **Uptime Kuma** as a Coolify one-click service to monitor:
  - Public SPA endpoint (e.g., `https://app.example.com`).
  - NestJS API base URL (e.g., `https://api.example.com/api/v1/health`).
  - Supabase HTTP endpoint(s) and/or direct TCP checks on the Postgres port.
- Configure alerts to at least one notification channel controlled by the operator (email/Telegram/Slack/webhook), with thresholds tuned for a low-traffic MVP.
- Optionally enable a public status page once external pilots begin.

### 2.2 Product analytics (Umami)

- Deploy **Umami** as a Coolify one-click service dedicated to this application.
- Configure one site in Umami corresponding to the Angular SPA origin.
- Instrument the SPA with Umami's tracking script on all public and authenticated routes, gated by the analytics-consent toggle from the Settings screen.
- Define a small number of custom events to track core funnels (e.g., consultation completion, first wardrobe generation, first daily decision), avoiding granular behavioral tracking to preserve privacy.

## 3. Deterministic recommendation pipeline

[Unchanged: canonical inputs, profile inference formula, eligibility filters, component scores, diversity and gap analysis, and explanation codes remain exactly as specified in the original 02-technical-requirements.md.]

## 4. Optional LLM contract

[Unchanged: the adapter contract, schema validation, timeouts, retry and spend caps remain as originally defined. The presence of Supabase, Coolify, Uptime Kuma, or Umami does not change LLM behavior.]

## 5. HTTP API conventions

[Unchanged: route prefix, error shapes, optimistic concurrency, idempotency, and ownership rules remain exactly as in the original document.]

## 6. Infrastructure and performance targets

[Unchanged: availability targets, latency budgets, logging, metrics, backup/RPO/RTO, and health endpoints remain as originally specified; the only change is that Coolify, Supabase, Uptime Kuma, and Umami are the concrete means to achieve them on the Hostinger VPS.]

## 7. Verification requirements

[Unchanged: unit, integration, E2E, and model tests remain as in the original document. UI E2E tests must validate Tailwind-based layouts and the Supabase-authenticated flows against the accessibility and reflow requirements from the design brief, and may assert the presence of Umami scripts only when analytics consent is enabled.]
