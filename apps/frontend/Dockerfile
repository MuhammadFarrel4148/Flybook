FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies
FROM base as deps
COPY package*.json ./
RUN npm ci

# Build Application
FROM base as builder
COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner Application
FROM base as runner
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "run", "dev"] 