import { getToken } from '@/lib/auth/token';
import type { ApiEnvelope } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';

export class ApiClientError extends Error {
  code: string;
  status: number;
  details: unknown[];

  constructor(message: string, code: string, status: number, details: unknown[] = []) {
    super(message);
    this.name = 'ApiClientError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  auth?: boolean; // attach Bearer token — defaults to true
  signal?: AbortSignal;
}

/**
 * Thin wrapper around fetch that talks to the CMS backend's /api/v1 routes,
 * normalizes the { success, data, message } / { success, error } envelope,
 * and throws a typed ApiClientError so UI code can branch on `code`/`status`
 * without re-parsing the response shape everywhere.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true, signal } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (auth) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch {
    throw new ApiClientError(
      'Could not reach the server. Check your connection and that the API is running.',
      'NETWORK_ERROR',
      0
    );
  }

  let payload: ApiEnvelope<T> | undefined;
  try {
    payload = (await response.json()) as ApiEnvelope<T>;
  } catch {
    // Non-JSON response (e.g. the API is entirely down and a proxy returned HTML).
  }

  if (!response.ok || !payload || payload.success === false) {
    const message =
      payload && payload.success === false ? payload.error.message : `Request failed (${response.status})`;
    const code = payload && payload.success === false ? payload.error.code : 'UNKNOWN_ERROR';
    const details = payload && payload.success === false ? payload.error.details ?? [] : [];
    throw new ApiClientError(message, code, response.status, details);
  }

  return payload.data;
}
