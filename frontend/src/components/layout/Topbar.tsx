'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const mobileNavItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/pages', label: 'Pages' },
];

export function Topbar() {
  const { admin, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      router.replace('/login');
    }
  };

  const initials = (admin?.username ?? admin?.email ?? '?').slice(0, 1).toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-ink-100 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900 text-white md:hidden">
            <span className="text-sm font-semibold">C</span>
          </div>
          <h1 className="text-base font-semibold text-ink-900 md:hidden">CMS Admin</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-100 text-sm font-semibold text-accent-700">
              {initials}
            </div>
            <div className="leading-tight">
              <p className="text-sm font-medium text-ink-800">{admin?.username}</p>
              <p className="text-xs text-ink-400">{admin?.email}</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={handleLogout} isLoading={isLoggingOut}>
            Logout
          </Button>
        </div>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto border-t border-ink-100 px-4 py-2 md:hidden">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'shrink-0 rounded-md px-3 py-1.5 text-sm font-medium',
                isActive ? 'bg-ink-900 text-white' : 'text-ink-600 hover:bg-ink-50'
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
