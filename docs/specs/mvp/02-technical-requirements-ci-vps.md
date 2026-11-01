# 02 — Technical requirements (updated: CI builds + 1-core VPS constraints)

[Note: This version updates the deployment and operations guidance from 02-technical-requirements-updated.md to account for a 1 CPU core / 4 GB RAM / 50 GB disk Hostinger VPS running Coolify. All scoring, API, privacy, and verification rules remain unchanged.]

## 8. Deployment constraints and CI-first builds

### 8.1 VPS profile

- Target VPS: 1 CPU core, 4 GB RAM, 50 GB disk, 4 TB bandwidth.
- Coolify minimum is 2 cores / 2 GB RAM / 10 GB disk; this VPS is below the CPU minimum but can still run a small MVP if builds are kept off the VPS.[220][206]
- Practical implication:
  - Do **not** run Angular/Nest production builds or Docker image builds on the VPS by default.
  - Use CI (GitHub Actions or similar) to build and publish images; Coolify only pulls and deploys them.[229][231]

### 8.2 CI-first build strategy

- Use GitHub Actions (or an equivalent CI) to:
  - Run lint/typecheck/tests.
  - Build Docker images for `apps/api` and `apps/web` (or build static assets for web).
  - Push images to a container registry (e.g., GHCR).
  - Trigger Coolify deployment via webhook or API only after tests and image push succeed.[229][232]

- Coolify configuration:
  - For `fc-api` and `fc-web`, use **Docker Image** application type (not Git build) pointing to the published image.[229][231]
  - In Coolify, avoid enabling “Build server fallback” on the 1-core VPS; if you must build on the VPS, expect slow builds and possible dashboard unresponsiveness.[231][220]

### 8.3 Resource limits and monitoring

- In Coolify, set conservative CPU/memory limits per container to avoid one service starving others.[230]
- Monitor:
  - CPU and memory per container.
  - Build/deploy events.
  - API latency and error rates.
- If you see sustained high CPU or OOM events, consider:
  - Reducing services on the VPS.
  - Moving builds fully to CI.
  - Later upgrading CPU if user traffic grows.

### 8.4 User experience impact

- For low-traffic MVP, user-facing latency should remain acceptable if builds are off the VPS and containers are already running.[220]
- Main risk is during deploys or accidental on-server builds; mitigate by CI-first approach and queued deployments.
- Keep Supabase, API, Web, Uptime Kuma, and Umami as the only services on this box; avoid adding more databases or workers.

## 9. Updated deployment layout

```text
GitHub repo
  └─ GitHub Actions
       ├─ test + build images
       └─ push to GHCR
             └─ Coolify (Hostinger VPS, 1 core / 4 GB)
                  ├─ fc-api (Docker Image from GHCR)
                  ├─ fc-web (Docker Image or static assets from GHCR)
                  ├─ supabase (one-click service)
                  ├─ uptime-kuma (one-click service)
                  └─ umami (one-click service)
```

- Coolify pulls prebuilt images; it does not compile on the VPS.[229][231]
- This keeps the 1-core VPS focused on serving traffic, not building code.

## 10. Updated verification requirements

- Add CI checks:
  - Lint, typecheck, unit tests.
  - Docker image build for api and web.
  - Push to registry.
  - Optional smoke test against a staging URL.
- Only after all checks pass should Coolify be triggered to deploy.[229]

[References]
- Coolify docs: GitHub Actions builds and deploys images; Coolify deploys published images.[229][232]
- Coolify docs: Build servers and fallback behavior; avoid on-server builds when resources are tight.[231]
- Coolify docs: Resource limits and monitoring guidance.[230]
- Coolify docs: 1-core VPS can run but is not recommended; builds on same server can make it unresponsive.[220]
