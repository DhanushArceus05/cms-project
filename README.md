# CMS Project

A small CMS: a JWT-authenticated admin panel for creating/editing pages made
of typed content blocks, and a public site that renders published pages by
slug.

## Architecture

```
Browser (admin) ──────► frontend (Next.js, :3000) ─────┐
Browser (visitor) ─────► public-frontend (Next.js, :3001) ──► backend (Express, :5000) ──► mongodb (:27017)
```

- **backend** — all data access and business logic. Bearer-JWT auth for
  admin routes, an unauthenticated endpoint that serves published pages
  only.
- **frontend** — admin SPA. Every API call is made from the browser
  (`Authorization: Bearer <token>`, token kept in `localStorage`).
- **public-frontend** — public site. Every API call is made **server-side**
  inside the container (page rendering, `generateMetadata`), never from the
  browser.

## Folder Structure

```
cms-project/
├── backend/           Express + TypeScript + MongoDB API
├── frontend/           Admin Next.js app
├── public-frontend/     Public Next.js app
├── docker-compose.yml   Orchestrates all four services
└── .env.example         Root Compose environment template
```

## Technology Stack

| Layer | Stack |
|---|---|
| Backend | Node 20, Express, TypeScript, Mongoose, Zod, JWT, Vitest |
| Admin frontend | Next.js 14 (App Router), React 18, Tailwind |
| Public frontend | Next.js 14 (App Router), React 18, Tailwind, KaTeX |
| Database | MongoDB 7 |
| Containers | Docker multi-stage builds, Docker Compose |

## Prerequisites

- Docker and Docker Compose v2 (`docker compose ...`, not the legacy
  `docker-compose` binary)
- For non-Docker/local development only: Node.js 20+, npm, and a local
  MongoDB instance

## Local (non-Docker) setup

Each app has its own `.env.example` and `README.md` with full detail. In
short, in three terminals:

```bash
cd backend && npm install && cp .env.example .env && npm run dev
cd frontend && npm install && cp .env.example .env.local && npm run dev
cd public-frontend && npm install && cp .env.example .env.local && npm run dev
```

## Docker Setup

### 1. Create the root environment file

```bash
cp .env.example .env
```

Edit `.env` and set at least `JWT_SECRET` and `ADMIN_SEED_PASSWORD` to real
values. See the comments in `.env.example` for what every variable does.

### 2. Validate, build, and start

```bash
docker compose config     # sanity-check the resolved config
docker compose build
docker compose up -d
docker compose ps
```

### 3. Watch backend logs (useful while MongoDB/backend come up)

```bash
docker compose logs -f backend
```

### 4. Seed the database (manual — not run automatically)

```bash
docker compose exec backend npm run seed
```

This creates the admin account (from `ADMIN_SEED_EMAIL` /
`ADMIN_SEED_PASSWORD`) and a sample published `/welcome` page. Safe to run
more than once — it skips anything that already exists.

## Service URLs

| Service | URL |
|---|---|
| Backend health | http://localhost:5000/health |
| Backend API | http://localhost:5000/api/v1 |
| Admin frontend | http://localhost:3000 |
| Public frontend | http://localhost:3001 |
| Public sample page | http://localhost:3001/welcome |
| MongoDB (local inspection only) | mongodb://localhost:27017 |

Log in to the admin frontend with the `ADMIN_SEED_EMAIL` /
`ADMIN_SEED_PASSWORD` values from your `.env`.

## Stopping / Rebuilding

```bash
docker compose down            # stop and remove containers (data persists)
docker compose build           # rebuild images after code/env changes
docker compose up -d --build   # rebuild + restart in one step
```

## Data Persistence

MongoDB data lives in the named volume `cms-mongodb-data`, so it survives:

```bash
docker compose down
docker compose up -d
```

**⚠️ `docker compose down -v` deletes the MongoDB volume — all pages and the
admin account will be permanently lost.** Only use it when you intend to
start from a completely empty database:

```bash
docker compose down -v
```

## Troubleshooting

**Port already in use** — something else on the host is bound to 3000,
3001, 5000, or 27017. Stop that process, or edit the host-side port in
`docker-compose.yml` (e.g. `"3002:3000"`) and reload the corresponding URL.

**Backend can't connect to MongoDB** — check `docker compose logs backend`
and `docker compose ps` (mongodb should show `healthy`). Because
`depends_on` uses `condition: service_healthy`, the backend will not even
start until MongoDB's health check passes, so this usually means MongoDB
itself failed to start — check `docker compose logs mongodb`.

**Frontend can't reach the backend** —
- Admin frontend: confirm `ADMIN_FRONTEND_API_URL` in `.env` is an address
  your *browser* can reach (default `http://localhost:5000/api/v1`).
- Public frontend: confirm `PUBLIC_FRONTEND_API_URL` in `.env` uses the
  Docker-internal hostname (default `http://backend:5000/api/v1`), since
  its API calls happen server-side, inside the container.
- Both values are baked in at *build* time (`NEXT_PUBLIC_*`), so after
  changing them you must rebuild: `docker compose up -d --build`.

**CORS errors in the browser console** — the backend only accepts origins
listed in `CORS_ORIGIN` (comma-separated). Make sure it includes whatever
host/port you're actually loading the frontend from, then
`docker compose up -d --build backend`.

**Rebuilding after environment changes** — runtime env vars (backend) take
effect on `docker compose up -d`; build-time env vars (`NEXT_PUBLIC_*` for
both frontends) require `docker compose build` (or `up -d --build`) to take
effect.

**Checking logs**

```bash
docker compose logs backend
docker compose logs frontend
docker compose logs public-frontend
docker compose logs mongodb
docker compose logs -f backend   # follow/tail
```

## Default Admin Credentials

After running the seed command:

```bash
docker compose exec backend npm run seed
```

Login using:

- Username: `admin`
- Email: `admin@example.com`
- Password: `Admin@123`

These values can be changed by editing the following environment variables:

- `ADMIN_SEED_USERNAME`
- `ADMIN_SEED_EMAIL`
- `ADMIN_SEED_PASSWORD`