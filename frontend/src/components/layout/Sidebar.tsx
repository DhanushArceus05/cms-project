'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (
      <path d="M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6V11h-6v9Zm0-16v5h6V4h-6Z" />
    ),
  },
  {
    href: '/pages',
    label: 'Pages',
    icon: (
      <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm8 1.5V8h4.5M8 12h8M8 16h8M8 8h3" />
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r border-ink-100 bg-white md:flex md:flex-col">
      <div className="flex h-16 items-center gap-2.5 border-b border-ink-100 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900 text-white">
          <span className="text-sm font-semibold">C</span>
        </div>
        <span className="text-sm font-semibold text-ink-900">CMS Admin</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-ink-900 text-white' : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
              )}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                {item.icon}
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-ink-100 px-5 py-4">
        <p className="text-xs text-ink-400">CMS Admin</p>
      </div>
    </aside>
  );
}
