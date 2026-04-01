FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Use --legacy-peer-deps if needed
RUN npm install
COPY . .
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=10000
ENV HOSTNAME=0.0.0.0

# Standalone build artifacts
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/database ./database
COPY --from=builder /app/tools ./tools

EXPOSE 10000
CMD ["node", "server.js"]
