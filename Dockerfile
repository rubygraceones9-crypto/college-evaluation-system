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
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/database ./database
COPY --from=builder /app/tools ./tools

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
