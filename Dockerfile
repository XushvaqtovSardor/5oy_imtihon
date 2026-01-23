FROM node:22-alpine AS dependencies

RUN npm install -g pnpm

WORKDIR /app

COPY package*.json ./
RUN pnpm install && pnpm cache clean --force


FROM node:22-alpine AS builder

RUN npm install -g pnpm
WORKDIR /app



COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN pnpm run build
RUN pnpm prune --production

FROM node:22-alpine as production
WORKDIR /app
RUN apk add --no-cache curl dumb-init
RUN addgroup -g 1001 -S nodejs && \
    adduser  -S nodejs -u 1001
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma

COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist  
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

RUN mkdir -p /app/uploads && \
    chown -R nodejs:nodejs /app/uploads && \
    chmod -R 755 /app/uploads
USER nodejs

EXPOSE 3000
ENTRYPOINT [ "dumb-init","--" ]

CMD ["sh", "-c", "npx prisma generate && npx prisma db push && exec node dist/main.js"]
