# CMS Admin Frontend (Phase 3)

Admin dashboard for the CMS assignment, built with Next.js (App Router) + TypeScript + Tailwind CSS. Consumes the Phase 2 backend's existing REST API with no contract changes.

## Auth model

The backend issues a JWT on login. This frontend stores that token in `localStorage` and sends it as `Authorization: Bearer <token>` on every protected request. There is no cookie-based auth anywhere in this app — the Bearer header is the only credential.

## Setup

```bash
cp .env.example .env.local   # then set NEXT_PUBLIC_API_URL to your backend's base URL
npm install
npm run dev
```

`NEXT_PUBLIC_API_URL` must point at the backend's versioned API root, e.g. `http://localhost:5000/api/v1`.

## Verification

```bash
npm install
npm run build
npm run lint
```

## Structure

```
src/
  app/                    Routes (App Router)
    login/                Public login page
    (admin)/              Protected shell (sidebar + topbar), guarded client-side
      dashboard/          Summary cards + recent pages
      pages/              List, create, edit
  components/
    ui/                   Reusable primitives (Button, Input, Card, Toast, ...)
    layout/               Sidebar, Topbar, AuthGuard
    pages/                Pages-list and page-form specific components
    blocks/               Content block editor (5 block types) + forms
    preview/              Read-view rendering used by the Preview modal
  lib/
    api/                  Typed API layer (auth.ts, pages.ts, client.ts)
    auth/                 Token storage + AuthContext (session persistence)
    types.ts              Types mirroring the backend's page/block contracts
    utils.ts              Slugify, date formatting, class-name helper
```

## Notes

- Route protection is client-side (`AuthGuard` + `AuthContext`), matching the Bearer-token model — there's no server-side session for Next middleware to read.
- The block editor supports add/remove/reorder (drag handle + up/down buttons) and inline editing for all 5 block types, with a live Preview modal before saving.
- List blocks support nesting up to 3 levels, matching the backend's validation.
