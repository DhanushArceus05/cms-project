import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { Page } from '../src/models/Page';

const app = createApp();

describe('Public pages', () => {
  beforeEach(async () => {
    await Page.create({
      title: 'Published Page',
      slug: 'published-page',
      status: 'published',
      publishedAt: new Date(),
      blocks: [{ type: 'paragraph', order: 0, data: { text: 'Visible to everyone.' } }],
    });

    await Page.create({
      title: 'Draft Page',
      slug: 'draft-page',
      status: 'draft',
      blocks: [{ type: 'paragraph', order: 0, data: { text: 'Not ready yet.' } }],
    });
  });

  it('returns a published page by slug with no authentication', async () => {
    const res = await request(app).get('/api/v1/public/pages/published-page');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe('published-page');
  });

  it('hides a draft page from the public endpoint', async () => {
    const res = await request(app).get('/api/v1/public/pages/draft-page');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});
