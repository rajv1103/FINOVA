# Use a compatible Node version
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy Prisma schema first
COPY prisma ./prisma

# Then copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy rest of the codebase
COPY . .

# Optional: Run `prisma generate` here if you prefer manual control
# RUN npx prisma generate

# Build Next.js app
COPY .env.production .env
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
