FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat git python3 make g++

FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm install

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN npx @medusajs/cli build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=9000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 medusa

COPY --from=builder /app ./

EXPOSE 9000

CMD ["sh", "-c", "npx medusa db:migrate && npm run start"]
