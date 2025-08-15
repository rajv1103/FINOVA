# Dockerfile (robust, fixes ERESOLVE + prisma generate issues)
FROM node:22-alpine AS builder
WORKDIR /app

# required tools for some installs and HTTPS
RUN apk add --no-cache ca-certificates git

# copy package metadata early for cache
COPY package*.json ./

# copy prisma schema early so `prisma generate` (postinstall) can run
COPY prisma ./prisma

# install node modules:
# - use npm ci when lockfile exists (fast & reproducible)
# - otherwise fallback to npm install
# - pass --legacy-peer-deps to avoid peer dependency ERESOLVE (Clerk/Next mismatch)
# - --no-audit slightly speeds up installs in CI/docker
RUN if [ -f package-lock.json ]; then \
      npm ci --legacy-peer-deps --no-audit; \
    else \
      npm install --legacy-peer-deps --no-audit; \
    fi

# copy rest of the app
COPY . .

# build the Next.js app (needs dev deps)
RUN npm run build

# ---------- production image ----------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# bring in production deps and built app from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# run migrations then start the server
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
