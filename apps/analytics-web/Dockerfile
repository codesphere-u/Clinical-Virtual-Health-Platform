# ─── Stage 1: Install dependencies ──────────────────────────────────────────
FROM node:20-alpine AS deps
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /repo

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages/ packages/
COPY apps/analytics-web/package.json apps/analytics-web/

RUN pnpm install --frozen-lockfile

# ─── Stage 2: Build ──────────────────────────────────────────────────────────
FROM deps AS builder
WORKDIR /repo

COPY apps/analytics-web/ apps/analytics-web/
COPY packages/ packages/
COPY tsconfig.base.json ./

ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm --filter @aura/design-system build || true
RUN pnpm --filter @aura/analytics-web build

# ─── Stage 3: Runner ─────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3004

RUN addgroup -S aura && adduser -S aura -G aura

COPY --from=builder /repo/apps/analytics-web/.next/standalone ./
COPY --from=builder /repo/apps/analytics-web/.next/static ./.next/static
COPY --from=builder /repo/apps/analytics-web/public ./public

USER aura

EXPOSE 3004

HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
  CMD wget -qO- http://localhost:3004/ || exit 1

CMD ["node", "apps/analytics-web/server.js"]
