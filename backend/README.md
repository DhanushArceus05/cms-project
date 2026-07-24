# CMS Backend

Express + TypeScript + MongoDB backend for the CMS assignment. Phase 2 of the project — admin and public frontends are not part of this package.

## Installation

```bash
cd backend
npm install
```

## Environment Variables

Copy the template and fill in real values for local development:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` \| `production` \| `test` |
| `PORT` | HTTP port the server listens on |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs (min 16 chars) |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `1d`, `12h` |
| `ADMIN_SEED_USERNAME` / `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` | Used only by `npm run seed` to create the one admin account |
| `CORS_ORIGIN` | Comma-separated list of allowed origins (admin + public frontend URLs) |

## Run

```bash
npm run dev     # local dev with hot reload (tsx watch)
```

## Build

```bash
npm run build    # compiles src/ -> dist/
npm start         # runs the compiled server (dist/server.js)
```

## Seed

Creates one admin account and one sample published page containing every supported block type. Safe to re-run — it skips insertion if the admin/page already exist.

```bash
npm run seed
```

## Test

Runs against an in-memory MongoDB instance (`mongodb-memory-server`) — no real database or `.env` needed to run tests.

```bash
npm run test
```

## API Summary

Base path: `/api/v1`

### Authentication

Auth is **JWT Bearer tokens only** — there is no cookie-based session.

- `POST /auth/login` returns `{ token, admin }` in the response body. The admin frontend stores this token (e.g. in memory or `localStorage`) and sends it on every subsequent request as `Authorization: Bearer <token>`.
- `POST /auth/logout` is a stateless success endpoint. Since JWTs carry no server-side session, there is nothing for the server to invalidate — the response tells the caller to discard its stored token. The endpoint exists so the admin frontend has a predictable call to make on logout, and to leave room for real token revocation later if needed.
- Protected routes accept **only** the `Authorization: Bearer <token>` header. No cookie is set or read anywhere in this API.

### Auth
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/auth/login` | Public | Returns a JWT + admin profile |
| POST | `/auth/logout` | Public | Stateless success response — see Authentication below |
| GET | `/auth/me` | Protected | Returns the current admin |

### Admin Pages (JWT required — `Authorization: Bearer <token>`)
| Method | Route | Description |
|---|---|---|
| GET | `/pages` | List pages — supports `?search=`, `?status=draft\|published`, `?page=`, `?limit=` |
| GET | `/pages/:id` | Get one page |
| POST | `/pages` | Create a page |
| PUT | `/pages/:id` | Update a page |
| DELETE | `/pages/:id` | Delete a page |

### Public (no auth)
| Method | Route | Description |
|---|---|---|
| GET | `/public/pages/:slug` | Returns a page **only if `status: "published"`** |

### Health
| Method | Route | Description |
|---|---|---|
| GET | `/health` | `{ status, uptime, timestamp, database }` |

## Response Envelope

**Success**
```json
{ "success": true, "data": {}, "message": "" }
```

**Error**
```json
{ "success": false, "error": { "code": "", "message": "", "details": [] } }
```

Error codes: `VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `INVALID_ID`, `DATABASE_ERROR`, `INTERNAL_ERROR`.

## Content Blocks

A page is a `title`, unique `slug`, `status` (`draft` | `published`), and an ordered array of `blocks`. Supported block types: `heading` (level 1-6), `paragraph`, `list` (ordered/unordered, nested up to 3 levels), `table` (row length must match header count), `equation` (raw LaTeX string, `displayMode` for block vs inline). Blocks are sorted server-side by `order` before persisting, so consumers never need to sort client-side.

## Docker

Only `backend/Dockerfile` is part of this phase (multi-stage build, runs as non-root `node` user). The root `docker-compose.yml` wiring this up with MongoDB is a later phase.

```bash
docker build -t cms-backend .
docker run --env-file .env -p 5000:5000 cms-backend
```

## Assumptions

- Single admin role — no permission tiers or registration endpoint.
- Logout is stateless (JWT isn't blacklisted server-side): the endpoint returns success and tells the client to discard its token, but a still-valid Bearer token held client-side would keep working until it expires. Acceptable trade-off at this scope — a token-blacklist or short-lived-token + refresh-token setup would be the production hardening step.
- Nested lists are capped at exactly 3 levels by the schema shape itself, not a runtime depth counter.
- No Media/upload entity — not required by any block type used here.
