# ====================== Stage 1: Build ======================
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Run build if it exists in package.json (safe if no build script)
RUN npm run build --if-present

# ====================== Stage 2: Production Runtime ======================
FROM node:18-alpine

WORKDIR /app

# Copy only production dependencies + built files from builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Copy the built output (common folders)
COPY --from=builder /app/dist ./dist          # ← Change to "build" if your build outputs to "build"
# COPY --from=builder /app/.next ./.next      # Uncomment if using Next.js
# COPY --from=builder /app/public ./public    # Uncomment if you have a public folder

# Create a non-root user for better security (recommended for Azure)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 -G nodejs nodeuser

# Switch to non-root user
USER nodeuser

# Expose the port (Azure App Service uses this)
EXPOSE 8080

# Start the application using the script from package.json
CMD ["npm", "start"]