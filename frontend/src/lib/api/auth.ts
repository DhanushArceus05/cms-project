import { apiRequest } from '@/lib/api/client';
import type { Admin } from '@/lib/types';

export interface LoginResponse {
  token: string;
  admin: Admin;
}

export function login(email: string, password: string): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });
}

export function logout(): Promise<null> {
  return apiRequest<null>('/auth/logout', { method: 'POST' });
}

export function fetchCurrentAdmin(): Promise<Admin> {
  return apiRequest<Admin>('/auth/me', { method: 'GET' });
}
