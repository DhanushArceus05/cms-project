import { apiRequest } from '@/lib/api/client';
import type { Page, PageInput, PagesListResult, PageStatus } from '@/lib/types';

export interface ListPagesParams {
  search?: string;
  status?: PageStatus | 'all';
  page?: number;
  limit?: number;
}

export function listPages(params: ListPagesParams = {}): Promise<PagesListResult> {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.status && params.status !== 'all') query.set('status', params.status);
  query.set('page', String(params.page ?? 1));
  query.set('limit', String(params.limit ?? 10));

  return apiRequest<PagesListResult>(`/pages?${query.toString()}`);
}

export function getPage(id: string): Promise<Page> {
  return apiRequest<Page>(`/pages/${id}`);
}

export function createPage(input: PageInput): Promise<Page> {
  return apiRequest<Page>('/pages', { method: 'POST', body: input });
}

export function updatePage(id: string, input: Partial<PageInput>): Promise<Page> {
  return apiRequest<Page>(`/pages/${id}`, { method: 'PUT', body: input });
}

export function deletePage(id: string): Promise<null> {
  return apiRequest<null>(`/pages/${id}`, { method: 'DELETE' });
}
