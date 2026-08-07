FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies
FROM base as deps
COPY package*.json ./
RUN npm ci

# Runner Application
FROM base as runner
COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3200

CMD ["npm", "run", "dev"]
