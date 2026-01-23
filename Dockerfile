FROM node:20-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app


COPY prisma ./prisma

RUN pnpm install --no-frozen-lockfile
RUN pnpm prisma generate
COPY . .
RUN pnpm build

CMD [ "pnpm","run","start:dev" ]