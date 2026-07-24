// The admin SPA authenticates exclusively via a Bearer token (Authorization
// header on every protected request). There is no cookie-based auth — we
// persist the token in localStorage so a page refresh doesn't lose the session.

const TOKEN_KEY = 'cms_admin_token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Storage may be unavailable (private browsing, quota) — session simply
    // won't persist across reloads, which is an acceptable degradation.
  }
}

export function clearToken(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // no-op
  }
}
