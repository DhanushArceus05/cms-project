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

# NEXT_PUBLIC_* variables are inlined at build time. Every fetch in this app
# (page render + generateMetadata) runs server-side only — there is no
# client-side fetch anywhere in public-frontend — so this should be the
# Docker-internal backend URL, e.g. http://backend:5000/api/v1, not
# localhost and not a host-mapped port.
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
