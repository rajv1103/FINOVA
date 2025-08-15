# 💸 **FINOVA** — *Spend Smart. Live Smarter.*

**Version:** `0.1.0`
A modern, AI-powered finance platform built with **Next.js** and **JavaScript**.
📊 Track, analyze, and improve your spending habits with real-time AI-driven insights.

---

## ✨ Features

* 🧾 **Smart Receipt Scanner**: Automatically extract data from receipts using advanced AI.
* 📈 **InsightIQ Dashboard**: Visualize spending trends and uncover hidden patterns with analytics.
* 🏦 **Unified Account Hub**: Connect all your banks and cards into one seamless experience.
* 🌍 **Currency Compass**: Manage multiple currencies with real-time conversion updates.
* 🤖 **AutoAdvisor**: Get personalized financial tips and automated recommendations.
* 💰 **Budget Blueprint**: Create, track, and optimize smart budgets with AI help.

---

## 🛠 Tech Stack

* **Frontend**: ⚛️ Next.js, React 19, Tailwind CSS
* **Authentication**: 🔐 Clerk
* **Forms & Validation**: 📝 react-hook-form, zod
* **UI Components**: 🎛 Radix UI, lucide-react, framer-motion, Shadcn ui
* **Charts & Visuals**: 📊 Recharts
* **Database & ORM**: 🗄 Prisma
* **Backend**: 🧩 Node.js, Express via `@arcjet/next`, Inngest for workflows
* **AI Services**: 🧠 Google Generative AI
* **Emails**: 📧 Resend
* **Other Tools**: 🕒 date-fns, 🔔 sonner, 🔐 vault

---

## 🧪 Available Scripts

* `pnpm dev` — ⚙️ Start the development server with Turbopack
* `pnpm build` — 🏗 Build for production
* `pnpm start` — 🚀 Run the production server
* `pnpm lint` — 🧹 Check code quality
* `pnpm email` — ✉️ Launch email development preview

---

## 🔐 Environment Variables

Rename `.env.example` to `.env` and provide the following (do **not** commit `.env`):

```dotenv
# Clerk
CLERK_API_KEY=
CLERK_SECRET_KEY=

# Database
DATABASE_URL=

# Email (Resend)
RESEND_API_KEY=

# Inngest
INNGEST_API_KEY=

# Google Generative AI
GOOGLE_API_KEY=

# Any other third-party credentials
```

---

## 🚀 Usage

1. Start the dev server:

```bash
pnpm dev
```

2. Open [http://localhost:3000](http://localhost:3000) 🌐

3. Sign up and link your accounts 🏦

4. Explore insights, set budgets, and get smart recommendations 💡

---

## ✅ Safe-public setup (what to add before pushing to GitHub)

This repo is safe to publish **if you do not commit credentials**. Follow the steps below to make sure the repo stays safe for public consumption and easy for others to run locally or in Docker.

### 1. `.gitignore` (add or update)

```
# Env files
.env
.env.local
.env.production
.env.development

# Node
node_modules
.next
npm-debug.log*

# Docker
Dockerfile
.dockerignore

# Misc
.vscode
.idea
```

### 2. `.env.example` (commit this — contains placeholders only)

```env
# Database connection string for Prisma (replace placeholders)
DATABASE_URL="postgresql://<USER>:<PASSWORD>@<HOST>/<DB>?schema=public&sslmode=require"

# Public environment variables (NEXT_PUBLIC_ prefix is required for Next.js to expose to client)
NEXT_PUBLIC_API_URL="https://example.com/api"

# Example secret key (replace in your own .env)
JWT_SECRET="replace_this_with_a_strong_secret"
```

### 3. `entrypoint.sh` (safe; will only run migrations if `DATABASE_URL` is provided)

```bash
#!/bin/sh
set -e

if [ -n "$DATABASE_URL" ]; then
  echo "DATABASE_URL detected — running prisma migrate deploy..."
  npx prisma migrate deploy || echo "No migrations applied or migration failed (continuing)"
else
  echo "No DATABASE_URL found — skipping migrations"
fi

exec "$@"
```

*Make executable before pushing:* `chmod +x entrypoint.sh` locally.

### 4. Docker & Compose (examples)

**`Dockerfile`** (multi-stage build — generate Prisma client during build):

```dockerfile
# Stage: builder
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage: runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]
CMD ["npm", "start"]
```

**`docker-compose.yml`** (production-like):

```yaml
version: "3.8"
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    restart: unless-stopped
    ports:
      - "3000:3000"
    env_file:
      - .env
    environment:
      - NODE_ENV=production
```

**`docker-compose.override.yml`** (development; optional):

```yaml
version: "3.8"
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    env_file:
      - .env
    environment:
      - NODE_ENV=development
    volumes:
      - ./:/app:cached
      - /app/node_modules
    command: ["npm", "run", "dev"]
```

> Note: Mounting source in dev mode with an anonymous `/app/node_modules` ensures the container's `node_modules` aren't overwritten by the host platform differences (Windows vs Linux).

### 5. How Prisma & Migrations behave here

* `prisma generate` only needs the `prisma/schema.prisma` file — it does **not** need a live DB.
* `npx prisma migrate deploy` applies committed migrations to the database pointed by `DATABASE_URL`. In this setup, we only run it when `DATABASE_URL` is present in the container environment.
* If you don't want auto-apply on container start, remove the `migrate deploy` line from `entrypoint.sh` and run migrations manually from your CI or from a local machine.

### 6. Push to GitHub safely

1. Ensure `.env` is listed in `.gitignore`.
2. Add `.env.example` (placeholders only) and commit it.
3. Do not commit `entrypoint.sh` without `chmod +x` locally (git will preserve the exec bit if set).
4. Optionally add a `SECURITY.md` or note in README about not committing secrets.

### 7. CI / Deploy notes (GitHub Actions)

* Store secrets in **GitHub Secrets** (e.g., `DATABASE_URL`, `RESEND_API_KEY`, `CLERK_API_KEY`).
* In workflows, inject them as environment variables to the job or the container step.

---

## 🧾 Full Setup & Quick Start (recommended for contributors)

1. Clone the repo

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

2. Copy the example env and fill it in

```bash
cp .env.example .env
# Edit .env and paste your Neon / Postgres connection string into DATABASE_URL
```

3. Install dependencies

```bash
pnpm install
```

4. Run in development

```bash
pnpm dev
```

5. Run with Docker (production-like)

```bash
docker-compose up --build
```

*Docker-compose will build the container, generate the Prisma client (during image build), attempt migrations only if `DATABASE_URL` is provided in the environment, and start the Next.js app on port `3000`.*

---

## 🤝 Contributing

Contributions are welcome! Open an issue or submit a PR to collaborate 💬

---

**Happy budgeting!** 🧮💚
Let FINOVA help you master your money.
