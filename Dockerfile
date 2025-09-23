# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install
COPY . .

# Build Next.js
RUN npm run build

# Runner stage (final image)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy only package files & install prod deps
COPY package*.json ./
RUN npm install --omit=dev

# Copy built assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/db ./db
EXPOSE 3000
CMD ["npm", "start"]
