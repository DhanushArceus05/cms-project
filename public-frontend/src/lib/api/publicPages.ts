import type { ApiEnvelope, Page } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';

/**
 * Thrown for genuine failures (network unreachable, 5xx, malformed response) —
 * anything that should surface the site's "something went wrong" error state.
 * A missing/unpublished page is NOT an error: fetchPublicPage returns null for
 * that case so the caller can invoke Next's notFound() instead.
 */
export class PublicApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PublicApiError';
  }
}

/**
 * Fetches a published page by slug from the public backend endpoint
 * (GET /public/pages/:slug). No Authorization header is ever sent here —
 * this route is intentionally unauthenticated and only ever returns
 * pages with status "published" (the backend enforces that, not us).
 *
 * Returns:
 *  - the Page, if found and published
 *  - null, if the backend reports "not found" (covers drafts and unknown slugs alike)
 * Throws:
 *  - PublicApiError, for network failures or any other non-404 error
 */
export async function fetchPublicPage(slug: string): Promise<Page | null> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/public/pages/${encodeURIComponent(slug)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
  } catch {
    throw new PublicApiError('Could not reach the server. Please try again later.');
  }

  if (response.status === 404) {
    return null;
  }

  let payload: ApiEnvelope<Page> | undefined;
  try {
    payload = (await response.json()) as ApiEnvelope<Page>;
  } catch {
    // Non-JSON response — treat as a generic server failure below.
  }

  if (!response.ok || !payload || payload.success === false) {
    const message = payload && payload.success === false ? payload.error.message : `Request failed (${response.status})`;
    throw new PublicApiError(message);
  }

  return payload.data;
}
