# Сборка сайта для Railway через Docker.
# Используем официальный образ Node.js — не зависит от образов Railpack.

FROM node:22-bookworm-slim AS base
# OpenSSL нужен Prisma для подключения к PostgreSQL
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ── Сборка ──────────────────────────────────────────────
FROM base AS build
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN if [ -f package-lock.json ]; then npm ci; else npm install --no-audit --no-fund; fi
COPY . .
# Публичный адрес сайта подставляется при сборке (переменная из Railway)
ARG NEXT_PUBLIC_SITE_URL
ARG RAILWAY_PUBLIC_DOMAIN
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    RAILWAY_PUBLIC_DOMAIN=$RAILWAY_PUBLIC_DOMAIN
RUN npm run build

# ── Запуск ──────────────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production
COPY --from=build /app ./
EXPOSE 8080
# Применяет миграции базы и запускает сайт на порту $PORT
CMD ["npm", "run", "start"]
