import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchPublicPage } from '@/lib/api/publicPages';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { EmptyContentState } from '@/components/ui/EmptyContentState';

interface PageProps {
  params: { slug: string };
}

// Pulls a short description from the first paragraph block, if any, for SEO.
function deriveDescription(page: Awaited<ReturnType<typeof fetchPublicPage>>): string | undefined {
  if (!page) return undefined;
  const firstParagraph = page.blocks.find((b) => b.type === 'paragraph');
  if (firstParagraph && firstParagraph.type === 'paragraph') {
    const text = firstParagraph.data.text.trim();
    return text.length > 160 ? `${text.slice(0, 157)}...` : text;
  }
  return undefined;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = await fetchPublicPage(params.slug);
  if (!page) {
    return { title: 'Page not found' };
  }
  return {
    title: page.title,
    description: deriveDescription(page),
  };
}

export default async function CmsPage({ params }: PageProps) {
  const page = await fetchPublicPage(params.slug);

  if (!page) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
      <div className="mb-8 flex items-center justify-between border-b border-ink-100 pb-4">
        <Link href="/" className="text-sm font-medium text-ink-500 hover:text-ink-800">
          ← Back to home
        </Link>
        <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{page.title}</p>
      </div>

      {page.blocks.length === 0 ? <EmptyContentState /> : <BlockRenderer blocks={page.blocks} />}
    </article>
  );
}
