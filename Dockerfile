# Use Node 18 Alpine (lightweight)
FROM node:18-alpine

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies (including dev if needed for build)
RUN npm ci

# Copy the rest of your application code
COPY . .

# Run build if it exists (safe command)
RUN npm run build --if-present

# Security: run as non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 -G nodejs nodeuser
USER nodeuser

# Azure App Service expects the app to listen on this port by default
EXPOSE 8080

# Start the application using your "start" script from package.json
CMD ["npm", "start"]