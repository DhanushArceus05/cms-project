'use client';

import { useEffect } from 'react';
import { PagePreview } from '@/components/preview/PagePreview';
import type { Block, PageStatus } from '@/lib/types';

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  slug: string;
  status: PageStatus;
  blocks: Block[];
}

export function PreviewModal({ open, onClose, title, slug, status, blocks }: PreviewModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-8">
      <div className="absolute inset-0 bg-ink-950/50" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Page preview"
        className="relative w-full max-w-2xl rounded-xl bg-white shadow-popover animate-in"
      >
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-3.5">
          <p className="text-sm font-semibold text-ink-900">Preview</p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
            aria-label="Close preview"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="m18 6-12 12M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto px-6 py-6">
          <PagePreview title={title} slug={slug} status={status} blocks={blocks} />
        </div>
      </div>
    </div>
  );
}
