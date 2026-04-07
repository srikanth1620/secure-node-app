# ====================== Build Stage ======================
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Run build only if the script exists (safe)
RUN npm run build --if-present

# ====================== Production Stage ======================
FROM node:18-alpine

WORKDIR /app

# Copy package files and production dependencies
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Copy the built application - Try these common folders one by one
# Option A: dist (most common for TypeScript, Vite, Webpack)
# COPY --from=builder /app/dist ./dist

# Option B: build (common for Create React App, some setups)
COPY --from=builder /app/build ./build

# Option C: If your app has no build step (plain Express/Fastify), copy everything
# COPY --from=builder /app ./

# Security: run as non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 -G nodejs nodeuser
USER nodeuser

EXPOSE 8080

# Start the app using your package.json "start" script
CMD ["npm", "start"]