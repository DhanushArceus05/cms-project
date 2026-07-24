import Link from 'next/link';

export default function CmsPageNotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-ink-100 text-ink-500">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>
      <h1 className="text-lg font-semibold text-ink-900">Page not found</h1>
      <p className="mt-2 text-sm text-ink-500">
        This page doesn&apos;t exist, or hasn&apos;t been published yet.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-ink-900 px-5 text-sm font-medium text-white hover:bg-ink-800"
      >
        Back to home
      </Link>
    </div>
  );
}
