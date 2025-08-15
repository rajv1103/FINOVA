# ---------- Builder ----------
FROM node:22-alpine AS builder
WORKDIR /app

# allow git access + certs for installs
RUN apk add --no-cache ca-certificates git

# Build-time args (only for public keys)
# NOTE: do NOT pass secret keys (like CLERK_SECRET_KEY) as build args.
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_CLERK_FRONTEND_API

# expose them as env vars during build (so next build can prerender)
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
ENV NEXT_PUBLIC_CLERK_FRONTEND_API=${NEXT_PUBLIC_CLERK_FRONTEND_API}

# Copy package files early for caching
COPY package*.json ./

# Copy prisma schema early so `prisma generate` in postinstall works
COPY prisma ./prisma

# Install dependencies
# - prefer npm ci when lockfile exists (reproducible)
# - fallback to npm install otherwise
# - always use legacy-peer-deps to avoid ERESOLVE on mismatched peers
RUN if [ -f package-lock.json ]; then \
      npm ci --legacy-peer-deps --no-audit; \
    else \
      npm install --legacy-peer-deps --no-audit; \
    fi

# Copy everything else
COPY . .

# Build the Next.js app
RUN npm run build

# ---------- Runner / Production image ----------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy production node_modules and built app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# At runtime (container start) run migrations then start the node server.
# Prisma deploy uses DATABASE_URL from runtime environment (DO NOT bake secrets in build args).
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
