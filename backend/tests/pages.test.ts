import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { createTestAdmin, TEST_ADMIN, samplePagePayload } from './helpers';

const app = createApp();

const getToken = async (): Promise<string> => {
  const res = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: TEST_ADMIN.email, password: TEST_ADMIN.password });
  return res.body.data.token as string;
};

describe('Admin Pages', () => {
  let token: string;

  beforeEach(async () => {
    await createTestAdmin();
    token = await getToken();
  });

  it('creates a page with valid blocks', async () => {
    const res = await request(app)
      .post('/api/v1/pages')
      .set('Authorization', `Bearer ${token}`)
      .send(samplePagePayload());

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe('sample-page');
    expect(res.body.data.blocks).toHaveLength(2);
  });

  it('treats regex metacharacters in the search query as literal text', async () => {
    await request(app)
      .post('/api/v1/pages')
      .set('Authorization', `Bearer ${token}`)
      .send(samplePagePayload({ title: 'Pricing (2024)', slug: 'pricing-2024' }));

    // An unescaped "(" would be invalid regex syntax and throw a 500;
    // escaped, it should just find no literal match instead of erroring.
    const noMatch = await request(app)
      .get('/api/v1/pages')
      .set('Authorization', `Bearer ${token}`)
      .query({ search: '(unclosed' });

    expect(noMatch.status).toBe(200);
    expect(noMatch.body.data.items).toHaveLength(0);

    // The literal substring, parentheses included, should still match.
    const match = await request(app)
      .get('/api/v1/pages')
      .set('Authorization', `Bearer ${token}`)
      .query({ search: 'Pricing (2024)' });

    expect(match.status).toBe(200);
    expect(match.body.data.items).toHaveLength(1);
    expect(match.body.data.items[0].slug).toBe('pricing-2024');
  });

  it('rejects a page containing an invalid block', async () => {
    const res = await request(app)
      .post('/api/v1/pages')
      .set('Authorization', `Bearer ${token}`)
      .send(
        samplePagePayload({
          blocks: [{ type: 'heading', order: 0, data: { level: 9, text: 'Bad heading' } }],
        })
      );

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects a page where two or more blocks share the same order value', async () => {
    const res = await request(app)
      .post('/api/v1/pages')
      .set('Authorization', `Bearer ${token}`)
      .send(
        samplePagePayload({
          blocks: [
            { type: 'heading', order: 0, data: { level: 1, text: 'First' } },
            { type: 'paragraph', order: 0, data: { text: 'Duplicate order with the heading above.' } },
          ],
        })
      );

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(JSON.stringify(res.body.error.details)).toMatch(/duplicate/i);
  });
});
