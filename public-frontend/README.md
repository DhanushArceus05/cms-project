# CMS Public Frontend

Public-facing website built with Next.js (App Router) + TypeScript + Tailwind CSS. Renders published CMS pages by fetching `GET /api/v1/public/pages/:slug` from the backend — no authentication, no admin logic.

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
  app/
    layout.tsx        Root shell — fonts, KaTeX stylesheet, header/footer
    page.tsx           Home page (hero + CMS explainer + link to /welcome)
    error.tsx           Global error boundary (backend unavailable, etc.)
    not-found.tsx       Fallback for routes outside the CMS slug segment
    [slug]/
      page.tsx          Dynamic CMS page — fetch, render, generateMetadata
      loading.tsx       Skeleton shown while the page is being fetched
      not-found.tsx     Shown for unknown slugs AND unpublished drafts alike
  components/
    layout/             Header (responsive nav), Footer
    blocks/              BlockRenderer + one component per block type
    ui/                  ErrorState, EmptyContentState
  lib/
    api/publicPages.ts   Typed, unauthenticated API call to the public endpoint
    types.ts              Types mirroring the backend's page/block contracts
    katex.ts               LaTeX → HTML rendering helper (server-side, KaTeX)
    utils.ts                Small className helper
```

## Notes

- **Drafts are never exposed.** The backend's public endpoint only returns pages with `status: "published"`; any other case (draft, or slug doesn't exist) comes back as 404, and the frontend treats both identically — it never distinguishes "draft" from "doesn't exist" in the UI.
- **Equations** are rendered server-side with KaTeX (`katex.renderToString`), so the math is present in the initial HTML — no client-side rendering flash. `displayMode` on the block controls centered/block layout vs. compact/inline layout.
- **Block order** is preserved exactly as returned by the backend; `BlockRenderer` sorts defensively by `order` before rendering as a safety net.
- **States**: `loading.tsx` covers the fetch-in-progress state, the segment-level `not-found.tsx` covers missing/draft pages, and the root `error.tsx` covers backend-unavailable/unexpected failures (with a "Try again" action).
