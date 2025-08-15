
---

# 💸 **FINOVA** — *Spend Smart. Live Smarter*

**Version:** `0.1.0`
A modern, AI-powered finance platform built with **Next.js** and **JavaScript**.
📊 Track, analyze, and improve your spending habits with real-time AI-driven insights.

---

## ✨ Features

* 🧾 **Smart Receipt Scanner** — Automatically extract data from receipts using AI.
* 📈 **InsightIQ Dashboard** — Visualize spending trends and uncover hidden patterns.
* 🏦 **Unified Account Hub** — Connect all your banks and cards in one place.
* 🌍 **Currency Compass** — Manage multiple currencies with real-time conversions.
* 🤖 **AutoAdvisor** — Personalized financial tips and automated recommendations.
* 💰 **Budget Blueprint** — Create, track, and optimize budgets with AI assistance.

---

## 🛠 Tech Stack

* **Frontend:** ⚛️ Next.js, React 19, Tailwind CSS
* **Authentication:** 🔐 Clerk
* **Forms & Validation:** 📝 react-hook-form, zod
* **UI Components:** 🎛 Radix UI, lucide-react, framer-motion, Shadcn UI
* **Charts & Visuals:** 📊 Recharts
* **Database & ORM:** 🗄 Prisma + PostgreSQL / Neon
* **Backend:** 🧩 Node.js, Express (`@arcjet/next`), Inngest
* **AI Services:** 🧠 Google Generative AI
* **Email:** 📧 Resend
* **Other Tools:** 🕒 date-fns, 🔔 sonner, 🔐 vault

---

## 🧪 Available Scripts

```bash
pnpm dev        # Start dev server (Turbopack)
pnpm build      # Build for production
pnpm start      # Run production server
pnpm lint       # Lint and check code quality
pnpm email      # Email preview with Resend
```

---

## 🔐 Environment Variables

Create a `.env` file (copy `.env.example`) and set:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
NEXT_PUBLIC_CLERK_FRONTEND_API=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Database
DATABASE_URL=postgresql://<USER>:<PASSWORD>@<HOST>/<DB>?sslmode=require

# Google Generative AI
GOOGLE_API_KEY=

# Email (Resend)
RESEND_API_KEY=

# Other API keys
GEMINI_API_KEY=
ARCJET_KEY=
```

> ⚠️ **Do not commit `.env`** — use `.env.example` with placeholders instead.

---

## 🚀 Running Locally

1. Clone the repo:

```bash
git clone https://github.com/your-username/finnova.git
cd finnova
```

2. Install dependencies:

```bash
pnpm install
```

3. Copy and configure environment variables:

```bash
cp .env.example .env
# Fill in your API keys, DB URL, and Clerk keys
```

4. Run the development server:

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000)

---

## 🐳 Running with Docker

### Dockerfile (multi-stage, production-ready)

```dockerfile
# Stage: builder
FROM node:20-alpine AS builder
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
EXPOSE 3000
CMD ["npm", "start"]
```

### docker-compose.yml

```yaml
version: "3.8"
services:
  web:
    build: .
    restart: unless-stopped
    ports:
      - "3000:3000"
    env_file:
      - .env
    environment:
      - NODE_ENV=production
```

### Running Docker Locally

```bash
docker-compose up --build
```

* The app will be available at [http://localhost:3000](http://localhost:3000)
* Prisma client is generated during build; migrations only apply if `DATABASE_URL` is present.

---

## 🌐 Deploying to Vercel

1. Push to GitHub or GitLab.
2. Import the repo in Vercel.
3. Set **Environment Variables** in Vercel (same as `.env` above).
4. Vercel will detect `Dockerfile` and build the image automatically.
5. Your live app will be deployed at `https://<your-vercel-domain>.vercel.app`.

---

## ✅ Best Practices

* Always use `.env.example` for placeholders; never commit real secrets.
* Keep database credentials and API keys secure.
* Use `NEXT_PUBLIC_` prefix for keys that are safe for client-side usage.
* Run migrations manually or via CI/CD pipeline in production.

---

## 🤝 Contributing

Contributions welcome! Open an issue or PR.
Make sure to **not commit secrets**.

---

**Happy budgeting!** 💚
FINOVA — Your AI-powered finance assistant.

---
