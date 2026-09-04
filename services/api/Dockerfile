# ─── Stage 1: Install workspace dependencies (cached) ────────────────────────
FROM node:20-alpine AS deps
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /repo

# Copy workspace manifests first for maximum layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages/ packages/
COPY services/api/package.json services/api/

# Install ALL workspace deps (no devDeps for prod -- see builder stage)
RUN pnpm install --frozen-lockfile

# ─── Stage 2: Build ───────────────────────────────────────────────────────────
FROM deps AS builder
WORKDIR /repo

# Copy full source now that deps are installed
COPY services/api/ services/api/
COPY packages/ packages/
COPY tsconfig.base.json ./

# Build shared packages that the API depends on, then the API itself
RUN pnpm --filter @aura/models build || true
RUN pnpm --filter @aura/validation build || true
RUN pnpm --filter @aura/database build || true
RUN pnpm --filter @aura/auth build || true
RUN pnpm --filter @aura/api-service build

# ─── Stage 3: Production runner ───────────────────────────────────────────────
FROM node:20-alpine AS runner
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Copy built artifacts and production node_modules
COPY --from=builder /repo/services/api/dist ./dist
COPY --from=builder /repo/services/api/package.json ./
COPY --from=builder /repo/node_modules ./node_modules
COPY --from=builder /repo/packages ./packages

# Security: run as non-root
RUN addgroup -S aura && adduser -S aura -G aura
USER aura

EXPOSE 3001

HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
  CMD wget -qO- http://localhost:3001/health/ready || exit 1

CMD ["node", "dist/server.js"]
