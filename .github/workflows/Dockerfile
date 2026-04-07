# ====================== Build Stage ======================
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build --if-present

# ====================== Production Stage ======================
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist          # ← Change "dist" to "build" if your build outputs to "build" folder

# Optional: copy other needed folders
# COPY --from=builder /app/public ./public

RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 -G nodejs nodeuser

USER nodeuser

EXPOSE 8080

CMD ["npm", "start"]