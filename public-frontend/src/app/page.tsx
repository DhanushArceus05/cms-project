import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description: 'A CMS-driven public website — every page here is served from the CMS backend.',
};

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-24">
      <section className="text-center">
        <span className="inline-block rounded-full bg-accent-50 px-3 py-1 text-xs font-medium text-accent-700">
          Powered by a custom CMS
        </span>
        <h1 className="mx-auto mt-5 max-w-2xl text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl md:text-5xl">
          Content managed in the admin.
          <br className="hidden sm:block" /> Rendered here, live.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-ink-600">
          This site doesn&apos;t hardcode any of its page content. Every page — headings, paragraphs,
          lists, tables, and equations — is authored in the CMS admin and fetched from the backend
          API at request time.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/welcome"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-ink-900 px-6 text-sm font-medium text-white transition-colors hover:bg-ink-800"
          >
            View the welcome page
          </Link>
        </div>
      </section>

      <section className="mt-20 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FeatureCard
          title="Dynamic pages"
          description="Any published slug renders through a single dynamic route — no rebuild required."
        />
        <FeatureCard
          title="Rich content blocks"
          description="Headings, paragraphs, nested lists, tables, and LaTeX equations, in the order the author set."
        />
        <FeatureCard
          title="Published-only"
          description="Draft pages are never exposed here — only content marked published by an admin appears."
        />
      </section>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
      <h2 className="text-sm font-semibold text-ink-900">{title}</h2>
      <p className="mt-1.5 text-sm text-ink-500">{description}</p>
    </div>
  );
}
