import bcrypt from 'bcryptjs';
import { Admin } from '../src/models/Admin';

export const TEST_ADMIN = {
  username: 'admin',
  email: 'admin@example.com',
  password: 'TestPassword123!',
};

export const createTestAdmin = async () => {
  const passwordHash = await bcrypt.hash(TEST_ADMIN.password, 10);
  return Admin.create({
    username: TEST_ADMIN.username,
    email: TEST_ADMIN.email,
    passwordHash,
  });
};

export const samplePagePayload = (overrides: Record<string, unknown> = {}) => ({
  title: 'Sample Page',
  slug: 'sample-page',
  status: 'published',
  blocks: [
    { type: 'heading', order: 0, data: { level: 1, text: 'Hello' } },
    { type: 'paragraph', order: 1, data: { text: 'Some body text.' } },
  ],
  ...overrides,
});
