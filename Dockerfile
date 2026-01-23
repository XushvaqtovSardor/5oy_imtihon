FROM node:22-alpine

    WORKDIR /app 

    COPY package*.json ./
    RUN npm i -g pnpm
    RUN pnpm install

    COPY . . 

    RUN npx prisma generate

    RUN pnpm run build

    EXPOSE 4000

    CMD ["pnpm","run","start:prod"]
        
