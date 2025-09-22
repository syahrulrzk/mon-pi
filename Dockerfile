# Step 1: build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install   # install semua dependencies termasuk dev

COPY . .
RUN npm run build

# Step 2: production runtime
FROM node:20-alpine AS runner
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev  # cuma prod deps

COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

CMD ["npm", "start"]
