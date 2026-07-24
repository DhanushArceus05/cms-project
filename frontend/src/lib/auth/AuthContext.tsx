'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { fetchCurrentAdmin, login as loginRequest, logout as logoutRequest } from '@/lib/api/auth';
import { clearToken, getToken, setToken } from '@/lib/auth/token';
import { ApiClientError } from '@/lib/api/client';
import type { Admin } from '@/lib/types';

interface AuthContextValue {
  admin: Admin | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, if a token was persisted from a previous session, validate it
  // against the backend and hydrate the admin — this is what makes a page
  // refresh keep you logged in instead of bouncing to /login.
  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      const token = getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const current = await fetchCurrentAdmin();
        if (!cancelled) setAdmin(current);
      } catch {
        clearToken();
        if (!cancelled) setAdmin(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    restoreSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginRequest(email, password);
    setToken(result.token);
    setAdmin(result.admin);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch (error) {
      // The server-side logout call is best-effort; since auth is Bearer-token-only,
      // clearing the local token is what actually ends the session client-side.
      if (!(error instanceof ApiClientError)) throw error;
    } finally {
      clearToken();
      setAdmin(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ admin, isLoading, isAuthenticated: !!admin, login, logout }),
    [admin, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
