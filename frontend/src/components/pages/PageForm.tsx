'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { createPage, updatePage } from '@/lib/api/pages';
import { ApiClientError } from '@/lib/api/client';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Label } from '@/components/ui/Label';
import { FieldError } from '@/components/ui/FieldError';
import { Alert } from '@/components/ui/Alert';
import { Card } from '@/components/ui/Card';
import { BlockEditor } from '@/components/blocks/BlockEditor';
import { PreviewModal } from '@/components/preview/PreviewModal';
import { stripEditorKey, toEditorBlock, type EditorBlock } from '@/components/blocks/editorTypes';
import { isValidSlug, slugify } from '@/lib/utils';
import type { Page, PageStatus } from '@/lib/types';

interface PageFormProps {
  mode: 'create' | 'edit';
  initialPage?: Page;
}

interface FieldErrors {
  title?: string;
  slug?: string;
  general?: string;
  detailList?: string[];
}

export function PageForm({ mode, initialPage }: PageFormProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [title, setTitle] = useState(initialPage?.title ?? '');
  const [slug, setSlug] = useState(initialPage?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(mode === 'edit');
  const [status, setStatus] = useState<PageStatus>(initialPage?.status ?? 'draft');
  const [blocks, setBlocks] = useState<EditorBlock[]>((initialPage?.blocks ?? []).map(toEditorBlock));

  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  };

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (!title.trim()) next.title = 'Title is required.';
    if (!slug.trim()) {
      next.slug = 'Slug is required.';
    } else if (!isValidSlug(slug)) {
      next.slug = 'Slug must be lowercase letters, numbers, and hyphens only (e.g. about-us).';
    }
    return next;
  };

  const handleSubmit = async () => {
    const validation = validate();
    setErrors(validation);
    if (validation.title || validation.slug) return;

    setIsSaving(true);
    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        status,
        blocks: blocks.map(stripEditorKey),
      };

      if (mode === 'create') {
        const created = await createPage(payload);
        showToast('Page created.', 'success');
        router.replace(`/pages/${created._id}/edit`);
      } else if (initialPage) {
        await updatePage(initialPage._id, payload);
        showToast('Page saved.', 'success');
        router.push('/pages');
      }
    } catch (err) {
      if (err instanceof ApiClientError) {
        const detailList = err.details
          .map((d) => (typeof d === 'object' && d && 'message' in d ? String((d as { message: unknown }).message) : null))
          .filter((m): m is string => !!m);
        setErrors({ general: err.message, detailList: detailList.length > 0 ? detailList : undefined });
      } else {
        setErrors({ general: 'Something went wrong while saving. Please try again.' });
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/pages" className="mb-1 inline-flex items-center gap-1 text-xs font-medium text-ink-500 hover:text-ink-700">
            ← Back to pages
          </Link>
          <h1 className="text-2xl font-semibold text-ink-900">{mode === 'create' ? 'Create page' : 'Edit page'}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setPreviewOpen(true)} type="button">
            Preview
          </Button>
          <Button onClick={handleSubmit} isLoading={isSaving} type="button">
            {mode === 'create' ? 'Create page' : 'Save changes'}
          </Button>
        </div>
      </div>

      {errors.general && (
        <div className="mb-4">
          <Alert message={errors.general} />
          {errors.detailList && (
            <ul className="mt-2 list-disc space-y-0.5 pl-5 text-xs text-rose-600">
              {errors.detailList.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <Card className="mb-5 p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="About us"
              error={errors.title}
            />
            <FieldError message={errors.title} />
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              placeholder="about-us"
              className="font-mono"
              error={errors.slug}
            />
            <FieldError message={errors.slug} />
          </div>
        </div>

        <div className="mt-4 max-w-xs">
          <Label htmlFor="status">Status</Label>
          <Select id="status" value={status} onChange={(e) => setStatus(e.target.value as PageStatus)}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </Select>
        </div>
      </Card>

      <div className="mb-3">
        <h2 className="text-sm font-semibold text-ink-900">Content blocks</h2>
        <p className="text-xs text-ink-500">Add and arrange the blocks that make up this page.</p>
      </div>
      <BlockEditor blocks={blocks} onChange={setBlocks} />

      <div className="mt-6 flex justify-end gap-2">
        <Link href="/pages">
          <Button variant="secondary" type="button">
            Cancel
          </Button>
        </Link>
        <Button onClick={handleSubmit} isLoading={isSaving} type="button">
          {mode === 'create' ? 'Create page' : 'Save changes'}
        </Button>
      </div>

      <PreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={title}
        slug={slug}
        status={status}
        blocks={blocks.map(stripEditorKey)}
      />
    </div>
  );
}
