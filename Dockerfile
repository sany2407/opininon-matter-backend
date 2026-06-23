# Use the official Bun image
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Copy application code
COPY src ./src
COPY swagger.yaml ./

# Cloud Run injects the PORT environment variable
EXPOSE 8080
ENV PORT=8080

# Start the server
CMD ["bun", "run", "src/index.ts"]
