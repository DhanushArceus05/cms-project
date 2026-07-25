# --- Dependencies stage --------------------------------------------------
FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci

# --- Build stage -----------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* variables are inlined into the browser bundle at build time.
# This admin app's API client runs entirely in the browser (Bearer token kept
# in localStorage), so it needs a host-accessible backend URL here, e.g.
# http://localhost:5000/api/v1 — not the Docker-internal service hostname.
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN npm run build

# --- Production stage -------------------------------------------------------
FROM node:20-alpine AS production

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# .next/standalone contains a minimal server plus only the node_modules it
# actually needs — no separate `npm ci` is required in this stage.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

# Runs as the built-in unprivileged "node" user rather than root
USER node

CMD ["node", "server.js"]
