import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { createTestAdmin, TEST_ADMIN } from './helpers';

const app = createApp();

describe('Auth', () => {
  beforeEach(async () => {
    await createTestAdmin();
  });

  it('logs in successfully with correct credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: TEST_ADMIN.email, password: TEST_ADMIN.password });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeTruthy();
    expect(res.body.data.admin.email).toBe(TEST_ADMIN.email);
  });

  it('rejects login with an incorrect password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: TEST_ADMIN.email, password: 'WrongPassword!' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('blocks access to a protected route without a token', async () => {
    const res = await request(app).get('/api/v1/pages');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});
