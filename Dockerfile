FROM node:22-bookworm-slim AS build
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN mkdir -p /app/.local/menu-backups && chown -R node:node /app/.local /app/.next
ENV NODE_ENV=production
USER node
EXPOSE 3000
CMD ["npm", "run", "start"]
