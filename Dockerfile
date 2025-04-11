# syntax=docker.io/docker/dockerfile:1

FROM node:18-alpine AS base

# 1. Install dependencies only when needed
FROM base AS deps

# Install system dependencies and pnpm
RUN apk add --no-cache libc6-compat curl && \
    corepack enable && \
    corepack prepare pnpm@8.15.4 --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies with lockfile compatibility fallback
RUN if [ -f pnpm-lock.yaml ]; then \
      pnpm install --frozen-lockfile; \
    else \
      pnpm install; \
    fi

# 2. Rebuild the source code only when needed
FROM base AS builder

# Install pnpm again for this stage
RUN apk add --no-cache curl && \
    corepack enable && \
    corepack prepare pnpm@8.15.4 --activate

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Copy the appropriate env file
COPY .env.example .env.production

RUN pnpm build

# 3. Production image
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]