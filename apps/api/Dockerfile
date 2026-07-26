FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9 --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY pnpm-workspace.yaml turbo.json tsconfig.base.json ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY apps/api/tsconfig.json apps/api/tsconfig.build.json apps/api/nest-cli.json ./apps/api/
COPY apps/api/prisma/schema.postgresql.prisma ./apps/api/prisma/schema.prisma
COPY apps/api/src/ ./apps/api/src/

ENV DATABASE_URL=postgresql://placeholder:placeholder@localhost:5432/placeholder
RUN cd apps/api && npx prisma generate --schema=prisma/schema.prisma
RUN cd apps/api && npx nest build

FROM node:20-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/node_modules ./node_modules
COPY --from=builder /app/apps/api/prisma ./prisma
COPY --from=builder /app/apps/api/package.json ./
COPY apps/api/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

USER nestjs
EXPOSE 3001

ENV NODE_ENV=production

ENTRYPOINT ["docker-entrypoint.sh"]
