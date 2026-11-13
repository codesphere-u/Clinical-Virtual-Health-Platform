# ─── Stage 1: Install workspace dependencies (cached) ────────────────────────
FROM node:20-alpine AS deps
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate
WORKDIR /repo

# Copy workspace manifests first for maximum layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages/ packages/
COPY apps/patient-web/package.json apps/patient-web/
COPY apps/clinician-web/package.json apps/clinician-web/
COPY apps/admin-web/package.json apps/admin-web/
COPY apps/analytics-web/package.json apps/analytics-web/
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

# Generate Prisma Client and build API + workspace dependencies in topological order
RUN pnpm --filter @docaas/database run db:generate
RUN pnpm --filter @docaas/api-service... build

# ─── Stage 3: Production runner ───────────────────────────────────────────────
FROM node:20-alpine AS runner
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Copy built artifacts and workspace node_modules preserving pnpm relative symlinks
COPY --from=builder /repo/services/api ./services/api
COPY --from=builder /repo/node_modules ./node_modules
COPY --from=builder /repo/packages ./packages

# Security: run as non-root
RUN addgroup -S docaas && adduser -S docaas -G docaas
USER docaas

EXPOSE 3001

HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
  CMD wget -qO- http://localhost:3001/health/ready || exit 1

CMD ["node", "services/api/dist/server.js"]
