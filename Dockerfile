# Build stage
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

# Install dependencies (including devDependencies for building)
RUN npm install

COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy built assets from builder stage
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]