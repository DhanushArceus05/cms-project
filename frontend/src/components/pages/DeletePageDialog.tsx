'use client';

import { useState } from 'react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { deletePage } from '@/lib/api/pages';
import { ApiClientError } from '@/lib/api/client';
import { useToast } from '@/components/ui/Toast';
import type { Page } from '@/lib/types';

interface DeletePageDialogProps {
  page: Page | null;
  onClose: () => void;
  onDeleted: (id: string) => void;
}

export function DeletePageDialog({ page, onClose, onDeleted }: DeletePageDialogProps) {
  const { showToast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!page) return;
    setIsDeleting(true);
    try {
      await deletePage(page._id);
      showToast(`"${page.title}" was deleted.`, 'success');
      onDeleted(page._id);
    } catch (err) {
      const message = err instanceof ApiClientError ? err.message : 'Failed to delete the page.';
      showToast(message, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ConfirmDialog
      open={!!page}
      title={`Delete "${page?.title ?? ''}"?`}
      description="This will permanently remove the page and all of its content blocks. This action cannot be undone."
      confirmLabel="Delete page"
      variant="danger"
      isConfirming={isDeleting}
      onConfirm={handleConfirm}
      onCancel={onClose}
    />
  );
}
