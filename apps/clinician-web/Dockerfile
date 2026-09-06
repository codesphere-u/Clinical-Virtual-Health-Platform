# ─── Stage 1: Install dependencies ──────────────────────────────────────────
FROM node:20-alpine AS deps
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /repo

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages/ packages/
COPY apps/clinician-web/package.json apps/clinician-web/

RUN pnpm install --frozen-lockfile

# ─── Stage 2: Build ──────────────────────────────────────────────────────────
FROM deps AS builder
WORKDIR /repo

COPY apps/clinician-web/ apps/clinician-web/
COPY packages/ packages/
COPY tsconfig.base.json ./

ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm --filter @docaas/design-system build || true
RUN pnpm --filter @docaas/clinician-web build

# ─── Stage 3: Runner ─────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3002

RUN addgroup -S docaas && adduser -S docaas -G docaas

COPY --from=builder /repo/apps/clinician-web/.next/standalone ./
COPY --from=builder /repo/apps/clinician-web/.next/static ./.next/static
COPY --from=builder /repo/apps/clinician-web/public ./public

USER docaas

EXPOSE 3002

HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
  CMD wget -qO- http://localhost:3002/ || exit 1

CMD ["node", "apps/clinician-web/server.js"]
