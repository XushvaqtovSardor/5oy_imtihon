FROM node:22-alpine as production
WORKDIR /app

RUN npm install -g pnpm \
    && apk add --no-cache curl dumb-init \
    && addgroup -g 1001 -S nodejs \
    && adduser -S -u 1001 nodejs

COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist  
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

RUN mkdir -p /app/uploads && \
    chown -R nodejs:nodejs /app/uploads && \
    chmod -R 755 /app/uploads

USER nodejs
ENV PNPM_HOME="/home/node/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

EXPOSE 3000
ENTRYPOINT [ "dumb-init","--" ]
CMD ["sh", "-c", "pnpm prisma db push && exec node dist/main.js"]
