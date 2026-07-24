import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from '../src/config/db';
import { env } from '../src/config/env';
import { logger } from '../src/config/logger';
import { Admin } from '../src/models/Admin';
import { Page } from '../src/models/Page';

const SAMPLE_SLUG = 'welcome';

const seedAdmin = async () => {
  const existing = await Admin.findOne({ email: env.ADMIN_SEED_EMAIL });
  if (existing) {
    logger.info(`Admin already exists (${env.ADMIN_SEED_EMAIL}), skipping.`);
    return;
  }

  const passwordHash = await bcrypt.hash(env.ADMIN_SEED_PASSWORD, 10);
  await Admin.create({
    username: env.ADMIN_SEED_USERNAME,
    email: env.ADMIN_SEED_EMAIL,
    passwordHash,
  });
  logger.info(`Seeded admin: ${env.ADMIN_SEED_EMAIL}`);
};

const seedSamplePage = async () => {
  const existing = await Page.findOne({ slug: SAMPLE_SLUG });
  if (existing) {
    logger.info(`Sample page already exists (slug: ${SAMPLE_SLUG}), skipping.`);
    return;
  }

  await Page.create({
    title: 'Welcome',
    slug: SAMPLE_SLUG,
    status: 'published',
    publishedAt: new Date(),
    blocks: [
      {
        type: 'heading',
        order: 0,
        data: { level: 1, text: 'Welcome to the CMS-driven site' },
      },
      {
        type: 'paragraph',
        order: 1,
        data: {
          text: 'This page is entirely served from MongoDB through the CMS API — nothing here is hardcoded on the frontend.',
        },
      },
      {
        type: 'list',
        order: 2,
        data: {
          style: 'unordered',
          items: [
            { text: 'Supports headings, paragraphs, and lists' },
            {
              text: 'Nested lists up to three levels deep',
              items: [{ text: 'Second level item', items: [{ text: 'Third level item' }] }],
            },
            { text: 'Tables and LaTeX equations too' },
          ],
        },
      },
      {
        type: 'table',
        order: 3,
        data: {
          headers: ['Block Type', 'Purpose'],
          rows: [
            ['heading', 'Section titles'],
            ['paragraph', 'Body text'],
            ['list', 'Ordered/unordered, nested up to 3 levels'],
            ['table', 'Tabular data'],
            ['equation', 'LaTeX math, inline or block'],
          ],
        },
      },
      {
        type: 'equation',
        order: 4,
        data: { latex: 'E = mc^2', displayMode: true },
      },
    ],
  });

  logger.info(`Seeded sample page: /${SAMPLE_SLUG}`);
};

const run = async () => {
  try {
    await connectDB();
    await seedAdmin();
    await seedSamplePage();
    logger.info('Seed complete.');
  } catch (error) {
    logger.error('Seed failed', error);
    process.exitCode = 1;
  } finally {
    await disconnectDB();
  }
};

run();
