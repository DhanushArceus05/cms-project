# --- Build stage -------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- Production stage ---------------------------------------------------
FROM node:20-alpine AS production

WORKDIR /app
ENV NODE_ENV=production

# `tsx` is a devDependency, but the manual seed workflow (`npm run seed`)
# runs `tsx scripts/seed.ts` directly against TypeScript source rather than
# a build artifact. Installing just this one package (instead of the full
# devDependency set) is the smallest way to keep `npm run seed` working
# unchanged inside the production image without shipping a dev toolchain.
COPY package*.json ./
RUN npm ci --omit=dev \
    && NODE_ENV=development npm install --no-save tsx

# Compiled app the container actually runs.
COPY --from=builder /app/dist ./dist

# Source needed only so `npm run seed` (tsx scripts/seed.ts) can run inside
# this image. The server itself always runs from ./dist, never from source.
COPY --from=builder /app/src ./src
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

EXPOSE 5000

# Runs as the built-in unprivileged "node" user rather than root
USER node

CMD ["node", "dist/server.js"]
