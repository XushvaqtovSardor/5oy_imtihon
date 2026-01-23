FROM node:20-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile
RUN pnpm prisma generate

COPY . .
RUN pnpm build

FROM node:20-alpine
RUN npm install -g pnpm
RUN apk add --no-cache bash postgresql-client
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN pnpm install --prod --frozen-lockfile
RUN pnpm prisma generate

COPY --from=builder /app/dist ./dist

EXPOSE ${PORT:-3000}

CMD sh -c "npx wait-for-it \$DB_HOST:\$DB_PORT -- pnpm prisma migrate deploy && node dist/main"
