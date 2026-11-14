# Getting Started with CCMP (`v1.1.0`)

The Clinical Case Management Platform (CCMP) is a pnpm + Turborepo monorepo with 4 Next.js 15 portals (`patient-web`, `clinician-web`, `admin-web`, `analytics-web`), a Fastify 5.1 API (`services/api`), Prisma 6.2 (`packages/database`), LiveKit WebRTC SFU, and Flutter native apps (`flutter/`).

## 1. Install & Verify

```bash
pnpm install
pnpm db:generate
pnpm typecheck
pnpm test
pnpm build
```

## 2. Run Portals Locally

- `patient-web`: `http://localhost:3000`
- `clinician-web`: `http://localhost:3002`
- `admin-web`: `http://localhost:3003`
- `analytics-web`: `http://localhost:3004`
